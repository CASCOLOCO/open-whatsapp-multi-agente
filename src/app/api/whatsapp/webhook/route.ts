import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// GET - Webhook verification
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Helper: Check if within business hours
async function isWithinBusinessHours(): Promise<{ within: boolean; message: string }> {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'business_hours'");
    if (!result.rows[0]) return { within: true, message: "" };
    const config = result.rows[0].value;
    if (!config.enabled) return { within: true, message: "" };

    const now = new Date();
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayKey = days[now.getDay()];
    const schedule = config.schedule?.[dayKey];

    if (!schedule) return { within: false, message: config.auto_message || "" };

    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return { within: true, message: "" };
    }
    return { within: false, message: config.auto_message || "" };
  } catch { return { within: true, message: "" }; }
}

// Helper: Check welcome message for new contacts
async function checkWelcomeMessage(sessionId: string): Promise<string | null> {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'welcome_message'");
    if (!result.rows[0]) return null;
    const config = result.rows[0].value;
    if (!config.enabled) return null;

    // Check if this is a new contact (no previous messages from us)
    const msgCheck = await pool.query(
      "SELECT COUNT(*) FROM messages WHERE session_id = $1 AND is_bot = true",
      [sessionId]
    );
    if (parseInt(msgCheck.rows[0].count) > 0) return null;

    return config.message || null;
  } catch { return null; }
}

// Helper: Run automation rules
async function runAutomations(event: string, sessionId: string, message: string, contactId: number) {
  try {
    const rules = await pool.query(
      "SELECT * FROM automation_rules WHERE event = $1 AND is_active = true",
      [event]
    );

    for (const rule of rules.rows) {
      let match = true;
      const conditions = rule.conditions || [];

      for (const cond of conditions) {
        if (cond.type === "contains" && cond.value) {
          if (!message.toLowerCase().includes(cond.value.toLowerCase())) match = false;
        }
        if (cond.type === "starts_with" && cond.value) {
          if (!message.toLowerCase().startsWith(cond.value.toLowerCase())) match = false;
        }
      }

      if (!match) continue;

      const actions = rule.actions || [];
      for (const action of actions) {
        if (action.type === "add_label" && action.labelId) {
          await pool.query(
            "INSERT INTO contact_labels (contact_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [contactId, action.labelId]
          );
        }
        if (action.type === "set_status" && action.status !== undefined) {
          await pool.query("UPDATE contacts SET conversation_status = $1 WHERE id = $2", [action.status, contactId]);
        }
        if (action.type === "assign_agent" && action.agentId) {
          await pool.query("UPDATE contacts SET assigned_agent_id = $1 WHERE id = $2", [action.agentId, contactId]);
        }
      }

      // Increment execution count
      await pool.query("UPDATE automation_rules SET execution_count = execution_count + 1 WHERE id = $1", [rule.id]);
    }
  } catch (e) { console.error("[Automation Error]", e); }
}

// Helper: Send WhatsApp message
async function sendWhatsApp(to: string, text: string) {
  if (!ACCESS_TOKEN || ACCESS_TOKEN === "PENDIENTE_CONFIGURAR") return;
  try {
    await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
    });
  } catch {}
}

// POST - Receive incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    if (!value) return NextResponse.json({ status: "ok" });

    // Process incoming messages
    if (value.messages) {
      for (const msg of value.messages) {
        const from = msg.from;
        const timestamp = msg.timestamp;
        const messageId = msg.id;
        const contactInfo = value.contacts?.find((c: any) => c.wa_id === from);
        const contactName = contactInfo?.profile?.name || null;

        // Upsert contact - reopen if resolved
        const contactResult = await pool.query(
          `INSERT INTO contacts (session_id, nombre, telefono, fecha_ultimo_mensaje, conversation_status)
           VALUES ($1, $2, $1, NOW(), 0)
           ON CONFLICT (session_id) DO UPDATE SET
             nombre = COALESCE($2, contacts.nombre),
             fecha_ultimo_mensaje = NOW(),
             conversation_status = CASE WHEN contacts.conversation_status = 2 THEN 0 ELSE contacts.conversation_status END
           RETURNING *`,
          [from, contactName]
        );
        const contact = contactResult.rows[0];

        // Extract message content
        let messageText = "";
        let fileUrl = null;
        let fileType = null;

        switch (msg.type) {
          case "text": messageText = msg.text?.body || ""; break;
          case "image": messageText = msg.image?.caption || "[Imagen]"; fileType = "image"; fileUrl = msg.image?.id; break;
          case "audio": messageText = "[Audio]"; fileType = "audio"; fileUrl = msg.audio?.id; break;
          case "video": messageText = msg.video?.caption || "[Video]"; fileType = "video"; fileUrl = msg.video?.id; break;
          case "document": messageText = msg.document?.caption || `[Doc: ${msg.document?.filename || ""}]`; fileType = "document"; fileUrl = msg.document?.id; break;
          case "location": messageText = `[Ubicacion: ${msg.location?.latitude}, ${msg.location?.longitude}]`; break;
          case "sticker": messageText = "[Sticker]"; fileType = "sticker"; fileUrl = msg.sticker?.id; break;
          case "reaction": messageText = `[Reaccion: ${msg.reaction?.emoji}]`; break;
          case "contacts": messageText = "[Contacto compartido]"; break;
          default: messageText = `[${msg.type || "Desconocido"}]`;
        }

        // Save message
        await pool.query(
          `INSERT INTO messages (mensaje_id, session_id, mensaje, is_bot, tipo_archivo, ruta_archivo, fecha_creacion, wa_message_id, status, metadata)
           VALUES ($1, $2, $3, false, $4, $5, to_timestamp($6), $1, 3, $7)
           ON CONFLICT (mensaje_id) DO NOTHING`,
          [messageId, from, messageText, fileType, fileUrl, parseInt(timestamp),
           JSON.stringify({ type: msg.type, raw: msg })]
        );

        // Run automations
        if (contact) {
          await runAutomations("message_received", from, messageText, contact.id);
        }

        // Welcome message for new contacts
        const welcomeMsg = await checkWelcomeMessage(from);
        if (welcomeMsg && contact) {
          const personalizedMsg = welcomeMsg.replace(/\{nombre\}/g, contact.nombre || "");
          await sendWhatsApp(from, personalizedMsg);
        }

        // Business hours check
        const { within, message: autoMsg } = await isWithinBusinessHours();
        if (!within && autoMsg && contact) {
          const personalizedMsg = autoMsg.replace(/\{nombre\}/g, contact.nombre || "");
          await sendWhatsApp(from, personalizedMsg);
        }

        console.log(`[WA] ${from}: ${messageText.substring(0, 50)}`);
      }
    }

    // Process status updates (sent, delivered, read, failed)
    if (value.statuses) {
      for (const status of value.statuses) {
        const statusMap: Record<string, number> = { sent: 1, delivered: 2, read: 3, failed: 4 };
        const statusCode = statusMap[status.status] || 0;
        const errorMsg = status.errors?.[0]?.message || null;

        await pool.query(
          `UPDATE messages SET status = $1, error_message = $2,
           metadata = COALESCE(metadata, '{}'::jsonb) || $3
           WHERE wa_message_id = $4 OR mensaje_id = $4`,
          [statusCode, errorMsg,
           JSON.stringify({ [`${status.status}_at`]: status.timestamp }),
           status.id]
        );
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[WA Webhook Error]", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
}
