import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL no está configurada. Revisa tu archivo .env");
}

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/whatsapp_crm";

const ssl =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? undefined
    : { rejectUnauthorized: false };

const pool = new pg.Pool({
  connectionString,
  ...(ssl ? { ssl } : {}),
  max: 10,
});

export default pool;
