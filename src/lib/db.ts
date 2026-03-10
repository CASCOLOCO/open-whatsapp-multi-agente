import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL no está configurada. Revisa tu archivo .env");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/whatsapp_crm",
  max: 10,
});

export default pool;
