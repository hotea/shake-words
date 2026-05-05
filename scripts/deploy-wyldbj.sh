#!/bin/bash

set -e

REMOTE_HOST="wyld-bj"
REGISTRY="registry.cn-hangzhou.aliyuncs.com/hotea"
IMAGE_NAME="shakewords"

if [ -n "$1" ]; then
    IMAGE_TAG="$1"
else
    IMAGE_TAG="latest"
fi

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
CONFIG_DIR="/home/ecs-user/.shakewords"
LOG_DIR="/home/ecs-user/logs/shakewords"

echo "=== ShakeWords wyld-bj Deployment Script ==="
echo "Target: ${REMOTE_HOST}"
echo "Image: ${FULL_IMAGE}"
echo ""

ssh -t ${REMOTE_HOST} << EOF
    set -e

    DOCKER="sudo docker"

    echo "[Remote] Creating directories..."
    sudo mkdir -p ${CONFIG_DIR}
    sudo mkdir -p ${LOG_DIR}
    sudo chown \$(whoami) ${CONFIG_DIR} ${LOG_DIR}

    if [ ! -f ${CONFIG_DIR}/.env ]; then
        echo "[Remote] ERROR: ${CONFIG_DIR}/.env not found"
        echo "[Remote] Creating .env from QA config..."
        ssh wyld-qa "cat /home/ecs-user/.shakewords/.env" | sudo tee ${CONFIG_DIR}/.env > /dev/null
        echo "[Remote] Please check and update the config if needed"
    fi

    echo "[Remote] Pulling image from Aliyun registry..."
    \${DOCKER} pull ${FULL_IMAGE}

    echo "[Remote] Stopping existing container..."
    \${DOCKER} stop shakewords-app 2>/dev/null || true
    \${DOCKER} rm shakewords-app 2>/dev/null || true

    echo "[Remote] Starting new container (host network)..."
    \${DOCKER} run -d \
        --name shakewords-app \
        --restart unless-stopped \
        --network host \
        -e ENV_FILE=/app/.env \
        -v ${CONFIG_DIR}/.env:/app/.env:ro \
        -v ${LOG_DIR}:/app/logs \
        ${FULL_IMAGE}

    echo "[Remote] Waiting for health check..."
    sleep 5

    if \${DOCKER} ps | grep -q shakewords-app; then
        echo "[Remote] Container is running!"
        \${DOCKER} ps | grep shakewords-app
    else
        echo "[Remote] ERROR: Container failed to start"
        \${DOCKER} logs shakewords-app 2>&1 | tail -20
        exit 1
    fi

    echo "[Remote] Cleaning up old images..."
    \${DOCKER} image prune -f --filter "until=168h" || true

    echo "[Remote] Deployment completed!"
EOF

echo ""
echo "=== wyld-bj Deployment completed! ==="
echo "Now you need to configure Nginx in Baota Panel (https://101.200.163.54:23345/)"
echo "Proxy pass to http://127.0.0.1:3000"
