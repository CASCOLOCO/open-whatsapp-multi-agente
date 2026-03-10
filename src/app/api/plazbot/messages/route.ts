import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/plazbot/messages?sessionId=xxx&page=1&limit=100
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sessionId = searchParams.get("sessionId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = (page - 1) * limit;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const [messagesResult, countResult, contactResult] = await Promise.all([
      pool.query(
        `SELECT * FROM messages WHERE session_id = $1 ORDER BY fecha_creacion ASC LIMIT $2 OFFSET $3`,
        [sessionId, limit, offset]
      ),
      pool.query("SELECT COUNT(*) FROM messages WHERE session_id = $1", [sessionId]),
      pool.query("SELECT * FROM contacts WHERE session_id = $1", [sessionId]),
    ]);

    return NextResponse.json({
      messages: messagesResult.rows,
      contact: contactResult.rows[0] || null,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
