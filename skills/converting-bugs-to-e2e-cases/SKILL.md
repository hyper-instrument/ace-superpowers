---
name: converting-bugs-to-e2e-cases
description: "Use when 拿到一条缺陷记录(buglist 条目 / bug report / 线上复盘 / review 发现)需要确认它是否真修好或防止回归,尤其在「改完只手测过」「case 跑绿但说不清测到了什么」「同一类问题反复回归」「假成功 / silent failure / 数据全错但退出码为 0」这些情形下,以及要把一次性手工复现固化成可重复执行的验收时。"
user-invocable: true
---

# Bug 转 E2E Case

## Overview

一条缺陷记录的字段已经是 case 的骨架(复现路径 = 怎么跑,失败原因 = 断言什么,验收 = 必过项),真正缺的是**验证能力**:这段 case 在有缺陷的代码上会不会红。

**核心原则:没在缺陷代码上见过它红,就不是 case,只是一段恰好会跑的代码。**

**违反规则的字面 = 违反规则的精神。** 「已经修好了所以只能跑绿」不是豁免理由,是必须去造红的理由(见 Iron Law 的三种取红手段)。

**REQUIRED BACKGROUND:** 你必须先理解 ace:test-driven-development —— 它定义 RED-GREEN-REFACTOR。本 skill 把同一纪律套到「缺陷 → 端到端验收」这一层:单测的 RED 是一个函数,这里的 RED 是**整条链路在真实调用形状下**变红。

**相关 skill:** 根因还没定位 → ace:systematic-debugging;缺陷来自每日质量审查 → ace:system-quality-review(新 case 要回填其 Phase 1.0 映射表);收尾自查 → ace:verification-before-completion。

## When to Use

- 拿到 buglist / GitHub issue / review 结论,要证明"这条已修"或"这条仍在"。
- 修完代码,手上只有"我手动跑了一遍,看着对"。
- 某类缺陷反复回归(payload 字段假设、路径不一致、副本漂移、静默降级)。
- 缺陷的表象在**跨进程 / 跨容器 / 跨副本**处才显形,单测覆盖不到。

**不适用:** 纯函数级逻辑错误(写单测更快,`tests/` 下解决);还没定位根因(先 systematic-debugging,拿不到机理写不出有效断言);一次性环境事故(记 runbook,不进 case)。

## The Iron Law

```
NO CASE WITHOUT WATCHING IT RED ON THE BUGGY CODE
```

case 必须在**缺陷形态的代码**上跑出红,才允许声称它验证了这条缺陷。

**红的定义很窄:** 状态是 `failed`,且失败的那条 check 正是你为该症状写的那条,detail 里能看到缺陷值(如 `status=failed exit_code=-1`)。以下都**不是**红:

| 现象 | 实际含义 |
|---|---|
| `error`(step 抛异常 / 空跑 / setup 失败 / 基座镜像被清理) | 环境没跑起来,零信息 |
| `blocked`(依赖 case 没过) | 没执行 |
| 红在别的 check 上 | 你测到的是另一个问题,原症状仍无覆盖 |
| 红的 detail 里没有缺陷值 | 断言可能是恒假,不是抓到了缺陷 |

### 缺陷已修时怎么取红(按可靠性排序)

1. **指向仓内旧副本 / 历史 commit**。项目里常存在同一文件的多份副本(安装副本、插件副本、打包副本),其中未同步的那份就是天然 mutant;或 `git worktree add /tmp/pre-fix <fix 前 commit>` 起一份。最可靠:代码是真实历史,不是我手捏的。
2. **在隔离环境里改被测副本**。被测物是安装副本、不受版本控制、或压根没有"fix 前版本"时(hook / 插件 / 生成物常如此),按 case 平时的方式把源码注入容器,然后**只改容器里那份**,宿主仓库零改动。跑完容器即销毁,不需要还原。
3. **临时回退修复点**:`git stash push -- <修复文件>` → 跑 → `git stash pop`,在同一条命令里成对写,避免忘记还原。
4. **手工构造缺陷输入**:最后手段。它只能证明"我以为的缺陷形状"会被抓到,不能证明真实调用方的形状会被抓到。

### 单点注入矩阵(必做产物)

**一次性注入全部缺陷点只能证明 case「有反应」,不能证明每条断言各有所守。** 必须逐个只注入一个缺陷点,产出一张矩阵:

| 注入的缺陷点 | 变红的 check |
|---|---|
| 只读 `tool_result`(不读真实字段) | error 为空 / cause 空壳 / stdout_preview 为空 / pattern 候选归零 |
| `exit_code` 默认 -1 | 成功被记 failed / `--help` 产生 trace / eureka 全灭 |

矩阵有三个用途:① 症状与断言一一对应,说明 case 不是"无论对错都通过";② 哪一列**无论注入什么都不红** = 冗余断言,要么删要么换成真正敏感的写法;③ 这张表就是给 reviewer / 缺陷记录的验证证据。跑单点注入时要能关掉 case 的 short-circuit,否则红在第一步就停了,看不到分布。

### 拿不到红 = case 无效,重写断言

三种常见原因,对应改法:

| 症状 | 原因 | 改法 |
|---|---|---|
| 回退修复后仍全绿 | 断言恒真(空集 `all()`、只断言 `returncode == 0`) | 加非空前置;断言产物的具体字段值 |
| 只有构造输入能红 | 测的是自造数据,没走真实触发路径 | 至少一步真跑真实命令,读真实产物 |
| 红在无关 check | 断言的对象与根因不在同一条链上 | 回到失败原因,断言机理直接产出的那个字段 |

## Step 0 — 缺陷记录字段 → case 骨架

buglist 的字段不是描述文本,是**机械映射**:

| 字段 | 在 case 里变成 |
|---|---|
| 问题描述 | `Meta.title` / `description`;tags 带 `regression` + 缺陷编号(如 `P1-1.1`),便于回归时反查 |
| 复现路径 | 「真跑」那一步的命令 + 读产物的位置。优先真实命令,构造输入只作补充 |
| 变更文件 | 被测对象定位:这个文件的**投产副本**是哪份?谁注册它?(决定 Step 1 的边界起点) |
| 失败原因 | 断言的具体字段(`status` / `error` / `exit_code` / `entity_id`),以及**同根问题的邻居**(同一函数里读同一字段的其它分支) |
| 验收 | 必过 check,文案直接抄验收句 —— 报告里一眼能对上缺陷记录 |
| 环境 / 截图 | 决定 runtime(docker / 宿主)与要不要起仿真器、依赖哪个基座 |

**验收是下限,不是全集。** P1-1.1 的验收只写了两句("成功运行记 success、`--help` 不产生 trace"),但同一处字段假设波及 5 个边界;只测这两句会漏掉 3 处同根未修点。下限之外测什么,由 Step 1 决定。

## Step 1 — 沿被测对象的边界走一圈,选检查点

**检查点不靠灵感,靠遍历边界。** 从「变更文件」出发,向外走一圈,每个边界问一个问题;能查出答案的都变成 check:

| 边界 | 要问什么 | 在项目里怎么查 | ACE 实例(P1-1.1) |
|---|---|---|---|
| 触发 / 注册 | 谁调用这段代码?注册覆盖了所有触发条件吗? | `rg -l <文件名>`;读清单/配置里那一条 | `hooks.json` 的 `PostToolUse` 与 `PostToolUseFailure` matcher 是否对称 —— 不对称则非 Bash 失败永不入库 |
| 输入契约 | 真实调用方给的数据长什么样?我构造的形状和它一致吗? | 打日志抓一次真实调用;查上游文档/类型 | 真实 payload 是 `tool_response`,代码读的是 `tool_result`;payload 里根本没有 `exit_code` |
| 身份 / 副本 | 我测的这份文件是投产的那份吗? | `cmp -s A B`;`rg -l` 找出所有同名副本 | 规范源 `ace-superpowers/hooks/` vs 安装副本 `.claude/hooks/` vs 陈旧副本 `.codex/hooks/` |
| 路径 / 配置 | 产物写到哪?被测代码算出的路径 == 消费方读的路径? | 让被测代码打印它算出的路径,与消费方常量比对 | hook 的 `TRACE_DIR` 必须等于 `TraceStore` 读的 `store/traces` |
| 资源预算 | 运行环境给多少时间/内存/并发? | 读注册处的 `timeout` / 限流配置 | `hooks.json` 里 `timeout: 5` → case 要测实际耗时在预算内,否则线上静默丢数据 |
| 下游消费者 | 谁吃这份数据?它的**门槛**是多少? | 读被测代码 import 的模块里的阈值常量 | `FailurePatternExtractor` 要 `error` 非空 + 同实体 ≥3 次;`EvolutionEngine` 只存 `confidence ≥ 0.3` |
| 噪声闸门 | 什么**不该**产生数据?挡住它的是显式规则还是碰巧? | 找过滤/白名单常量(如 `MEANINGFUL_PATTERNS`)与采样/阈值参数 | `--help` 不产生 trace 只是采样哈希(0.2837)恰好没命中默认采样率 0.15 —— 采样率提到 0.29 就复现 `entity_id='--help'` |
| 发布 / 版本控制 | 我改的这份文件会随提交发出去吗? | `git check-ignore -v <路径>`;`git ls-files --error-unmatch <路径>` | `.claude/`(第 47 行)与 `ace-superpowers/`(第 50 行)都被 ignore,后者还是独立 git 仓 → hook 修复不随主仓提交,换机器就回归,而 e2e 因为注入工作区源码依旧全绿 |

两条使用要点:

- **下游消费者边界最容易漏,却决定缺陷是否真的解决。** 数据写进去了但下游门槛过不了(error 为空 → 提不出 pattern → insight 恒为 0),从用户视角看 bug 根本没修。断言必须一路推到下游产物(至少一个 pattern 候选、confidence 达标可入库)。
- **副本边界要写成 case 里的断言,不是靠人记。** 加一条"被测副本与规范源逐字节一致"(`cmp`),否则下次有人改了规范源忘了同步,case 依旧绿。ACE 里就出现过另一个 case 长期在测陈旧副本。

## Step 2 — 写断言:一条症状一条 Check

```python
# 反虚假绿红线
Check("所有 trace 都是 success", all(t["status"] == "success" for t in traces))  # ✗ traces 为空时恒真
Check("成功运行不产生 failed trace", len(traces) > 0 and not failed,
      f"共 {len(traces)} 条, failed {len(failed)}")                              # ✓ 带非空前置 + 实际值
```

- **空集恒真**:任何 `all(...)` 前面必须有"非空"或"数量"断言。
- **只测自造数据**:至少一步真跑真实命令、读真实产物;构造 payload 只用于覆盖难触发的分支。
- **只看 returncode**:退出码 0 不代表数据对(P1-1.1 全程退出码 0)。断言产物字段值。
- **碰巧绿 vs 保证绿**:每条绿的断言都要能说出"让它绿的机制是什么"。机制若是概率 / 哈希 / 采样率 / 时序 / 顺序,这条绿随时会翻 —— 要么在 case 里显式钉住参数并补一条"参数取到上界时仍满足",要么承认验收其实没落地(缺显式 gate),回去补产品代码。P1-1.1 的"`--help` 不产生 trace"就是这种碰巧绿。
- **数量断言写成 delta**:断"新增 failed 数为 0"而不是"总数恰好 N",否则采样策略一变就假红。
- **detail 必须带实际值**:失败时报告里直接能定位,不用二次复现。
- **文案抄验收句**:报告能与缺陷记录逐条对齐,`system-quality-review` 才能直接引用。

## Step 3-4 — RED → GREEN → 归档

1. **RED**:按 Iron Law 取红。逐个回退修复点,确认每条断言各守一个修复;记下红的 detail 原文(它是缺陷指纹)。
2. **GREEN**:在 HEAD 上跑全绿。全绿后**必须能回答**:"哪条断言在缺陷代码下会红?" —— 答不出等于空跑。
3. **顺带发现的同根未修点**:Step 1 走边界时新暴露的问题,当场修 + 补断言(它们和原缺陷同根,分开修会二次回归)。
4. **归档**:case 进 `scripts/e2e/cases/`;回填 `system-quality-review` 的链路↔case 映射表与 e2e README 场景表;缺陷记录的"失败原因"里写明验收命令(`run.py --case <id>`),之后复测不再手测。

## ACE 落地骨架

骨架如下(**完整实例见 `scripts/e2e/cases/trace_hook_payload.py`**:9 step / 64 断言,边界逐一落成断言;框架 API 见 `scripts/e2e/README.md`):

```python
# scripts/e2e/cases/<name>.py
import json
from case import Case, Check, Inherit, Meta, Step
from harness import Harness

HOOK = "/root/.claude/hooks/post-tool-trace.py"      # 投产副本,不是规范源
CANON = f"{REPO_ROOT}/ace-superpowers/hooks/post-tool-trace.py"

def _read_traces(h: Harness) -> list[dict]:          # 复现路径里的产物位置,自己写读取器
    text = h.sh(f"cat {TRACE_DIR}/*.jsonl 2>/dev/null").stdout or ""
    return [json.loads(l) for l in text.splitlines() if l.strip()]

def s_ready(h: Harness) -> list[Check]:              # 边界:身份副本 + 注册 + 路径
    same = h.sh(f"cmp -s {HOOK} {CANON}").returncode == 0
    reg = json.loads(h.sh(f"cat {HOOKS_JSON}").stdout or "{}").get("hooks", {})
    return [Check("被测副本与规范源逐字节一致", same, HOOK),
            Check("成功与失败事件注册对称", _matchers(reg, "PostToolUse") == _matchers(reg, "PostToolUseFailure"))]

def s_real_run(h: Harness) -> list[Check]:            # 复现路径:真跑,不构造
    h.last_run_id = h.scrape(r"run_id[=: ]+(\S+)", h.ace("workflow", "run", "demo").stdout or "")
    traces = _read_traces(h)
    bad = [t for t in traces if t.get("status") == "failed"]
    return [Check("成功运行不产生 failed trace", len(traces) > 0 and not bad,
                  f"{len(traces)} 条 / failed {len(bad)}")]

def s_downstream(h: Harness) -> list[Check]:          # 边界:下游消费者门槛
    cands = json.loads(h.sh(f"{h.venv_python} - <<'PY'\n...extract...\nPY").stdout or "[]")
    ok = [c for c in cands if c["type"] == "failure_pattern" and c["confidence"] >= 0.3]
    return [Check("失败 trace 能产出可入库 pattern", bool(ok), f"{len(cands)} 候选 / {len(ok)} 达阈值")]

CASE = Case(
    meta=Meta(id="trace_hook_payload", title="trace hook 真实 payload 采集链路(P1-1.1 回归)",
              scenario="evolution-loop", sprint="e2e-core", tags=("regression", "P1-1.1")),
    runtime="docker", depends_on=("install_flow",), inherit=Inherit(base="install_flow"),
    steps=[Step("前置就绪", s_ready), Step("真实成功运行", s_real_run), Step("下游可消费", s_downstream)],
)
```

跑法与迭代:

```bash
.venv/bin/python scripts/e2e/run.py --case <id>          # 会自动带上依赖基座(首跑慢:真装)
```

**迭代期复用已 commit 的基座镜像**(不重建 install_flow):写个临时 driver 调
`run.run_case(CASE, committed={"install_flow": "<镜像 tag>"})`。注意镜像可能被清理 —— 那时 case 会报
`error`,不是红,先 `docker images | grep ace-e2e` 确认 tag 还在。

## Red Flags — 停下来重做

- 说不出"哪条断言在缺陷代码下会红"
- 说不出"让这条绿断言绿的机制是什么"
- case 从写完到跑绿,中间没有任何一次红
- 只做了全量注入,没有单点注入矩阵
- 只跑了构造 payload,没跑过一次真实命令
- 用 `error` / `blocked` 当红基线
- 断言里出现无非空前置的 `all(...)`
- 只断言了验收里的两句,没走过 Step 1 的边界清单
- 测的文件不是投产副本,或没有副本一致性断言
- 没查过被测副本 / 修复文件是否被 git 跟踪
- 断言停在"数据写进去了",没推到下游门槛

## 常见借口

| 借口 | 现实 |
|---|---|
| "bug 已经修好了,只能跑绿" | 这正是要造红:旧副本 / 历史 commit / stash 回退。跑绿的 case 可能什么都没测 |
| "构造 payload 就够了" | 构造只验证你以为的形状。P1-1.1 的根因就是"以为的形状"和真实形状不一致 |
| "验收条件我都测了" | 验收是下限。失败原因里的机理决定还要覆盖哪些邻居边界 |
| "真跑一遍太慢" | 慢的是基座,基座可复用;手测每次都慢,而且不留证据 |
| "全绿了,链路就正常" | 全绿只说明这些断言没红。先回答"哪条会红" |
| "先合了,case 后面补" | 后补的 case 只会照着实现写,测不出实现里的错 |
| "单测覆盖了同一逻辑" | 单测覆盖不到注册、副本、路径、预算、下游门槛、发布这六个边界 |
| "验收里那条已经绿了" | 绿可能是碰巧(采样哈希没命中、时序刚好)。说不出机制就等于验收没落地 |
| "全量注入能红,够了" | 那只证明 case 有反应。没有单点矩阵,你不知道是哪条断言在起作用、哪些是死断言 |

## Checklist

- [ ] 缺陷记录五个字段都落到了 case(标题/真跑/被测副本/断言字段/验收文案)
- [ ] Step 1 八个边界逐个问过,能查的都有 check;查不到的写明为什么不适用
- [ ] 被测副本与修复文件的 git 跟踪状态已确认(`git check-ignore` / `git ls-files`)
- [ ] 至少一步真跑真实命令、读真实产物
- [ ] 每条症状一条 Check,文案抄验收句,detail 带实际值
- [ ] 无空集恒真断言;数量断言是 delta 而非绝对值
- [ ] 每条绿断言都能说出让它绿的机制;机制是概率/时序的已钉住参数或已回补显式 gate
- [ ] 在缺陷形态代码上见过红,且红在预期的 check 上、detail 含缺陷值
- [ ] 有单点注入矩阵,每条 check 至少被一个缺陷点点亮(没被点亮的已删或改写)
- [ ] HEAD 上全绿,并能逐条说出每条断言守着哪个修复
- [ ] 边界遍历中发现的同根未修点已一并修 + 补断言
- [ ] 已回填 system-quality-review 映射表 / e2e README 场景表
- [ ] 缺陷记录里写了验收命令,复测不再依赖手测

## Output

回复用户时必须给出:case id 与路径、step/check 数量、**红基线证据**(用了哪种取红手段 + 单点注入矩阵)、GREEN 结果、Step 1 里每个边界对应哪条断言、哪些绿是"碰巧绿"及其机制、顺带发现并修掉的同根问题、验收命令。
