# 万里长江 · 交互脑图

一个关于长江的单页交互网站：从源头（沱沱河）到入海口（上海），沿江标出重要地点，展示每个地点的 **自然 · 历史 · 人文** 特点，并提供覆盖"上下五千年"的可拖动时间轴事件视图。

**三语支持**：中文 / English / 日本語，顶栏一键切换（记忆在 localStorage，首次访问按浏览器语言自动选择）。全部文案（地点、事件、朝代、界面）在 `src/data/` 与 `src/i18n/` 中以 `{zh, en, ja}` 三语对象维护，无运行时翻译服务。

## 两个视图

- **脑图视图**：真实地理地图（Natural Earth 中国及周边边界 + 真实经纬度的长江干流、主要支流、洞庭/鄱阳/太湖与京杭大运河，d3-geo 墨卡托投影，数据全部打包、离线可用），18 个沿江节点。点击节点弹出详情抽屉，按 自然 / 历史 / 人文 分 tab 展示"看点"与"意义"。支持滚轮缩放、拖拽平移。
- **时间轴视图**：底部时间轴覆盖公元前 3400 年至今，采用分段线性比例尺（远古压缩、近现代拉伸）。拖动滑块或点击事件刻度，对应历史事件（治水史 / 工程史 / 文明史 / 战争史四类）在江上对应位置亮起；也可点击"沿时间航行"自动播放。

## 技术

- Vite + React 18 + TypeScript，纯静态 SPA，无后端、无运行时外部资源（可离线使用，不依赖在线地图瓦片）。
- d3-geo + world-atlas/topojson（真实地图投影与边界）、d3-shape（河道曲线）、d3-scale（分段时间比例尺）、d3-zoom（平移缩放）。
- 原生 CSS 暖色纸张风主题（休闲风格），无 UI 组件库。

## 开发

```bash
cd yangtze
npm install
npm run dev      # 本地开发
npm run build    # 产物输出到 dist/（base 为相对路径，可部署到任意子路径）
npm run preview  # 预览构建产物
```

数据（地点、事件、朝代分段）都在 `src/data/` 下的 TypeScript 模块中，直接编辑即可扩充内容。

## 手机端

窄屏（≤760px）自动切换为竖版滚动布局：

- **脑图视图** → 顺流而下的"旅程"长页：左侧河流脊线，按上游/中游/下游分组的地点卡片，点开即详情。
- **时间轴视图** → "上下五千年"时间长卷：按朝代分段、粘性时代标题，向下滚动即沿时间前进。

## 部署（不影响机器上其他服务）

网站是纯静态文件，构建产物在 `yangtze/dist/`（`base: './'`，任意子路径可用）。两种互不干扰的方式任选：

**方式 A：挂到现有 nginx 的一个子路径**（只新增一个 location，不动其他站点配置）

```nginx
# 放进现有 server {} 内即可
location /yangtze/ {
    alias /srv/yangtze/;            # dist 内容复制到这里
    try_files $uri $uri/ /yangtze/index.html;
}
```

```bash
rsync -a yangtze/dist/ /srv/yangtze/
nginx -t && systemctl reload nginx   # reload 不中断其他服务
```

**方式 B：独立端口的静态服务**（完全隔离，占一个未用端口）

```bash
rsync -a yangtze/dist/ /srv/yangtze/
# systemd 单元 /etc/systemd/system/yangtze.service：
# [Service]
# ExecStart=/usr/bin/python3 -m http.server 8391 --directory /srv/yangtze
# Restart=always
# [Install]
# WantedBy=multi-user.target
systemctl enable --now yangtze
```

## 数据来源

- 国界/海岸线：[world-atlas](https://www.npmjs.com/package/world-atlas)（Natural Earth 50m，公有领域）
- 地形底图：[Natural Earth Cross-blended Hypsometric Tints with Shaded Relief and Water](https://www.naturalearthdata.com/downloads/50m-raster-data/50m-cross-blend-hypso/)（公有领域），裁剪长江流域窗口打包为 `src/assets/terrain.jpg`
- 河流走向、湖泊轮廓：按真实经纬度手工整理（展示精度）
