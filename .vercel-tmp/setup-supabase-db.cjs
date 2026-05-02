#!/usr/bin/env node
/**
 * Setup Supabase database using @supabase/supabase-js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tshohxaqwmflxlvrdunv.supabase.co';
const SUPABASE_KEY = 'sb_publishable__HZhmKjCJZOEgGqKU3_gvQ_Dw6zNH0H';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...\n');

  // Create tables using SQL via REST API
  const sqlStatements = `
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
`;

  try {
    // Unfortunately, the anon key doesn't have permission to execute arbitrary SQL
    // We need to guide the user to do this manually
    
    console.log('ℹ️  Note: Database setup requires admin privileges.\n');
    console.log('Please follow these steps:\n');
    console.log('1. Open: https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/sql/new');
    console.log('2. Copy and paste the SQL below');
    console.log('3. Click "Run"\n');
    console.log('--- SQL START ---');
    console.log(sqlStatements);
    console.log('--- SQL END ---\n');
    console.log('✅ Once done, your database will be ready for ShakeWords!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
