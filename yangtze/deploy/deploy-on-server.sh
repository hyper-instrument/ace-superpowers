#!/usr/bin/env bash
# 在部署机（xiang）上运行：把仓库自带的构建成品 release/ 发布到网站目录。
# 机器上只需要 git 和 nginx，不需要 node/npm。
#
# 首次部署:
#   git clone -b claude/yangtze-river-mindmap-site-m4w2yu \
#       https://github.com/hyper-instrument/ace-superpowers.git ~/yangtze-site
#   sudo ~/yangtze-site/yangtze/deploy/deploy-on-server.sh
#   # 再按 yangtze.nginx.conf 里的说明加 nginx 配置并 reload（只需做一次）
#
# 之后更新:
#   git -C ~/yangtze-site pull && sudo ~/yangtze-site/yangtze/deploy/deploy-on-server.sh
set -euo pipefail

DEST="${1:-/srv/yangtze}"
SRC="$(cd "$(dirname "$0")/.." && pwd)/release"

if [ ! -f "$SRC/index.html" ]; then
  echo "错误：找不到 $SRC/index.html（仓库应自带构建成品 release/）" >&2
  exit 1
fi

mkdir -p "$DEST"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SRC/" "$DEST/"
else
  rm -rf "${DEST:?}"/*
  cp -r "$SRC/." "$DEST/"
fi

echo "✔ 已发布到 $DEST"
echo "  首次部署请按 $(dirname "$0")/yangtze.nginx.conf 配置 nginx 并 reload；已配置过则无需其他操作。"
