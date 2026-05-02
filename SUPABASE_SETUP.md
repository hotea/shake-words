# Supabase 生产环境配置指南

## 概述

ShakeWords 支持使用 Supabase 作为后端,实现用户登录、数据云同步等功能。

## 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "New Project"
3. 选择组织,填写项目名称(如 "shake-words")
4. 设置数据库密码(请妥善保存)
5. 选择区域(建议选择离用户最近的区域,如 "Tokyo" 或 "Singapore")
6. 点击 "Create new project"

等待项目初始化完成(约 1-2 分钟)。

## 步骤 2: 获取项目凭证

1. 进入项目控制台
2. 点击左侧菜单 "Project Settings" (齿轮图标)
3. 点击 "API"
4. 复制以下信息:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (很长的字符串)

## 步骤 3: 配置数据库表

1. 在 Supabase 控制台,点击左侧 "SQL Editor"
2. 点击 "New query"
3. 粘贴以下 SQL 并点击 "Run":

```sql
-- 学习记录表
CREATE TABLE learning_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_ms INTEGER NOT NULL,
  gesture TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 单词进度表
CREATE TABLE word_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  mastery INTEGER DEFAULT 0 NOT NULL,
  next_review TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, word_id)
);

-- 启用行级安全
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

-- 创建安全策略(用户只能访问自己的数据)
CREATE POLICY "Users read own records" ON learning_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own records" ON learning_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own progress" ON word_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own progress" ON word_progress
  FOR ALL USING (auth.uid() = user_id);

-- 创建索引优化查询
CREATE INDEX idx_records_user_book ON learning_records(user_id, book_id);
CREATE INDEX idx_records_created ON learning_records(created_at DESC);
```

## 步骤 4: 配置 OAuth 认证

### GitHub OAuth (推荐)

1. 在 Supabase 控制台,点击左侧 "Authentication" > "Providers"
2. 找到 "GitHub",点击启用
3. 需要先在 GitHub 创建 OAuth App:
   - 访问 [https://github.com/settings/developers](https://github.com/settings/developers)
   - 点击 "New OAuth App"
   - Application name: `ShakeWords`
   - Homepage URL: `https://shake-words-inky.vercel.app`
   - Authorization callback URL: `https://xxxxx.supabase.co/auth/v1/callback` (替换为你的 Supabase URL)
   - 点击 "Register application"
   - 复制 Client ID 和 Client Secret
4. 回到 Supabase,填入 Client ID 和 Client Secret
5. 点击 "Save"

### Google OAuth (可选)

1. 在 Supabase 控制台,找到 "Google",点击启用
2. 需要先在 Google Cloud Console 创建 OAuth 凭据:
   - 访问 [https://console.cloud.google.com](https://console.cloud.google.com)
   - 创建新项目或选择现有项目
   - 进入 "APIs & Services" > "Credentials"
   - 点击 "Create Credentials" > "OAuth client ID"
   - Application type: `Web application`
   - Authorized redirect URIs: `https://xxxxx.supabase.co/auth/v1/callback`
   - 复制 Client ID 和 Client Secret
3. 回到 Supabase,填入凭据
4. 点击 "Save"

## 步骤 5: 在 Vercel 配置环境变量

1. 访问 [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. 选择你的 ShakeWords 项目
3. 点击 "Settings" > "Environment Variables"
4. 添加以下变量:

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_BACKEND_TYPE` | `supabase` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Production, Preview, Development |

5. 点击 "Save"

## 步骤 6: 重新部署

在 Vercel 中触发新的部署:

1. 进入项目的 "Deployments" 页面
2. 点击最新的部署
3. 点击右上角 "..." > "Redeploy"
4. 或者推送一个新的 commit 到 GitHub

## 验证配置

部署完成后:

1. 访问 [https://shake-words-inky.vercel.app](https://shake-words-inky.vercel.app)
2. 点击右上角 "Sign In"
3. 使用 GitHub 或 Google 账号登录
4. 开始学习单词
5. 在 Supabase 控制台查看 "Table Editor",应该能看到学习记录

## 本地开发配置

如果需要在本地测试 Supabase:

1. 在项目根目录创建 `.env.local` 文件:

```bash
NEXT_PUBLIC_BACKEND_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

2. 运行开发服务器:

```bash
npm run dev
```

## 常见问题

**Q: 登录后看不到数据?**
A: 检查浏览器控制台的错误信息,确保 Supabase 配置正确,并且 RLS 策略已设置。

**Q: 如何切换回本地存储?**
A: 在 Vercel 环境变量中将 `NEXT_PUBLIC_BACKEND_TYPE` 改为 `local`,然后重新部署。

**Q: 可以混合使用本地和云端吗?**
A: 当前版本不支持。用户要么完全使用本地存储,要么完全使用云端同步。

**Q: 数据会丢失吗?**
A: 从本地切换到云端时,本地的学习记录不会自动迁移到云端。建议先导出本地数据,再切换到云端。

## 安全提示

- ⚠️ **永远不要**将 `.env.local` 文件提交到 Git
- ⚠️ **永远不要**在代码中硬编码 Supabase 密钥
- ✅ anon key 是公开的,可以安全地放在前端
- ✅ service_role key 是管理员密钥,**绝对不能**暴露在前端
