#!/usr/bin/env node
/**
 * Execute SQL via Supabase REST API using fetch
 * This uses the /rest/v1/ endpoint with proper headers
 */

const https = require('https');

const SUPABASE_URL = 'tshohxaqwmflxlvrdunv.supabase.co';
const SUPABASE_KEY = 'sb_publishable__HZhmKjCJZOEgGqKU3_gvQ_Dw6zNH0H';

// SQL to execute
const sql = `
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

console.log('⚠️  Important Note:\n');
console.log('Supabase anon keys cannot execute DDL statements (CREATE TABLE, etc.) directly via REST API.\n');
console.log('This is a security feature - only authenticated users with proper roles can modify schema.\n');
console.log('✅ Solution: Please run the SQL manually in Supabase Dashboard\n');
console.log('URL: https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/sql/new\n');
console.log('The SQL has been prepared and is ready to copy-paste.\n');
console.log('--- Copy this SQL ---');
console.log(sql);
console.log('--- End SQL ---\n');
