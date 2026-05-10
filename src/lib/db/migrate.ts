import { query, execute, isMySqlConfigured } from "./mysql";

interface Migration {
  version: number;
  name: string;
  sql: string;
}

// ========== Migration Registry ==========
// Add new migrations at the END of this array.
// Each migration runs exactly once, in order.
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "init_online_stats_tables",
    sql: `
      CREATE TABLE IF NOT EXISTS online_stats (
        id           INT          NOT NULL PRIMARY KEY DEFAULT 1,
        total_count  INT          NOT NULL DEFAULT 0,
        updated_at   DATETIME(3)  NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS online_daily (
        date_key     VARCHAR(10)  NOT NULL PRIMARY KEY,
        count        INT          NOT NULL DEFAULT 0,
        updated_at   DATETIME(3)  NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
];

// ========== Migration Runner ==========

async function ensureMigrationTable() {
  await execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INT         NOT NULL PRIMARY KEY,
      name        VARCHAR(64) NOT NULL,
      applied_at  DATETIME(3) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function getAppliedVersions(): Promise<number[]> {
  const rows = await query<{ version: number }>(
    "SELECT version FROM _migrations ORDER BY version"
  );
  return rows.map((r) => r.version);
}

async function recordMigration(version: number, name: string) {
  await execute(
    "INSERT INTO _migrations (version, name, applied_at) VALUES (?, ?, NOW(3))",
    [version, name]
  );
}

export async function runMigrations(): Promise<void> {
  if (!isMySqlConfigured()) {
    console.log("[migrate] MySQL not configured, skipping migrations");
    return;
  }

  try {
    await ensureMigrationTable();
    const applied = new Set(await getAppliedVersions());

    let appliedCount = 0;
    for (const migration of MIGRATIONS) {
      if (applied.has(migration.version)) {
        continue;
      }

      console.log(
        `[migrate] Applying v${migration.version}: ${migration.name}...`
      );

      // Split by semicolon to handle multiple statements
      const statements = migration.sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await execute(stmt + ";");
      }

      await recordMigration(migration.version, migration.name);
      appliedCount++;
      console.log(`[migrate] v${migration.version} applied successfully`);
    }

    if (appliedCount === 0) {
      console.log("[migrate] Database is up to date");
    } else {
      console.log(`[migrate] ${appliedCount} migration(s) applied`);
    }
  } catch (error) {
    console.error("[migrate] Migration failed:", error);
    throw error;
  }
}
