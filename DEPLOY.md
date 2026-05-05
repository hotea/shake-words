# ShakeWords 部署指南

摇头晃脑背单词 — 支持 Docker / 自有服务器部署。

## 后端模式

### `mysql` — MySQL 数据库（默认）
数据存 MySQL，需以 Node.js 服务端模式运行。支持持久化存储、多设备访问。

### `supabase` — Supabase 云端
使用 Supabase PostgreSQL + 用户认证，需以 Node.js 服务端模式运行。

---

## 方式一：Docker 部署（推荐）

### MySQL 模式

```bash
docker build -t shakewords \
  --build-arg NEXT_PUBLIC_BACKEND_TYPE=mysql

docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://root:password@host.docker.internal:3306/shakewords \
  -e AUTH_SECRET=your-secret \
  shakewords
```

### 部署到子路径（如 /words）

```bash
docker build -t shakewords \
  --build-arg NEXT_BASE_PATH=/words

docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://root:password@host.docker.internal:3306/shakewords \
  -e AUTH_SECRET=your-secret \
  shakewords
```

### Supabase 模式

```bash
docker build -t shakewords \
  --build-arg NEXT_PUBLIC_BACKEND_TYPE=supabase \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

docker run -p 3000:3000 shakewords
```

### 使用构建推送脚本部署到阿里云镜像仓库

```bash
# 构建并推送镜像
./scripts/build-and-push.sh [version]

# 部署到 QA 服务器
./scripts/deploy-qa.sh [version]
```

---

## 方式二：自有服务器 + MySQL

### 1. 准备 MySQL 数据库

```bash
mysql -u root -p -e "CREATE DATABASE shakewords CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p shakewords < schema.sql
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_BACKEND_TYPE=mysql
DATABASE_URL=mysql://root:yourpassword@127.0.0.1:3306/shakewords
AUTH_SECRET=your-secret
```

### 3. 构建并启动

```bash
npm ci
npm run build
npm run start
```

访问 http://localhost:3000

### 4. 使用 PM2 守护进程（推荐）

```bash
npm i -g pm2
pm2 start npm --name "shakewords" -- start
pm2 save
pm2 startup
```

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_BACKEND_TYPE` | `mysql` | 后端类型：`mysql` / `supabase` |
| `DATABASE_URL` | — | MySQL 连接字符串（mysql 模式） |
| `MYSQL_HOST` | `127.0.0.1` | MySQL 主机（无 DATABASE_URL 时使用） |
| `MYSQL_PORT` | `3306` | MySQL 端口 |
| `MYSQL_USER` | `root` | MySQL 用户名 |
| `MYSQL_PASSWORD` | — | MySQL 密码 |
| `MYSQL_DATABASE` | `shakewords` | MySQL 数据库名 |
| `NEXT_PUBLIC_SUPABASE_URL` | — | Supabase 项目 URL（仅 supabase 模式） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | Supabase anon key（仅 supabase 模式） |
| `AUTH_SECRET` | — | 认证密钥（mysql 模式必须） |
| `NEXT_BASE_PATH` | — | 子路径部署前缀（如 `/words`），留空则部署到根路径 |

---

## 本地开发

```bash
npm ci
npm run dev
```

访问 http://localhost:3000
