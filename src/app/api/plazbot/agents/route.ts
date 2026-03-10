import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM agents ORDER BY name");
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();
    const result = await pool.query(
      "INSERT INTO agents (name, email, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name=$1, role=$3 RETURNING *",
      [name, email, role || "agent"]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
