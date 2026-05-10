import mysql from "mysql2/promise";
import { runMigrations } from "./migrate";

let pool: mysql.Pool | null = null;
let migrationPromise: Promise<void> | null = null;

/**
 * Get a MySQL connection pool (singleton).
 * Configured via DATABASE_URL or individual env vars.
 * Automatically runs pending migrations on first connection.
 */
export function getPool(): mysql.Pool {
  if (pool) return pool;

  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    pool = mysql.createPool(databaseUrl);
  } else {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "shakewords",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: "+00:00",
    });
  }

  // Trigger migrations on first pool creation (non-blocking)
  if (!migrationPromise) {
    migrationPromise = runMigrations().catch((err) => {
      console.error("[mysql] Auto-migration failed:", err);
    });
  }

  return pool;
}

/** Wait for migrations to complete (useful for startup health checks) */
export async function ensureMigrated(): Promise<void> {
  getPool(); // Ensure pool and migration are triggered
  if (migrationPromise) {
    await migrationPromise;
  }
}

/** Execute a query and return rows */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = Record<string, any>>(
  sql: string,
  params: (string | number | boolean | Date | null)[] = [],
): Promise<T[]> {
  const p = getPool();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await p.execute(sql, params as any);
  return rows as T[];
}

/** Execute a write query and return the result */
export async function execute(
  sql: string,
  params: (string | number | boolean | Date | null)[] = [],
): Promise<mysql.ResultSetHeader> {
  const p = getPool();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await p.execute(sql, params as any);
  return result as mysql.ResultSetHeader;
}

/** Check if MySQL is configured */
export function isMySqlConfigured(): boolean {
  return !!(process.env.DATABASE_URL || process.env.MYSQL_HOST);
}
