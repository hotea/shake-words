# Vercel 环境变量配置 - Supabase

## 快速配置步骤

### 1. 访问 Vercel 项目设置

打开浏览器访问: [https://vercel.com/okkylesu-8037s-projects/shake-words/settings/environment-variables](https://vercel.com/okkylesu-8037s-projects/shake-words/settings/environment-variables)

### 2. 添加环境变量

点击 "Add New" 按钮,依次添加以下 3 个变量:

#### 变量 1: Backend Type
- **Name**: `NEXT_PUBLIC_BACKEND_TYPE`
- **Value**: `supabase`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development (全选)
- 点击 "Save"

#### 变量 2: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://你的项目ID.supabase.co`
  - 替换为你的实际 Supabase 项目 URL
- **Environment**: ✅ Production, ✅ Preview, ✅ Development (全选)
- 点击 "Save"

#### 变量 3: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - 替换为你的实际 Supabase anon key
- **Environment**: ✅ Production, ✅ Preview, ✅ Development (全选)
- 点击 "Save"

### 3. 重新部署

配置完成后,需要重新部署以使环境变量生效:

**方法 1: 通过 Vercel Dashboard**
1. 访问: [https://vercel.com/okkylesu-8037s-projects/shake-words/deployments](https://vercel.com/okkylesu-8037s-projects/shake-words/deployments)
2. 找到最新的部署
3. 点击右侧 "..." > "Redeploy"
4. 确认重新部署

**方法 2: 推送代码**
```bash
git add .
git commit -m "chore: update project documentation"
git push
```

### 4. 验证配置

部署完成后:

1. 访问: [https://shake-words-inky.vercel.app](https://shake-words-inky.vercel.app)
2. 点击右上角 "Sign In"
3. 应该能看到 GitHub/Google 登录选项
4. 登录后开始学习单词
5. 在 Supabase Dashboard 的 "Table Editor" 中查看数据

## 获取 Supabase 凭证

如果你还没有 Supabase 项目:

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 或 "New Project"
3. 创建项目后,进入 "Project Settings" > "API"
4. 复制:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbG...` (很长的字符串)

详细的 Supabase 设置指南请查看: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 注意事项

⚠️ **重要提示**:
- 这些是公开的环境变量(以 `NEXT_PUBLIC_` 开头),会暴露在前端代码中
- Supabase 的 anon key 是设计为公开的,安全性由 RLS(Row Level Security)策略保证
- 永远不要将 service_role key 放在前端环境变量中
- 确保在 Supabase 中正确配置了 RLS 策略

## 切换回本地模式

如果想暂时禁用 Supabase,改回本地存储:

1. 在 Vercel 环境变量页面
2. 找到 `NEXT_PUBLIC_BACKEND_TYPE`
3. 将值从 `supabase` 改为 `local`
4. 保存并重新部署

这样用户数据就会存储在浏览器 localStorage 中,无需登录。
