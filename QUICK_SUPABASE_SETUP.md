# Supabase 快速配置指南 (手动方式)

## 第 1 步: 获取 Supabase Anon Key

### 方法 A: 通过 Supabase Dashboard

1. **访问 API 设置页面**:
   [https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/settings/api](https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/settings/api)

2. **找到 API Keys**:
   - 向下滚动页面
   - 查找 **"Project API keys"** 或 **"Legacy anon, service_role API keys"** 部分
   - 你会看到两个 key:
     - `anon` / `public` ← **复制这个**
     - `service_role` / `secret` ← 不要用这个!

3. **复制 Key**:
   - 点击 key 旁边的 **"Copy"** 按钮
   - 或者点击 **"Reveal"** 显示完整 key,然后复制
   - Key 格式: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx.xxxxx`

### 方法 B: 如果找不到

在 Supabase Dashboard 左侧菜单尝试:
- **Settings** → **API**
- 或 **Project Settings** → **API Keys**
- 或 **Authentication** → **Configuration**

---

## 第 2 步: 配置数据库表

1. **访问 SQL Editor**:
   [https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/sql/new](https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/sql/new)

2. **复制并运行以下 SQL**:

```sql
-- 创建学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_ms INTEGER NOT NULL,
  gesture TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 创建单词进度表
CREATE TABLE IF NOT EXISTS word_progress (
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

-- 创建安全策略
CREATE POLICY "Users read own records" ON learning_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own records" ON learning_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own progress" ON word_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own progress" ON word_progress
  FOR ALL USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_records_user_book ON learning_records(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_records_created ON learning_records(created_at DESC);
```

3. **点击 "Run" 执行**

4. **验证**: 你应该看到 "✅ Tables created successfully!" 或类似的成功消息

---

## 第 3 步: 在 Vercel 配置环境变量

### 方式 A: 通过 Vercel Dashboard (推荐)

1. **访问环境变量设置页面**:
   [https://vercel.com/okkylesu-8037s-projects/shake-words/settings/environment-variables](https://vercel.com/okkylesu-8037s-projects/shake-words/settings/environment-variables)

2. **添加第一个变量 - Backend Type**:
   - 点击 **"Add New"**
   - Name: `NEXT_PUBLIC_BACKEND_TYPE`
   - Value: `supabase`
   - Environment: ✅ Production, ✅ Preview, ✅ Development (全选)
   - 点击 **"Save"**

3. **添加第二个变量 - Supabase URL**:
   - 点击 **"Add New"**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://tshohxaqwmflxlvrdunv.supabase.co`
   - Environment: ✅ Production, ✅ Preview, ✅ Development (全选)
   - 点击 **"Save"**

4. **添加第三个变量 - Supabase Anon Key**:
   - 点击 **"Add New"**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `(粘贴你从第 1 步复制的 anon key)`
   - Environment: ✅ Production, ✅ Preview, ✅ Development (全选)
   - 点击 **"Save"**

### 方式 B: 通过 Vercel CLI

如果你更喜欢命令行,可以运行:

```bash
# 设置 Backend Type
vercel env add NEXT_PUBLIC_BACKEND_TYPE production
# 输入: supabase

vercel env add NEXT_PUBLIC_BACKEND_TYPE preview
# 输入: supabase

vercel env add NEXT_PUBLIC_BACKEND_TYPE development
# 输入: supabase

# 设置 Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 输入: https://tshohxaqwmflxlvrdunv.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# 输入: https://tshohxaqwmflxlvrdunv.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_URL development
# 输入: https://tshohxaqwmflxlvrdunv.supabase.co

# 设置 Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 输入: (你的 anon key)

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
# 输入: (你的 anon key)

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
# 输入: (你的 anon key)
```

---

## 第 4 步: 重新部署

### 方式 A: 通过 Vercel Dashboard

1. 访问: [https://vercel.com/okkylesu-8037s-projects/shake-words/deployments](https://vercel.com/okkylesu-8037s-projects/shake-words/deployments)
2. 找到最新的部署
3. 点击右侧 **"..."** → **"Redeploy"**
4. 确认重新部署

### 方式 B: 推送代码

```bash
git add .
git commit -m "chore: configure Supabase environment variables"
git push
```

自动部署会在几分钟后完成。

---

## 第 5 步: 配置 OAuth (可选但推荐)

为了让用户能够登录,你需要配置 OAuth Provider:

### GitHub OAuth (最简单)

1. **在 Supabase 中启用 GitHub**:
   - 访问: [https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/auth/providers](https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/auth/providers)
   - 找到 **GitHub**,点击开关启用

2. **创建 GitHub OAuth App**:
   - 访问: [https://github.com/settings/developers](https://github.com/settings/developers)
   - 点击 **"New OAuth App"**
   - 填写:
     - Application name: `ShakeWords`
     - Homepage URL: `https://shake-words-inky.vercel.app`
     - Authorization callback URL: `https://tshohxaqwmflxlvrdunv.supabase.co/auth/v1/callback`
   - 点击 **"Register application"**
   - 复制 **Client ID** 和 **Client Secret**

3. **回到 Supabase**,填入 Client ID 和 Client Secret
4. 点击 **"Save"**

---

## 第 6 步: 测试

1. **访问应用**: [https://shake-words-inky.vercel.app](https://shake-words-inky.vercel.app)
2. **点击右上角 "Sign In"**
3. **使用 GitHub 登录** (如果配置了 OAuth)
4. **开始学习单词**
5. **检查数据**:
   - 访问: [https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/table/editor](https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/table/editor)
   - 查看 `learning_records` 和 `word_progress` 表
   - 应该能看到你的学习记录

---

## 常见问题

**Q: 登录后看不到数据?**
A: 检查浏览器控制台的错误信息,确保:
- 环境变量配置正确
- 数据库表已创建
- RLS 策略已设置

**Q: 如何切换回本地存储?**
A: 在 Vercel 中将 `NEXT_PUBLIC_BACKEND_TYPE` 改为 `local`,然后重新部署。

**Q: 需要配置 Google OAuth 吗?**
A: 不是必须的,GitHub OAuth 就够了。如果需要 Google,步骤类似。

---

## 需要帮助?

如果在任何步骤遇到问题,请告诉我具体是哪一步,我会提供更详细的指导!
