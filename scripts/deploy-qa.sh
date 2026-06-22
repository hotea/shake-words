#!/bin/bash

set -e

REMOTE_HOST="wyld-qa"
REGISTRY="registry.cn-hangzhou.aliyuncs.com/hotea"
IMAGE_NAME="shakewords"
IMAGE_TAG="qa"

FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
CONFIG_DIR="/home/ecs-user/.shakewords"
LOG_DIR="/home/ecs-user/logs/shakewords"

echo "=== ShakeWords QA Deployment Script ==="
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
        echo "[Remote] Please create it with DATABASE_URL and AUTH_SECRET"
        exit 1
    fi

    echo "[Remote] Pulling image from Aliyun registry..."
    \${DOCKER} pull ${FULL_IMAGE}

    echo "[Remote] Stopping existing container..."
    \${DOCKER} stop shakewords-app 2>/dev/null || true
    \${DOCKER} rm shakewords-app 2>/dev/null || true

    echo "[Remote] Starting new container..."
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
echo "=== QA Deployment completed! ==="
echo "Health check: ssh ${REMOTE_HOST} 'curl -s http://localhost:3000/words'"
