#!/usr/bin/env node
/**
 * Supabase Configuration Helper Script
 * Helps configure Vercel environment variables for Supabase
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const isWindows = process.platform === 'win32';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(msg) {
  console.log(msg);
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function runCommand(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: isWindows,
    ...options
  });
  return result.status === 0;
}

async function main() {
  log('\n========================================');
  log('ShakeWords - Supabase 配置助手');
  log('========================================\n');

  log('这个脚本将帮助你在 Vercel 上配置 Supabase 环境变量。\n');

  // Step 1: Check if user has Supabase project
  log('📋 步骤 1: 准备 Supabase 项目信息\n');
  log('如果你还没有 Supabase 项目:');
  log('1. 访问 https://supabase.com');
  log('2. 点击 "New Project" 创建项目');
  log('3. 进入项目后,点击 "Project Settings" > "API"\n');

  const hasSupabase = await question('你已经有 Supabase 项目了吗? (y/n): ');

  if (hasSupabase.toLowerCase() !== 'y' && hasSupabase.toLowerCase() !== 'yes') {
    log('\n请先创建 Supabase 项目,然后重新运行此脚本。');
    log('创建完成后,你需要:');
    log('1. 获取 Project URL (格式: https://xxx.supabase.co)');
    log('2. 获取 anon public key (很长的字符串)\n');
    rl.close();
    return;
  }

  // Step 2: Get Supabase credentials
  log('\n📋 步骤 2: 输入 Supabase 凭证\n');

  const supabaseUrl = await question('请输入 Supabase Project URL: ');
  if (!supabaseUrl.includes('supabase.co')) {
    log('❌ 错误: URL 格式不正确,应该类似 https://xxx.supabase.co');
    rl.close();
    return;
  }

  const supabaseKey = await question('请输入 Supabase Anon Key: ');
  if (supabaseKey.length < 50) {
    log('❌ 错误: Anon Key 长度不正确,请检查是否复制完整');
    rl.close();
    return;
  }

  // Step 3: Configure database
  log('\n📋 步骤 3: 配置数据库\n');
  log('请在 Supabase SQL Editor 中运行以下 SQL:\n');
  log('--- 复制以下内容 ---');
  log(`
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

CREATE TABLE IF NOT EXISTS word_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  mastery INTEGER DEFAULT 0 NOT NULL,
  next_review TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, word_id)
);

ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own records" ON learning_records;
DROP POLICY IF EXISTS "Users insert own records" ON learning_records;
DROP POLICY IF EXISTS "Users read own progress" ON word_progress;
DROP POLICY IF EXISTS "Users upsert own progress" ON word_progress;

CREATE POLICY "Users read own records" ON learning_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own records" ON learning_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own progress" ON word_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own progress" ON word_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_records_user_book ON learning_records(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_records_created ON learning_records(created_at DESC);
`);
  log('--- 结束 ---\n');

  const dbConfigured = await question('你已经在 Supabase 中运行了上面的 SQL 吗? (y/n): ');

  if (dbConfigured.toLowerCase() !== 'y' && dbConfigured.toLowerCase() !== 'yes') {
    log('\n请先在 Supabase SQL Editor 中运行上面的 SQL,然后重新运行此脚本。');
    rl.close();
    return;
  }

  // Step 4: Set Vercel environment variables
  log('\n📋 步骤 4: 配置 Vercel 环境变量\n');

  const setEnvVars = await question('现在要在 Vercel 上设置环境变量吗? (y/n): ');

  if (setEnvVars.toLowerCase() !== 'y' && setEnvVars.toLowerCase() !== 'yes') {
    log('\n你可以稍后手动在 Vercel Dashboard 中设置环境变量。');
    log('或者重新运行此脚本来自动配置。\n');
    rl.close();
    return;
  }

  log('\n正在设置环境变量...\n');

  // Set NEXT_PUBLIC_BACKEND_TYPE
  log('设置 NEXT_PUBLIC_BACKEND_TYPE...');
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_BACKEND_TYPE', 'production', '--force'], {
    input: 'supabase\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_BACKEND_TYPE', 'preview', '--force'], {
    input: 'supabase\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_BACKEND_TYPE', 'development', '--force'], {
    input: 'supabase\n'
  });

  // Set NEXT_PUBLIC_SUPABASE_URL
  log('设置 NEXT_PUBLIC_SUPABASE_URL...');
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_URL', 'production', '--force'], {
    input: supabaseUrl + '\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_URL', 'preview', '--force'], {
    input: supabaseUrl + '\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_URL', 'development', '--force'], {
    input: supabaseUrl + '\n'
  });

  // Set NEXT_PUBLIC_SUPABASE_ANON_KEY
  log('设置 NEXT_PUBLIC_SUPABASE_ANON_KEY...');
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'production', '--force'], {
    input: supabaseKey + '\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'preview', '--force'], {
    input: supabaseKey + '\n'
  });
  runCommand('vercel', ['env', 'add', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'development', '--force'], {
    input: supabaseKey + '\n'
  });

  log('\n✅ 环境变量配置完成!\n');

  // Step 5: Redeploy
  log('📋 步骤 5: 重新部署\n');

  const redeploy = await question('现在要重新部署应用吗? (y/n): ');

  if (redeploy.toLowerCase() === 'y' || redeploy.toLowerCase() === 'yes') {
    log('\n正在重新部署...\n');
    const success = runCommand('vercel', ['--prod', '--yes']);

    if (success) {
      log('\n========================================');
      log('🎉 配置完成!');
      log('========================================\n');
      log('你的应用已经配置好 Supabase 并重新部署。');
      log('访问 https://shake-words-inky.vercel.app 测试登录功能。\n');
    } else {
      log('\n⚠️  部署失败,请手动重新部署。');
      log('可以在 Vercel Dashboard 中触发重新部署。\n');
    }
  } else {
    log('\n你可以稍后手动重新部署,或在推送代码时自动部署。\n');
    log('========================================');
    log('✅ 环境变量配置完成!');
    log('========================================\n');
    log('记得重新部署以使配置生效。\n');
  }

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
