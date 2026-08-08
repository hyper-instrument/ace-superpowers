#!/usr/bin/env bash
# 在你自己的电脑上运行（需要能 ssh 到部署机）：一条命令把站点 scp/推送到远程机器。
# 用法:
#   ./deploy-from-local.sh user@xiang            # 部署到默认目录 /srv/yangtze
#   ./deploy-from-local.sh user@xiang /var/www/yangtze
set -euo pipefail

HOST="${1:?用法: $0 user@host [远程目录，默认 /srv/yangtze]}"
DEST="${2:-/srv/yangtze}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 本机装了依赖就现场构建，否则用仓库自带的 release/ 成品
if command -v npm >/dev/null 2>&1 && [ -d "$DIR/node_modules" ]; then
  echo "→ 本地构建…"
  (cd "$DIR" && npm run build)
  SRC="$DIR/dist"
else
  echo "→ 使用仓库自带构建成品 release/"
  SRC="$DIR/release"
fi

echo "→ 传输到 $HOST:$DEST …"
tar -C "$SRC" -czf - . | ssh "$HOST" "sudo mkdir -p '$DEST' && sudo tar -C '$DEST' -xzf -"

echo "✔ 完成。首次部署请在远程机器按 deploy/yangtze.nginx.conf 配置 nginx 并 reload。"
