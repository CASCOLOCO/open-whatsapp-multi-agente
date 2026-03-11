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

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada (revisar .env/.env.local/.env.example).");
  }

  const client = new pg.Client({
    connectionString,
    ...(shouldUseSsl(connectionString) ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  await client.connect();
  try {
    const tables = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );

    const messagesCols = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='messages' ORDER BY ordinal_position"
    );
    const contactsCols = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' ORDER BY ordinal_position"
    );
    const labelsCols = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='labels' ORDER BY ordinal_position"
    );

    const messagesIndexes = await client.query(
      "SELECT indexname FROM pg_indexes WHERE schemaname='public' AND tablename='messages' ORDER BY indexname"
    );

    console.log("Tablas:", tables.rows.map((r) => r.table_name).join(", "));
    console.log("contacts columns:", contactsCols.rows.map((r) => r.column_name).join(", "));
    console.log("messages columns:", messagesCols.rows.map((r) => r.column_name).join(", "));
    console.log("labels columns:", labelsCols.rows.map((r) => r.column_name).join(", "));
    console.log("messages indexes:", messagesIndexes.rows.map((r) => r.indexname).join(", "));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("ERROR:", e?.message || e);
  process.exit(1);
});
