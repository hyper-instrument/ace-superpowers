---
name: system-quality-review
description: "系统架构和代码质量 review — 以严苛测试工程师/架构师视角实测核心链路，产出根因分析 + 分阶段修复计划，报告写入飞书 wiki，任务拆入 buglist 多维表格，摘要卡片发到飞书群。支持 ace（默认）与任意其他项目，适合每日例行执行：自动定位前一日报告做差异对比，扫描窗口内 commit 归因新功能与新引入问题，报告和卡片突出增量。"
user-invocable: true
---

# 系统架构和代码质量 Review

以严苛测试工程师和架构师的视角，对一个项目做端到端质量审查：**定位前日报告 + commit 变更扫描 → 实测核心链路 → 根因归并 → 分阶段修复计划 → 报告落盘（首节为前日对比） → 任务拆分 → 群通知**。整条链路曾在 ace 上完整跑通（2026-07-08 首次执行），本 skill 把该流程固化为可复用、可每日执行的标准动作。每日执行的核心价值在**增量**：报告和卡片必须突出"和昨天比变了什么"，而不是重复全量描述。

## When to use

- 用户调用 `ace:system-quality-review` skill（可带参数指定项目/群）。
- 用户要求"系统性测试/审查某项目的质量"、"跑一遍质量 review"、"系统架构和代码质量 review"。
- 每日例行执行（cron / schedule 触发）。

## 参数（全部可选）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| project | `git@github.com:hyper-instrument/ace.git` | 被审查项目；可传 git URL 或本地仓库路径 |
| chat_id | `oc_335cc3ff0ab0f353fa920fed387d5162`（HyperEM 群，外部群，bot 已入群） | 摘要卡片发送目标群；**外部群一律用 `--as bot` 发**（user 身份发外部群被平台拒 230027）。bot 不在群时报 230002：先 `im chat.members create`（member_id_type=app_id）拉 bot 入群——前提是应用已开启「对外共享→允许机器人被添加到外部群」（版本表单里配置，本应用 1.0.5 起已开启） |
| wiki_node | `TvV8wYrayikOrskEIhxcFfYkn7b`（ace 问题收集表） | 报告文档的父 wiki 节点 |
| base/table | base `LJrYbZA0paJyDismpECckHSqnVf`；**按项目路由表**：ace → `tblQNpirUlTtUVr3`（buglist），hyper-fib → `tbluiL2In7V2HT96`（同 view `vewJpKS6UZ`） | 任务拆分目标多维表格；新项目先问用户建表还是复用 |

非 ace 项目若未指定 wiki/base/群，则询问用户或仅在本地输出报告。

### 项目定位（先扫描本地，再考虑 clone）

拿到 project 参数（git URL 或路径）后按此顺序解析工作目录：

1. **当前目录**：若 cwd 已在目标仓库内（`git remote get-url origin` 与目标 URL 的 org/repo 匹配，SSH/HTTPS 视为等价），直接使用。
2. **扫描本地常见位置**：按 `~/Projects`、`~/projects`、`~/code`、`~/dev`、`~/workspace` 等目录（深度 ≤3）找 `.git/config` 中 remote 匹配 org/repo 的仓库；也可用 `find ~/Projects -maxdepth 3 -name .git -type d` 后核对 remote。找到即使用，**不要重复 clone**。
3. **本地命中后**：`git pull --ff-only` 拉最新代码（有未提交改动或 pull 失败时不要强拉，报告中注明基于本地当前状态并给出 commit 哈希）。
4. **本地未命中**：clone 到 `~/Projects/<repo-name>` 后使用。

报告环境信息中必须写明：仓库路径、分支、commit 短哈希、是否有本地未提交改动。

## 核心原则

1. **实测，不推断。** 每条链路必须真实运行命令并检查产物，不能只读代码下结论。
2. **不信任绿色输出。** 显示 success 的运行要核对产物（run JSON、输出文件、状态字段），警惕"假成功"（如 ace 的 simulate fallback：节点 `simulated: true` 却报 ✓）。
3. **证据落到 file:line。** 每个根因必须给出源码位置和可复现命令。
4. **根因归并。** 几十个表象通常收敛到少数根因（ace 首轮：9 条链路全挂 → 6 个根因）。按根因组织报告，不按表象。
5. **修复计划可验收。** 每项修复带工作量估计和可执行的验收标准（一条命令 + 期望输出）。
6. **每日执行要幂等。** 写 buglist 前先查已有未关闭记录去重；报告标题带日期；卡片只报增量与趋势。
7. **差异优先。** 每日执行必须先定位前一日报告做对比（Phase 0），报告首节展示差异；持续存在的旧问题一行带过，新增/回归/消失的问题才展开写。新增问题要用 commit 变更扫描归因到引入 commit。

## Phase 0 — 前日报告定位 + commit 变更扫描（每日执行必做）

首次执行（wiki 下找不到任何历史报告）时跳过 0.1，变更窗口取近 48h，报告注明"首轮基线，无对比"。

### 0.1 定位并读取上一份报告

```bash
# 1. 解析父 wiki 节点，拿 space_id 和 node_token
lark-cli wiki +node-get --as user --node-token "<wiki_node_url>" \
  --jq '.data.node | {space_id, node_token}'

# 2. 列出子节点，按标题 "<项目> 系统质量 Review (YYYY-MM-DD)" 过滤，
#    取日期早于今天的最新一份（通常是昨天）
lark-cli wiki +node-list --as user --space-id <space_id> \
  --parent-node-token <node_token> --page-all \
  --jq '.data.items[] | {title, node_token, obj_token}'

# 3. 读取上一份报告全文（v1 已废弃，必须 --api-version v2）
lark-cli docs +fetch --as user --api-version v2 --doc "<上一份报告的 wiki url>"
```

从上一份报告中提取三样东西，供后续 Phase 使用：

1. **基线指标**：链路通过数 n/m、pytest FAILED 数、buglist 写入条数。
2. **根因清单**：每条根因的指纹/slug + 一句话结论，用于 Phase 4 差异对比。
3. **环境信息中的 commit 短哈希**：作为 0.2 变更扫描的起点锚。

### 0.2 commit 变更扫描

以上一份报告记录的 commit 为起点（用哈希锚定，比按日期切更可靠；无历史报告则 `--since="48 hours ago"`）：

```bash
git log --oneline --no-merges <prev_commit>..HEAD
git diff --stat <prev_commit>..HEAD
# 需要看某个可疑改动的细节时：
git show <commit> --stat   # 再按需 git show <commit> -- <file>
```

产出一张**变更清单**：每个 commit 归类为「新功能 / 修复 / 重构 / 文档・杂项」，标出涉及的核心模块。窗口内无 commit 也要在报告写明"代码无变更"（此时质量指标的变化只能来自环境/数据）。变更清单有三个用途：

1. **指导 Phase 1 排期**：新功能涉及的链路必须实测——即使不在标准链路清单里也要临时加测；声称"修复了 X"的 commit，对应问题必须复测验证，不能只看 commit message。
2. **新增问题归因**：Phase 2 中新出现的问题，用 `git log -L <range>:<file>` / `git blame` 判断是否由本窗口 commit 引入；能归因的在报告和 buglist 的失败原因里写明"由 <commit 短哈希>（<一句话说明>）引入"。
3. **反向核销线索**：修复类 commit 对应 buglist 里的存量未关闭记录 → 复测通过则计入"疑似已修复待确认"，并注明修复 commit（依然不直接改记录状态，见每日去重协议第 5 条）。

### 0.3 增量执行模式（第二轮及以后默认）

首轮全量建基线；之后每天不再全量重测，用 0.2 的变更扫描结果推导**必测集**：

1. **上次失败的链路** —— 全部复测（验证是否回归/已修复）。
2. **本窗口 commit 涉及模块对应的链路** —— 变更文件 → 所属模块 → 链路的映射按项目结构推导，拿不准就归入必测（宁可多测）。
3. **1 条黄金路径 smoke** —— ace 是 quickstart calc_expr（链路 2），其他项目取最短的端到端链路。

**其余链路（上次通过且本窗口代码未动）→ 跳过**，结果直接沿用上次，报告对比表中该行标注 `⏩ 沿用（unchanged since <commit>）`——沿用不是实测，绝不能标成 ✅ 通过。

ace 项目里，「必测集」直接落成 Phase 1.1 的 runner 选择：把必测链路按 1.0 映射表换成对应 case，用 `--case`（可多次）或 `--scenario` 只跑这些；未选中的 case = 沿用（不是 e2e 的 `skipped`，报告里仍标 `⏩ 沿用`）。

特殊情形：

- **零 commit 日**：极速模式，只跑第 1、3 类（上次失败 + smoke），报告注明"代码无变更"。
- **每周全量日**（默认周一，或距上次全量 ≥7 天）：忽略增量规则跑全量，防止"沿用"链条累积漂移。全量日结果刷新所有链路的基线。
- **上次报告缺失/无法读取**：退回全量。

与核心原则 1"实测，不推断"的关系：沿用只允许在「代码未动 + 上次实测通过 + 报告明确标注 + 每周全量兜底」四个条件同时满足时使用，这是有安全网的缓存，不是推断。

## Phase 1 — 核心链路实测（ace 走 e2e 隔离框架）

**核心链路实测已固化为 `scripts/e2e/` 的隔离形态**（Docker 容器 · 声明式 step 链 · 依赖 DAG · 按 step 落报告），不再手敲一条条命令。ace 项目**一律用 e2e runner 执行链路实测**，读它落盘的报告做断言；其他项目若无 e2e 框架，才退回手动跑标准链路（见文末「无 e2e 框架的项目」）。

> 为什么用 e2e：它把「实测不推断」「不信任绿色输出」「假成功检测」「产物核对」全部编码进 step 断言（`skip` 仅留给结构性不适用，空跑判 error，依赖失败下游 blocked），比手动跑更严格、可复现、宿主零污染。这正是本 skill 核心原则 1-3 的机器化实现。

### 1.0 标准链路 ↔ e2e case 映射（ace）

标准链路清单（安装 → quickstart → 核心工作流 → 扩展接入 → 持久化 → 集成闭环）与 e2e case 一一对应；执行时按 0.3 增量模式筛出必测集，转成 runner 的 `--case` / `--scenario` 选择：

| # | 标准链路 | e2e case | scenario |
|---|----------|----------|----------|
| 1 | 安装配置：`make install` & `ace --help`/`version` | `install_flow`（基座，真跑 make install + 幂等 + 卸载） | `install-config` |
| 2 | quickstart 接入 calculator | `quickstart_calculator`（真 agent onboarding + 数值断言） | `quickstart` |
| 3 | FIBSEM 基础切割工作流（防假成功；含 TEM 制样切割阶段 `miling_with_mesh`） | `fibsem_milling`（起 simulator_server 真跑 miling_with_mesh，断言 `WorkflowSucceeded`） | `device-integration` |
| 4 | 已有 simulator 后接第二个设备 | `fibsem_tescan_sdk`（tescan `install_sdk` + 依赖 import） | `device-integration` |
| 5 | 记忆库存取：`ace gbrain doctor` | `gbrain_memory`（gbrain 连通 + experience CRUD/检索） | `memory-store` |
| 6 | `ace hub pull/push`（含 git sync 状态） | `hub_sync`（`store status` + pull origin + push 本地 bare `--no-pr`） | `hub-sync` |
| 7 | session 后 trace/evolution 触发 | `session_trace_evolution`（PostToolUse 写 trace → Stop 触发 pattern 提取） | `evolution-loop` |
| 8 | 失败→修正→召回闭环 | `trace_memory_recall`（trace→gbrain→PreExecutionMemory 召回→二次执行直接成功） | `memory-store` |

附加链路（不在 8 条清单但已有 case，全量日一并跑）：`workflow_success`（`workflow-execution`）、`control_pause_resume_stop`（`workflow-control`）、`traceback_hyperdata`（`traceback-report`）。

**发现新功能没有对应 case（Phase 0.2 变更扫描命中新链路）**：优先在 `scripts/e2e/cases/` 新写一个 case（`CASE = Case(...)`，`inherit=Inherit(base="install_flow")`，声明式 `steps`；范式见 `scripts/e2e/README.md`「怎么加一个 case」），把新链路纳入 e2e，而不是临时手敲命令——本 skill 追求「链路实测可复现、可每日执行」，一次性手测不满足。新 case 提交后同步更新本表与 e2e README 的场景表。

### 1.1 执行 e2e（按增量模式选择范围）

```bash
# 前置:有 docker daemon(无则相关 case 自动 skip);首跑 install_flow 会真装(慢),之后指纹缓存复用基座镜像。
# 推荐设 ACE_E2E_HUB_PATH 指向宿主 ace-hub 浅克隆;LLM key 写 scripts/e2e/.env(见 README)。

# 全量日 / 首轮:跑全部(按 DAG 拓扑)
.venv/bin/python scripts/e2e/run.py

# 增量日:只跑必测集(0.3 推导)——上次失败的 case + 本窗口 commit 涉及模块的 case + 1 条黄金 smoke
.venv/bin/python scripts/e2e/run.py --case fibsem_milling --case ...   # 逐个指定;或
.venv/bin/python scripts/e2e/run.py --scenario device-integration      # 按场景;或
.venv/bin/python scripts/e2e/run.py --sprint e2e-core                  # 按 sprint

# 报告默认落 scripts/e2e/reports/e2e-<时间戳>.{json,md,html};JSON 供本 skill 解析断言。
```

runner 自动纳入被选 case 的 `depends_on` 依赖（如选 `fibsem_milling` 会自动带上基座 `install_flow`）。**黄金路径 smoke** = 链路 2（`--case quickstart_calculator`）。

### 1.2 从 e2e 报告读结论（不信任绿色输出）

读最新 `reports/e2e-*.json`，按 case 提取状态并映射回标准链路清单：

- **状态语义**：`passed` 所有 step 断言全过 → ✅ 实测通过；`failed`/`error` → ❌ 实测失败（error 含空跑/异常/setup 失败）；`skipped` 仅结构性不适用（如无 docker，**不计入分母**）；`blocked` 依赖未过/前置 critical step 失败（显著标注，不算通过）。
- **假成功检测已内建**：e2e case 的断言直接核对 run JSON 的 `events`（如断言 `WorkflowSucceeded` 而非只看退出码 0）、节点真实状态、产物文件；报告里某 case `passed` 即代表这些产物核对已通过。仍要抽查报告里每个 step 的 check 明细，警惕 case 断言写得过松。
- **链路通过数**：本 skill 报告的「链路 n/8」直接由映射表统计对应 8 个 case 的 `passed` 数得出；附加 case 单列。case `skipped`（如缺 docker）要在报告注明「因缺 X 未测」，不能计入通过。

### 1.3 与 e2e 并行的测试套件（沿用原分层策略）

链路实测（e2e）之外，pytest 单元/集成套件仍要**全程后台、与 e2e 并行，绝不串行等它**：

1. 先跑 `pytest --lf -q`（只跑上次失败的，pytest 自身缓存，几分钟内给出回归/修复信号）；`--lf` 无缓存或首轮时跳过这步。
2. 全量套件（如 `python -m pytest tests/core/ -q`）只在**全量日、首轮、或本窗口 commit 触及核心模块**时跑；增量日的 FAILED 基线直接沿用上次报告并标注。
3. 装了 `pytest-xdist` 就加 `-n auto` 并行（先 `python -m pytest --collect-only -q -n auto` 之类快速探测插件是否可用，不可用则单进程，不要为此临时装依赖）。
4. 统计 FAILED 按文件归并；`--lf` 的结果只用于回归判断，FAILED 总数以最近一次全量为准，报告中注明基线日期。
- 记录所有噪音（loader 告警、重复注册表条目、无关提示），它们是易用性问题的直接证据。

### 无 e2e 框架的项目（退回手动标准链路）

其他项目若无 `scripts/e2e/`，按同样思路手动跑标准链路（安装 → quickstart → 核心工作流 → 扩展接入 → 持久化 → 集成闭环），执行要点：
- 默认 agentic 的命令要同时测 agentic 和 `--mode auto` 两条路径。
- 每次运行后读 run JSON（`~/.ace/store/run/workflow/<wf>/<job>.json`）核对节点真实状态，警惕假成功（显示 ✓ 但 `simulated: true` / 节点未真跑）。
- 有能力时优先给该项目补一套等价的隔离 e2e 框架，把链路实测固化下来。

## Phase 2 — 根因分析

- 把所有失败聚类到根因，每个根因写清：现象 → 机理 → 证据（file:line + 复现命令）→ 波及面。
- 常见根因模式（来自 ace 首轮）：argv 构造错误（可变参数吞位置参数）、双重导入身份（`src.x` vs `pkg.x` 的 issubclass 失败）、静默降级假成功、hook payload 字段假设错误、依赖未随 artifact 分发、无 CI 门禁。

## Phase 3 — 修复计划

- 三阶段结构：**P0 恢复黄金路径 → P1 闭合核心闭环 → P2 质量门禁 + UX**。
- 每项：修复内容 / 工作量（人天）/ 验收标准。
- 结尾量化：链路通过数基线 vs 目标、红测试数、预计关闭缺陷数。

## Phase 4 — 报告落盘（飞书 wiki）

### 报告结构（每日执行时首节必须是对比）

报告正文第一节固定为「📊 与上一日对比」（数据来自 Phase 0），差异优先、旧账压缩：

| 维度 | 上次 (MM-DD) | 本次 | 变化 |
|------|------|------|------|
| 链路通过 | x/8 | y/8 | ✅ 修复：链路 A；❌ 新挂：链路 B |
| pytest FAILED | a | b | ±n（新增失败文件列出） |
| 根因数 | p | q | 新增 [slug…] / 消失 [slug…] |
| buglist | 新增 m 条 | 新增 m' 条 | 仍存在 N / 回归 R / 疑似修复 K |

- **新增根因、新挂链路**：完整展开（现象/机理/证据 file:line/复现命令），并写明引入 commit（0.2 归因的结果）。
- **消失的根因**：注明疑似修复 commit，标记"待人工确认后关闭"。
- **持续存在的旧问题**：一行一条，链接上一份报告，不重复展开。
- **链路明细**：每条链路标明 ✅ 实测通过 / ❌ 实测失败 / ⏩ 沿用（unchanged since \<commit\>）；对比行的 y/8 可含沿用，但实测数与沿用数要分开写（如 `8/8（实测 4 + 沿用 4）`）。ace 项目的链路状态直接来自本轮 e2e 报告（`scripts/e2e/reports/e2e-*.json`，按 Phase 1.0 映射表回填 8 条链路），失败链路引用报告里对应 case 的失败 step 名。

第二节固定为「🔀 本窗口 commit 变更」：变更清单（新功能/修复/重构分组），每条新功能标注实测结论（✅ 通过 / ❌ 引入问题 X / ⏭️ 未覆盖及原因），每条修复 commit 标注复测结论。之后才是常规的根因分析和修复计划正文。

### 写入命令

```bash
# wiki 链接先解析成 base token / 确认 obj_type（ldx 开头的 table 参数是内嵌文档，无 API 可写！）
lark-cli wiki +node-get --as bot --node-token "<wiki_url>" --jq '.data | {obj_type, obj_token}'

# 报告写成父节点下的子文档（markdown 文件必须用相对路径 @./xxx.md，先 cd 到文件目录）
lark-cli docs +create --as user --wiki-node <wiki_node> \
  --title "<项目> 系统质量 Review (YYYY-MM-DD)" --markdown @./report.md
```

## Phase 5 — 任务拆分（多维表格）

```bash
# 1. 先拿字段结构（绝不猜字段名）
lark-cli base +field-list --as bot --base-token <base> --table-id <table>

# 2. 执行下方「每日去重协议」后，只批量写入真正的新增（单批 ≤200 行）
lark-cli base +record-batch-create --as user --base-token <base> --table-id <table> --json @./batch.json
```

### 每日去重协议（定时执行必须遵守）

**原则：表是唯一事实源。** 每天的 session 全新、没有上轮记忆，因此写入前必须先读全表比对，绝不凭本轮认知直接写。

1. **拉全表**：`+record-list --format json --limit 200` 分页拉取（`has_more=true` 必须翻页），取 `record_id + 问题描述 + 失败原因 + 修复状态 + 状态`。
2. **稳定指纹**：新发现的每个问题生成 `[<项目>-<锚点slug>]` 前缀写在问题描述开头。slug 从**根因锚点**派生：核心文件名 + 缺陷本质，如 `[HF-session-manager-async-url]`、`[ACE-launcher-mcp-config-argv]`。**禁止用 P0/P1 轮次编号或日期当 slug**（编号会随每轮排序漂移）；指纹一经写入永不更改。
3. **两级匹配**：新发现先按指纹与存量精确匹配；未命中再与所有**未关闭**记录做语义比对——同一文件 + 同一症状/根因 = 同一问题（存量旧格式前缀如 `[HF-P0.1]` 靠这一级兜住）。
4. **处置规则**：
   - 命中且未关闭（待修复/修复中/待审核）→ **跳过不写**，计入卡片"仍存在 N"。
   - 命中但已关闭（修复完成/已确认/暂不修复）且今日复现 → **回归**：新建记录，问题描述加 `[回归]` 标记，失败原因里引用旧 record_id；计入"回归 R"。
   - 无命中 → 新增写入；计入"新增 M"。
5. **反向核销**：存量未关闭、但今日实测未复现的问题 → **不改记录**（人工确认修复才关闭），卡片单列"疑似已修复待确认 K 条"。
6. **卡片只报增量**：`新增 M / 仍存在 N / 回归 R / 疑似修复 K`，附链路通过数与测试基线和上一轮的对比。

buglist 字段映射约定：`问题描述`（[P0-x.y] 前缀 + 一句话）、`失败原因`（根因 + 验收标准）、`复现路径`（精确命令）、`变更文件`（file:line + 修法）、`类型`（缺陷/优化/文档）、`重要程度(P0优先)`、`修复难度(L1 最难)`、`修复状态`=待修复、`环境`、`上报人`=[{"id":"ou_aa1da0fb8d5b42eb69389ba4eca58303"}]。

## Phase 6 — 群通知（卡片）

```bash
lark-cli im +messages-send --as user --chat-id <chat_id> --msg-type interactive --content "$(cat card.json)"
```

卡片结构：红色 header（🧪 标题+日期）→ markdown 根因摘要（emoji 分级 🔴🟠🟡）→ hr → 修复计划一句话 → action 按钮（📄 完整报告 / 📋 buglist 表）→ note（环境信息）。

**@ 项目 owner（Agent Discovery 路由）**：卡片摘要首行必须 @ 被审查项目的 owner，owner 从同仓库 `skills/agent-discovery/SKILL.md` 的路由表查（ace → hyper-instrument bot、hyper-data → 杜卓然、hyper-fib → 苗宏图，含 open_id）。卡片 lark_md 里用 `<at id=ou_xxx></at>`；项目未登记时按 agent-discovery 的未登记协议处理（@ 兜底联系人问 owner，拿到后写回路由表并 push），不要猜。

每日执行时卡片正文只写**增量与归因**，不重复旧问题详情：

- 对比行：`链路 y/8（上次 x/8）｜新增 M ｜回归 R ｜疑似修复 K ｜仍存在 N`
- commit 行：`本窗口 c 个 commit：新功能 f（实测通过 g）｜修复 h（复测通过 i）`
- 新增/回归的问题各一行摘要，带引入 commit 短哈希；无变化时明确写"与昨日持平"。

## 代码级增量审查与自动修复（每日 repo 扫描模式）

当 skill 被 autopilot 每日调用、目标为普通代码仓库（如 `hyper-instrument/ace`、`hyper-data`、`hyper-fib`、`lumen`、`ace-benchmark`）时，在 Phase 0-6 的系统级 review 之外，补充一条轻量闭环：**增量代码审查 → 去重 → issue/子任务 → 分级修复 → 收尾**。本模式的消息链路仍以 `system-quality-review` 为准（wiki 报告 + buglist + 群卡片），PR 级大白话通知作为补充。

### 取代码与增量基准

1. **优先本地副本**：使用 `/data/codes/<repo-name>`；进入后 `git pull --ff-only`。本地不存在则 clone 到 `/data/codes/<repo-name>`。
2. **确定审查窗口**：读取本次 autopilot 父 issue 的 metadata `last_reviewed_sha`；无则默认看最近 7 天提交。只审 `git diff <base>..HEAD` 的变更，避免全仓扫描。
3. **审查重点**：bug、安全漏洞、并发/正确性问题、性能回归、代码坏味道、缺失测试。

### 去重

发现新问题前，先在对应 GitHub 仓库的 open issues 里搜索一遍，避免重复创建。

### 问题闭环

每个有效发现：

1. **GitHub 建 issue**：`gh issue create --repo <org>/<repo> --title "<标题>" --body "<现象/根因/影响/复现/建议修法/严重度>"`
2. **Multica 建子任务**：挂在本次 autopilot 父 issue 下（`--parent`），描述里写明对应 GitHub issue 链接；并 `multica issue metadata set <child> --key github_issue --value <gh-url>`。

### 修复分级

- **低风险 + 高把握** → 立即修复并开 PR（遵循 auto-fix skill：写测试 → 提 PR → 更新状态 → 通知）。
- **高风险 / 架构性 / 把握不足** → 只建 issue，**禁止自动改**，标记"需人工评审"并升级给项目 owner（在父 issue 评论里说明）。

### 硬约束

- 只审增量，避免重复 issue。
- 所有 PR 必须过测试 / 风格 / 安全门禁。
- **禁止触碰**：生产部署、DB 迁移、大规模重构——只建 issue + 升级。
- 任何疑问上报项目 owner，**严禁直接打扰真实用户**。
- 关键修复的 Reviewer 优先用项目 owner（查 `skills/agent-discovery/SKILL.md` 路由表）。

### 收尾

- 更新父 issue metadata：`last_reviewed_sha = <当前 HEAD SHA>`。
- 在父 issue 汇总今日发现 / 已开 PR / 未决项 / 需人工评审项。
- 按 auto-fix 规范更新各 issue 状态。

## 已知坑（务必遵守）

**⚠️ 执行 Phase 0.1 和 Phase 4-6（任何 lark-cli 调用）之前，必须先读本 skill 同目录的 [trouble_shooting.md](trouble_shooting.md)**——它是完整的踩坑记录（wiki token 解析、scope 名、Base 字段格式、批量写入 JSON 结构等 10 条），下面只是最高频的摘要。执行中新踩并解决的坑，要当场追加到 trouble_shooting.md 并 push（只在会话里解决而不落盘 = 没解决）。

- **131005 not found ≠ 无权限**：`/wiki/{token}` 里是 wiki node token，不是 docx obj_token；用**完整 URL + 不带 `--obj-type`** 调 `wiki +node-get` 让 CLI 自己解析（详见 trouble_shooting.md 第 1 条）。
- **互动卡片 + 外部群**：user 身份可向**内部群**发互动卡片；**外部群**（`chats get` 返回 `external: true`）user 身份发送被平台拒绝（230027），必须走 bot。前置条件链：开发者后台「版本管理与发布→创建版本→对外共享」勾选「允许机器人被添加到外部群」并发布版本（未开启时拉群报 232033）→ `im chat.members create`（`member_id_type=app_id`）把 bot 拉进目标群（bot 不在群发送报 230002）→ `--as bot` 发卡片。
- **91403 不可重试**：bot 对 Base 无权限时立即停止，走 user 身份。
- **scope 增量授权**：缺 scope 时用 `lark-cli auth login --scope "..." --no-wait` 拿 verification_url，二维码 + 链接发给用户，等确认后 `--device-code` 完成。本链路需要：`wiki:node:retrieve`、`wiki:node:create`、`docx:document`、`base:record:create`、`im:message`、`im:message.send_as_user`。
- **lark-cli @file 只接受当前目录相对路径**，先 `cd` 到文件所在目录。
- **`ldx` 开头的 table 参数是 Base 内嵌文档**，没有任何开放 API 可写，报告写到同级 wiki 子文档并在回复中说明位置。
- zsh 下避免 `echo ===`、裸 `--include=*.py` 等会被 glob 展开的写法。

## Output

回复用户时必须包含：链路通过统计（n/8 或 n/m）、根因列表、报告文档链接、buglist 写入条数、卡片 message_id。每日执行时额外给出：与上一份报告的对比结论（新增/修复/回归/疑似修复，及各项指标变化）、本窗口 commit 数与新功能实测结论、新增问题的引入 commit 归因。

**每日 repo 扫描模式**还需额外给出：今日审查范围（`last_reviewed_sha..HEAD`）、GitHub 新建 issue 列表、Multica 子任务列表、已开 PR 列表、需人工评审项、 Lark/父 issue 通知记录。
