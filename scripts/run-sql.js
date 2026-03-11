const fs = require("node:fs");
const path = require("node:path");

const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.example") });

const pg = require("pg");

function shouldUseSsl(connectionString) {
  const lower = connectionString.toLowerCase();
  if (lower.includes("sslmode=disable")) return false;
  if (lower.includes("localhost") || lower.includes("127.0.0.1")) return false;
  return true;
}

function splitSqlStatements(sqlText) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;

  for (let i = 0; i < sqlText.length; i++) {
    const ch = sqlText[i];

    if (ch === "'") {
      const next = sqlText[i + 1];
      if (inSingleQuote && next === "'") {
        current += "''";
        i++;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }

    if (ch === ";" && !inSingleQuote) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = "";
      continue;
    }

    current += ch;
  }

  const trimmed = current.trim();
  if (trimmed) statements.push(trimmed);
  return statements;
}

function stripLineComments(sqlText) {
  return sqlText
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");
}

async function main() {
  const sqlPathArg = process.argv[2] || "scripts/setup-db.sql";
  const sqlPath = path.resolve(process.cwd(), sqlPathArg);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada (revisar .env/.env.local/.env.example).");
  }

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`No existe el archivo SQL: ${sqlPath}`);
  }

  const sqlText = fs.readFileSync(sqlPath, "utf8");
  const cleaned = stripLineComments(sqlText);
  const statements = splitSqlStatements(cleaned);

  const client = new pg.Client({
    connectionString,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  await client.connect();

  try {
    await client.query("BEGIN");
    for (const stmt of statements) {
      await client.query(stmt);
    }
    await client.query("COMMIT");

    const tables = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    const settingsCount = await client.query("SELECT COUNT(*)::int AS count FROM settings");
    const labelsCount = await client.query("SELECT COUNT(*)::int AS count FROM labels");

    console.log("OK: migración aplicada.");
    console.log("Tablas:", tables.rows.map((r) => r.table_name).join(", "));
    console.log("settings:", settingsCount.rows[0]?.count ?? 0, "| labels:", labelsCount.rows[0]?.count ?? 0);
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("ERROR:", e?.message || e);
  process.exit(1);
});
