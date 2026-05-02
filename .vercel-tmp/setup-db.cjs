#!/usr/bin/env node
/**
 * Setup Supabase database tables using REST API
 */

const https = require('https');

const SUPABASE_URL = 'https://tshohxaqwmflxlvrdunv.supabase.co';
const SUPABASE_KEY = 'sb_publishable__HZhmKjCJZOEgGqKU3_gvQ_Dw6zNH0H';

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

function executeSQL(sqlQuery) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sqlQuery });

    const options = {
      hostname: 'tshohxaqwmflxlvrdunv.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Setting up Supabase database tables...\n');

  try {
    // Note: The /rpc/exec_sql endpoint requires a custom function
    // For now, we'll provide instructions
    console.log('⚠️  Direct SQL execution via REST API requires a custom RPC function.\n');
    console.log('Please run the SQL manually in Supabase Dashboard:\n');
    console.log('URL: https://supabase.com/dashboard/project/tshohxaqwmflxlvrdunv/sql/new\n');
    console.log('--- SQL to copy ---');
    console.log(sql);
    console.log('--- End SQL ---\n');
    console.log('After running the SQL, your database will be ready!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
