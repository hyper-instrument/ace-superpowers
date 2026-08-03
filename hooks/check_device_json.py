#!/usr/bin/env python3
"""设备 device.json 标准校验核心（hook 共享）。

用法: check_device_json.py <device.json 绝对路径>，或由 hook 把 JSON 喂到 stdin。

职责（与 hook 系统无关，Cursor / Claude 两套封装都调它）：
  1. 只处理文件名为 device.json 的写入，其它一律 no-op（exit 0，无输出）。
  2. 校验 metadata.sdk_install —— 规则**委派**给已安装的 ace 包
     (``ace.core.devices.sdk_install.sdk_install_errors``)，本文件不再自带副本。
  3. 额外跑一次 `ace device validate <name>`（若能解析出名字）。
  4. 把「校验结果 + 标准模板内容」打到 stdout，供 hook 回灌给 agent 观察、自纠。

为什么不自带规则：这个 hook 曾硬编码过一份 {method, package} 白名单 + 强制
simulator_class，随框架演进漂移成与 `ace device validate` **结论相反**的第二套
标准 —— 它会拒掉合法的 oss wheel 设备，并禁止 `import_name`（而那正是
`is_sdk_installed` 唯一可靠的判定依据）。结果是 agent 被 hook 反复推向错误写法。
规则只能有一份，且必须跟着框架走。

退出码: 0=符合标准 / 1=有问题（封装据此决定是否 block）。报告始终打到 stdout。
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _ace_config import ensure_ace_importable  # noqa: E402


def _find_template() -> str:
    """定位 ace-device-onboarding 的 device-json-template.md（插件缓存，多层版本目录）。"""
    cache = Path.home() / ".claude" / "plugins" / "cache" / "ace-superpowers"
    hits = sorted(
        set(cache.glob("*/skills/ace-device-onboarding/references/device-json-template.md"))
        | set(cache.glob("*/*/skills/ace-device-onboarding/references/device-json-template.md")),
        reverse=True,
    )
    for p in hits:
        try:
            return p.read_text(encoding="utf-8")
        except OSError:
            continue
    # 兜底：内联最小标准（与 ace.core.devices.sdk_install 的规则保持一致）
    return (
        "metadata.sdk_install 三种形态，按 SDK 来源选一种：\n\n"
        '  pip   → {"method": "pip",   "package": "git+ssh://git@host/org/repo.git@<sha>",\n'
        '                              "import_name": ["<顶层模块名>"]}\n'
        '  local → {"method": "local", "package": "<本地 SDK 目录>",\n'
        '                              "import_name": ["<顶层模块名>"]}\n'
        '  oss   → {"method": "oss",   "key": "vendor/dist/sdk-1.2.3-py3-none-any.whl",\n'
        '                              "sha256": "<wheel sha256>",\n'
        '                              "import_name": ["<顶层模块名>"]}\n\n'
        "要点：\n"
        "  - 本地路径写在 package，**不是** path（path 只在 extra_packages[] 条目里有效）\n"
        "  - import_name 是装完后应能 import 的顶层模块名，缺了它 is_sdk_installed 无法判定\n"
        "  - 不要单独写版本号：pip 写进 package spec，oss 由 key 文件名 + sha256 确定\n"
        "  - simulator_class 已废弃，本地 backend 由 device.py 自动发现\n"
        "  - backend 完全自包含（没有导不进来的第三方 import）时可整块省略 sdk_install"
    )


def _strict_errors(data: dict, device_dir: Path) -> list[str] | None:
    """把校验完全委派给 ace 包；取不到 ace 时返回 None 表示「没查」。

    ``None`` 和 ``[]`` 必须分开：都当成空列表的话，装不到 ace 的机器上每份
    device.json 都会拿到一个「通过 sdk_install 标准校验」的绿勾 —— 恰恰是本
    hook 要拦的那种违规文件也照样绿。宁可放过，但不能谎报已查。
    """
    metadata = data.get("metadata") if isinstance(data, dict) else None
    if metadata is not None and not isinstance(metadata, dict):
        return ["metadata 必须是对象"]

    # hook 常由裸 python3 启动，框架 venv 的 site-packages 不在 sys.path 上。
    ensure_ace_importable()
    try:
        from ace.core.devices.sdk_install import sdk_install_errors
    except ImportError as exc:
        print(
            f"⚠️  跳过 sdk_install 校验：无法导入 ace 包 ({exc})。"
            "装好 ACE 后本 hook 才能给出与 `ace device validate` 一致的结论。",
            file=sys.stderr,
        )
        return None

    return sdk_install_errors(metadata, device_dir=device_dir)


def _ace_validate(name: str) -> str | None:
    """跑 ace device validate <name>，返回其输出（失败/不可用则 None）。"""
    if not name:
        return None
    try:
        r = subprocess.run(
            ["ace", "device", "validate", name],
            capture_output=True, text=True, timeout=60,
        )
        return (r.stdout + r.stderr).strip() or None
    except (OSError, subprocess.SubprocessError):
        return None


def _path_from_stdin() -> str:
    """hook 输入 JSON 的 schema 不确定，宽松扫描出第一个以 device.json 结尾的字符串。"""
    try:
        d = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return ""
    found: list[str] = []

    def walk(o: object) -> None:
        if isinstance(o, str):
            if o.endswith("device.json"):
                found.append(o)
        elif isinstance(o, dict):
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(d)
    return found[0] if found else ""


def _build_report(path: Path) -> tuple[str, int]:
    """校验 *path*，返回（给人/agent 看的报告, 退出码）。"""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return (
            f"❌ device.json 读取/解析失败: {exc}\n\n标准模板（请对照修正）:\n{_find_template()}",
            1,
        )

    errors = _strict_errors(data, path.parent)
    name = str(data.get("name") or "") if isinstance(data, dict) else ""
    ace_out = _ace_validate(name)
    validate_block = f"\n\n`ace device validate {name}`:\n{ace_out}" if ace_out else ""

    if errors is None:
        return (
            f"⚠️ 未能校验 device.json（{name or path}）：本机取不到 "
            "`ace.core.devices.sdk_install`，sdk_install 规则一条都没查。"
            "请勿据此认为文件合规。" + validate_block,
            0,
        )

    if not errors:
        return (f"✅ device.json 通过 sdk_install 标准校验（{name or path}）。" + validate_block, 0)

    listed = "\n".join(f"  - {e}" for e in errors)
    return (
        f"❌ device.json 不符合标准模板（{name or path}）：\n{listed}{validate_block}"
        "\n\n请严格对照下方标准模板修正 metadata.sdk_install，改完重写文件触发再次校验：\n\n"
        + _find_template(),
        1,
    )


def _emit_for_hook(report: str) -> None:
    """按当前 IDE 的 schema 包装报告，让它真的回灌到 agent 的上下文里。

    两家的字段名不同，且都会静默忽略不认识的形状 —— 直接打纯文本的话 hook 照常
    退出 0、日志里什么都不缺，只是 agent 永远看不到这份报告，而"让 agent 对照标准
    自纠"正是本 hook 存在的唯一理由。

    形状由 ``ACE_HOOK_SCHEMA`` 显式指定，调用方最清楚自己是谁。不靠嗅探
    ``CURSOR_*``：Claude 跑在 Cursor 的终端里时那些变量同样在场，于是 Claude 会
    拿到 Cursor 的形状 —— 一个不会报错、只是永远不生效的错法。
    """
    schema = os.environ.get("ACE_HOOK_SCHEMA", "").strip().lower()
    if schema not in ("cursor", "claude"):
        schema = "cursor" if os.environ.get("CURSOR_PLUGIN_ROOT") else "claude"

    if schema == "cursor":
        payload = {"additional_context": report}
    else:
        payload = {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": report,
            }
        }
    print(json.dumps(payload, ensure_ascii=False))


def main() -> int:
    """argv 给路径 = CLI 模式（纯文本 + 真实退出码）；stdin 喂 JSON = hook 模式。"""
    from_stdin = len(sys.argv) < 2
    if from_stdin:
        p = _path_from_stdin()
        if not p:
            return 0  # 输入里没有 device.json 路径，no-op
        path = Path(p)
    else:
        path = Path(sys.argv[1])
    if path.name != "device.json":
        return 0  # 非 device.json，no-op

    report, code = _build_report(path)
    if not from_stdin:
        print(report)
        return code

    # hook 模式一律退出 0：违规要靠回灌的报告让 agent 自纠，用非零码把工具调用
    # 标成失败只会让宿主以为"写文件失败了"，那是另一回事。
    _emit_for_hook(report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
