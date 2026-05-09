#!/bin/bash

set -e

REGISTRY="registry.cn-hangzhou.aliyuncs.com/hotea"
IMAGE_NAME="shakewords"

# Parse arguments
NEXT_BASE_PATH=""
IMAGE_TAG="latest"

for arg in "$@"; do
    case "$arg" in
        --no-basepath)
            NEXT_BASE_PATH=""
            IMAGE_TAG="latest"
            ;;
        --with-basepath)
            NEXT_BASE_PATH="/words"
            IMAGE_TAG="qa"
            ;;
        *)
            if [ -z "$IMAGE_TAG" ] || [ "$IMAGE_TAG" = "latest" ]; then
                IMAGE_TAG="$arg"
            else
                NEXT_BASE_PATH="$arg"
            fi
            ;;
    esac
done

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "=== ShakeWords Build and Push Script ==="
echo "Image: ${FULL_IMAGE}"
echo "NEXT_BASE_PATH: '${NEXT_BASE_PATH}'"
echo ""

if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

echo "Building Docker image for AMD64..."
cd "$(dirname "$0")/.."

docker build --platform linux/amd64 \
    --build-arg NEXT_BASE_PATH="${NEXT_BASE_PATH}" \
    -t ${FULL_IMAGE} .

echo ""
echo "Image built successfully!"
docker images ${FULL_IMAGE}

echo ""
echo "Pushing image to Aliyun registry..."
docker push ${FULL_IMAGE}

echo ""
echo "=== Build and push completed! ==="
echo "Image: ${FULL_IMAGE}"
echo ""
echo "Quick deploy:"
echo "  ./scripts/deploy-wyldbj.sh   # Deploy production (latest)"
echo "  ./scripts/deploy-qa.sh       # Deploy QA (qa tag)"
