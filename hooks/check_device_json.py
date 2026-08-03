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


def _strict_errors(data: dict, device_dir: Path) -> list[str]:
    """把校验完全委派给 ace 包；取不到 ace 时不做本地兜底（宁可放过，不给错标准）。"""
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
        return []

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


def main() -> int:
    if len(sys.argv) >= 2:
        path = Path(sys.argv[1])
    else:
        p = _path_from_stdin()
        if not p:
            return 0  # 输入里没有 device.json 路径，no-op
        path = Path(p)
    if path.name != "device.json":
        return 0  # 非 device.json，no-op

    try:
        raw = path.read_text(encoding="utf-8")
        data = json.loads(raw)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"❌ device.json 读取/解析失败: {exc}")
        print("\n标准模板（请对照修正）:\n" + _find_template())
        return 1

    errors = _strict_errors(data, path.parent)
    name = str(data.get("name") or "") if isinstance(data, dict) else ""
    ace_out = _ace_validate(name)

    if not errors:
        msg = f"✅ device.json 通过 sdk_install 标准校验（{name or path}）。"
        if ace_out:
            msg += f"\n\n`ace device validate {name}`:\n{ace_out}"
        print(msg)
        return 0

    print(f"❌ device.json 不符合标准模板（{name or path}）：")
    for e in errors:
        print(f"  - {e}")
    if ace_out:
        print(f"\n`ace device validate {name}`:\n{ace_out}")
    print("\n请严格对照下方标准模板修正 metadata.sdk_install，改完重写文件触发再次校验：\n")
    print(_find_template())
    return 1


if __name__ == "__main__":
    sys.exit(main())
