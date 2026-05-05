import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

/**
 * Get a MySQL connection pool (singleton).
 * Configured via DATABASE_URL or individual env vars.
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

  return pool;
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
