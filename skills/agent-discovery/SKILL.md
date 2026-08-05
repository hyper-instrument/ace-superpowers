---
name: agent-discovery
description: "Agent Discovery — 团队服务 owner 路由：遇到我们研发的系统（ace / hyper-fib / hyperdata / ace-xxx / hyper-xxx）的 bug 时查该上报给谁；遇到不好解决的问题时在飞书群 @ 对应的人或 bot 寻求帮助；功能 merge 到 main 后若影响某服务，则发飞书通知该服务 owner。供用户直接调用，也供其他 skill（如 ace:system-quality-review）在发飞书消息时查 owner。"
user-invocable: true
---

# Agent Discovery — 服务负责人路由

回答三个问题：**这个系统的 bug 该报给谁？**、**这个难题该 @ 谁求助？** 以及 **功能 merge 到 main 后影响谁该通知谁？** 查表 → 在飞书群发消息并 @ 对应 owner。整条链路已实测验证（2026-07-09，message_id `om_x100b6bdb70478c80c3538642fa3ec4f`，@人 与 @bot 均解析为真实 mention）。

## When to use

- 用户或 agent 遇到 ace / hyper-* 系列系统的 bug，需要知道上报给谁、并把 bug 发到群里 @ 对应 owner。
- 用户或 agent 遇到不好解决的问题（环境、权限、依赖、架构决策等），需要在飞书群 @ 人/agent 寻求帮助。
- 用户开发的功能已 merge 到 `main`，若会影响 ace / hyper-* 系列服务，需要发飞书群消息通知对应 owner。
- 其他 skill 需要按项目查 owner（如 system-quality-review 的日报卡片 @ 项目负责人）。
- 遇到需要**组织级审批**的事项（流程大变更、跨项目申请等），需要知道该找谁审批（见「组织级审批人」）。

## Owner 路由表（唯一事实源）

| 服务 | 类型 | 名称 | id（open_id / bot_id） |
|------|------|------|------------------------|
| ace | 人 | 刘鹏 | `ou_ae88f54c022ffb13e2029f286bccba09` |
| hyper-data | 人 | 杜卓然 | `ou_6ba1e5fa2fb875264d527131306f5c4b` |
| hyper-fib | 人 | 苗宏图 | `ou_1845de590f691156796171b24cba6f37` |
| ace-benchmark | 人 | 杨天宇 | `ou_c2bf8153c068ca73823b678e82c749d8` |

- **服务名宽松匹配**：`hyper-data` / `hyperdata` / `hyper_data` 视为同一服务，其余同理。
- **默认群**：HyperEM `oc_335cc3ff0ab0f353fa920fed387d5162`（外部群，**发消息一律 `--as bot`**）。
- **兜底联系人**：刘鹏 `ou_ae88f54c022ffb13e2029f286bccba09`。

### 组织级审批人

**张泽中 `ou_9c3654e18dd696002b147de486da9ed9`** 是整个组织的 owner。以下事项一律由他审批，@ 他确认后再推进：

- **流程 / 规范的大变更**（如研发流程、发布规范、Sprint 机制、评审标准的调整）。
- **跨项目的申请与协调**（涉及多个 ace / hyper-* 服务的资源、依赖、排期或方案决策）。
- 影响面超出单个服务、需要组织层面拍板的其他事项。

判断规则：只影响单个服务 → 走该服务 owner；一旦触及流程大变更或跨项目 → 升级到张泽中审批。拿不准时把张泽中和相关服务 owner 一起 @。

### 未登记服务的处理协议

遇到表里没有的服务（其他 ace-xxx / hyper-xxx）时**不要猜 owner**：

1. 在群里 @ 兜底联系人（刘鹏）询问该服务的 owner。
2. 拿到答案后，**立即把新路由写进上表，commit + push 本仓库**——每日 session 全新、跨机器唯一共享的记忆就是本文件（同 system-quality-review 的路由登记协议：只在会话里问到而不写回 = 没解决）。

## Bug 指定人：Git 身份 → 飞书用户映射

`ace:system-quality-review` 写入 buglist 的「指定人」时，按本表把 Git 作者转换成飞书 `open_id`。`上报人`仍代表发现问题的 review agent；「指定人」代表应跟进修复的人。

### 匹配顺序

1. **引入 commit / PR 作者（最高优先）**：根因已归因到 commit → `git show -s --format='%an <%ae>' <sha>` 取该提交作者；提到 `(#N)` / PR 链接 → `gh pr view N --json author` 取 PR author。squash/merge 进 main 的外层提交作者即人类作者；若外层或内部作者是 bot 但 PR author 是人类 → 用 PR author。**已有可映射的引入作者时禁止回落项目 Owner。**
2. 否则取根因文件最近 3 次非 merge commit 中第一个可映射的人类作者；文件没有历史时查所在目录。
3. 对作者依次匹配 Git email、GitHub login/noreply login、Git author name。
4. 仅当 1–3 全部得不到可映射人类作者时，才回落本 skill 的项目 Owner 路由表，并在 review 报告注明 `指定人=项目 Owner 回落（原因：…）`。

跳过 bot/自动提交身份：`*[bot]*`、`noreply@anthropic.com`、`claude-aisi@multica.ai`、`devin-ai-integration[bot]`、`lzy101@example.com`、`auto-fix@multica.ai`、`auto-fix@hyper-instrument.local`、`ace-auto-fix`。`ace-superpowers/` 下的文件必须在该子仓库内查询 Git 历史。

| 姓名 | 飞书 open_id | Git emails | Git names / logins |
|------|-------------|------------|-------------------|
| 刘鹏 | `ou_ae88f54c022ffb13e2029f286bccba09` | `liupeng@dp.tech`, `liupeng.dalian@gmail.com` | `Liu Peng`, `FingerLiu`, `liupeng` |
| 苗宏图 | `ou_1845de590f691156796171b24cba6f37` | `miaohongtu@dp.tech`, `30738614+miaohongtu@users.noreply.github.com` | `miaohongtu` |
| 段智峰 | `ou_6ec29066ac3277303b6b4c71f188a8d0` | `1224702714@qq.com`, `71871695+zhifeng-d@users.noreply.github.com` | `af`, `段智峰`, `SanMao__`, `zhifeng-d` |
| 张泽中 | `ou_9c3654e18dd696002b147de486da9ed9` | `jack.zezhong.zhang@gmail.com` | `Zezhong Zhang`, `zezhong zhang`, `zezhong-zhang` |
| 杜卓然 | `ou_6ba1e5fa2fb875264d527131306f5c4b` | `duranze@163.com`, `duranzhuo@gmail.com` | `duranze`, `Duranze` |
| 陈桂森 | `ou_c0a82f739cd4c84ee376d578923e8d2b` | `50392441+chenguisen@users.noreply.github.com`, `1747916422@qq.com` | `chenguisen` |
| 李一 | `ou_cf59da6b9bcb987e009ebc26a5daa61d` | `1094212232@qq.com` | `李一` |
| 许科 | `ou_d9991dad022c5eb697da92d7c85e54de` | `xuke@dp.tech` | `dp-xk` |
| 杨天宇 | `ou_c2bf8153c068ca73823b678e82c749d8` | `3318488446@qq.com` | `britenyyang`, `briteny-pwn` |
| 詹夏瑞 | `ou_89e7793be0a076980ffb0251fcf2107a` | `xiaruizhan@gmail.com` | `Xia Ruizhan`, `xiaruizhan` |

> open_id 以 HyperEM 群 `chat.members` 实查为准（2026-08-05 刷新）。过期 id 会导致 @ 失败或 Base 人员字段显示异常；刷新后须同步 Owner 表、本映射表与下方 id 缓存。

## 用法 1 — bug 上报

1. 从用户/调用方描述中识别服务名，查路由表拿 owner。
2. 发送前收集最小必要信息：项目、现象一句话、复现命令或场景（有则带上）、环境。
3. 发到群里（文本消息 at 语法见下），模板：

```
🐛 [<服务> bug 上报] <at user_id="<owner_id>"></at>
· 项目: <服务>
· 现象: <一句话>
· 复现: <命令或场景，可选>
· 环境: <机器/分支/commit，可选>
· 上报方: <用户名或 agent 名>
```

## 用法 2 — 求助

1. 判断问题所属服务：能对应到路由表的 @ 该服务 owner；跨服务或归属不清的 @ 兜底联系人。
2. 求助消息必须自带上下文（已尝试什么、卡在哪、期望什么帮助），不发只有一句"帮忙看下"的消息。模板：

```
🙋 [求助·<服务或主题>] <at user_id="<owner_id>"></at>
· 问题: <一句话>
· 已尝试: <做过什么、结果如何>
· 卡点: <当前具体障碍，带报错/file:line 更好>
· 期望: <需要对方做什么>
```

## 用法 3 — merge 到 main 后影响通知

1. 识别本次 merge 影响到的服务：从 PR / commit / 变更文件里判断涉及哪些 ace / hyper-* 服务；若用户已明确告知，直接采用。
2. 对受影响且已在路由表登记的服务，查 owner，发群消息 @ 对应负责人；未登记服务走「未登记服务的处理协议」。
3. 消息必须包含：merge 的服务/仓库、影响点摘要、相关 PR/commit、需要 owner 关注或确认的事项。
4. 若一次 merge 影响多个服务，可合并为一条消息并 @ 多个 owner，也可分开发送；优先合并，避免刷屏。
5. 模板：

```
🚀 [<服务> main 更新通知] <at user_id="<owner_id>"></at>
· 仓库/服务: <服务名>
· 变更摘要: <一句话>
· 相关提交: <commit / PR 链接>
· 影响点: <可能影响的接口/行为/依赖>
· 需要确认: <请 owner 确认是否有风险或需同步>
· 发送方: <用户名或 agent 名>
```

## 发消息命令

```bash
# 文本消息（@ 用 at 标签，user 和 bot 的 ou_ id 都适用）
lark-cli im +messages-send --as bot --chat-id oc_335cc3ff0ab0f353fa920fed387d5162 \
  --msg-type text --content '{"text":"🐛 [ace bug 上报] <at user_id=\"ou_2a0b3e6edcbca832452757b5bd043ed9\"></at>\n· 现象: ..."}'

# 互动卡片里 @（lark_md 元素内）
# <at id=ou_xxx></at>
```

发送后可读回验证 mention 是否真实解析（`mentions` 数组非空才算成功）：

```bash
lark-cli im +chat-messages-list --as bot --chat-id oc_335cc3ff0ab0f353fa920fed387d5162 \
  --sort desc --page-size 1 --jq '.data.messages[0] | {message_id, mentions}'
```

## id 速查缓存（HyperEM 群，2026-08-05 实查刷新）

路由表之外需要 @ 其他人时直接查这里，**不要再调 chat.members**（提速）。成员变动或 @ 解析失败时才按下节命令刷新本表。

**人：**

| 姓名 | open_id |
|------|---------|
| 刘鹏 | `ou_ae88f54c022ffb13e2029f286bccba09` |
| 杜卓然 | `ou_6ba1e5fa2fb875264d527131306f5c4b` |
| 苗宏图 | `ou_1845de590f691156796171b24cba6f37` |
| 张泽中 | `ou_9c3654e18dd696002b147de486da9ed9` |
| 雨林中的山丘 | `ou_bee535ac301bbe4d44bdef4d8b04eda4` |
| 段智峰 | `ou_6ec29066ac3277303b6b4c71f188a8d0` |
| 陈桂森 | `ou_c0a82f739cd4c84ee376d578923e8d2b` |
| 彭倩雯 | `ou_14f3ccbaf168cc31ca9366af7b768268` |
| 鞠书波 | `ou_e24ea0472a1b491ba5ed11d2494a0101` |
| 梁聿 | `ou_07be1b6ad134ce5947903505a57e1ccd` |
| 赖弘龙 | `ou_906b6dfe1dd1db4bb0c5b50214d374c0` |
| 颜啸峰 | `ou_62dcefdb23c1db1418acfce4a6645927` |
| 熊智恒 | `ou_5e79f6808e8355a528ba7fedf4011895` |
| 宋知远 | `ou_523de5d193ef05d6c113ce19d9cc2c81` |
| 杨天宇 | `ou_c2bf8153c068ca73823b678e82c749d8` |
| 李一 | `ou_cf59da6b9bcb987e009ebc26a5daa61d` |
| 尤恺宇 | `ou_9b2e4ac2f3c4cff35eead0c5adbfe217` |
| 黄俊晨 | `ou_79322152d46d7eac9b1079e3c476d365` |
| 许科 | `ou_d9991dad022c5eb697da92d7c85e54de` |
| 曹阳 | `ou_45068c05bd3978662daa8e03426664fd` |
| 詹夏瑞 | `ou_89e7793be0a076980ffb0251fcf2107a` |
| 王玉 | `ou_38be90edf94132e3e6bb8e1cadc456d1` |

> 群内另有重复身份：`张泽中` 备用 `ou_7e81c2935f1a816e5c306a68152d61fd`；`赖弘龙` 备用 `ou_6a4d365cf51d595300e2020626264add`。默认用上表主 id；@ 失败时再试备用。

**bot（3）：**

| bot 名 | bot_id |
|--------|--------|
| hyper-instrument | `ou_2a0b3e6edcbca832452757b5bd043ed9` |
| openclaw-19.234 | `ou_caf04603e86aa0a6bd94575b42b4cff4` |
| 刘鹏的飞书 CLI（本 skill 的发送身份，别 @ 自己） | `ou_e63be60eb50add483de2efd432c1aedf` |

## id 的获取与维护

- 群成员（人）的 open_id：`lark-cli im chat.members get --as bot --page-all --params '{"chat_id":"<chat_id>","member_id_type":"open_id"}'`——bot 身份可用，不需要 `contact:user:search` scope（该 scope 常缺）。
- 群内 bot 的 bot_id：`lark-cli im chat.members bots --as bot --params '{"chat_id":"<chat_id>"}'`，返回的 `bot_id` 是 `ou_` 形式，可直接放进 at 标签。
- owner 不在群里时先拉人进群或改走私聊，别对着群发一个群里不存在的 @（不会解析）。
- **@ 解析失败或 Base 人员字段显示异常时，优先怀疑本文件 open_id 过期**，按上节命令刷新 Owner 表 + Git 映射表 + 本缓存后 commit。

## 已知坑

- **外部群必须 `--as bot`**：HyperEM 是外部群，user 身份发送被平台拒（230027）；bot 不在群报 230002。前置条件链见 system-quality-review 的「已知坑」。
- **@bot 可行**：用 `chat.members bots` 返回的 `ou_` 形式 bot_id 走 `<at user_id="...">`，已实测解析成功；不要用 `cli_` 开头的 app_id 放进 at 标签。
- **过期 open_id**：2026-07-09 缓存曾全量过期（例如刘鹏旧 id `ou_aa1da0fb…`、张泽中旧 id `ou_7d4395c…`）；以 `chat.members` 实查为准。
- 任何 lark-cli 操作报错，先查 `skills/system-quality-review/trouble_shooting.md`（scope、token 解析、@file 路径等通用坑都在那里）。
