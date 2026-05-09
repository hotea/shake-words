#!/bin/bash
# 更新版本号的脚本，遵循语义化版本控制

set -e

VERSION_FILE="version.json"

# 读取当前版本
if [ -f "$VERSION_FILE" ]; then
    CURRENT_VERSION=$(grep '"version":' "$VERSION_FILE" | sed -E 's/.*"([^"]+)".*/\1/')
else
    CURRENT_VERSION="1.0.0"
fi

echo "当前版本: $CURRENT_VERSION"

# 解析版本号
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# 增加 patch 号
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

# 获取构建时间
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# 更新版本文件
cat > "$VERSION_FILE" << EOF
{
  "version": "$NEW_VERSION",
  "buildTime": "$BUILD_TIME"
}
EOF

echo "已更新到版本: $NEW_VERSION"
echo "构建时间: $BUILD_TIME"
