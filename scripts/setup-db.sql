-- ============================================
-- Open WhatsApp Multi Agente - Database Setup
-- ============================================
-- Ejecutar con: psql -h localhost -U postgres -d whatsapp_crm -f scripts/setup-db.sql
-- O copiar y pegar en tu cliente PostgreSQL

-- Primero crea la base de datos (ejecuta esto por separado si no existe):
-- CREATE DATABASE whatsapp_crm;

-- ─── Contactos ───
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  nombre TEXT,
  telefono TEXT,
  email TEXT,
  ciudad TEXT,
  pais TEXT,
  dispositivo TEXT,
  tipo_contacto TEXT DEFAULT 'whatsapp',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_ultimo_mensaje TIMESTAMP,
  assigned_agent_id INTEGER,
  conversation_status INTEGER DEFAULT 0,
  resolved_at TIMESTAMP,
  snoozed_until TIMESTAMP,
  custom_fields JSONB DEFAULT '{}'
);

-- ─── Mensajes ───
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  mensaje_id TEXT,
  session_id TEXT NOT NULL,
  mensaje TEXT,
  is_bot BOOLEAN DEFAULT false,
  wa_message_id TEXT,
  tipo_archivo TEXT,
  ruta_archivo TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  status INTEGER DEFAULT 1,
  error_message TEXT,
  nombre_agente TEXT,
  metadata JSONB DEFAULT '{}',
  nota_interna BOOLEAN DEFAULT false,
  mensaje_eliminado BOOLEAN DEFAULT false,
  private BOOLEAN DEFAULT false
);

-- ─── Agentes ───
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'agent',
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Etiquetas ───
CREATE TABLE IF NOT EXISTS labels (
  id SERIAL PRIMARY KEY,
  name TEXT,
  title TEXT UNIQUE,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Relacion Contacto-Etiquetas ───
CREATE TABLE IF NOT EXISTS contact_labels (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(contact_id, label_id)
);

-- ─── Respuestas rapidas ───
CREATE TABLE IF NOT EXISTS canned_responses (
  id SERIAL PRIMARY KEY,
  short_code TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Templates de WhatsApp ───
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  status TEXT,
  components JSONB,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- ─── Campanas masivas ───
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT,
  message_text TEXT,
  template_name TEXT,
  template_lang TEXT DEFAULT 'es',
  filter_criteria JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Destinatarios de campanas ───
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  session_id TEXT,
  status TEXT DEFAULT 'pending',
  wa_message_id TEXT,
  sent_at TIMESTAMP,
  error_message TEXT
);

-- ─── Reglas de automatizacion ───
CREATE TABLE IF NOT EXISTS automation_rules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  actions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Integraciones ───
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  connected BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Configuracion general ───
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ─── Encuestas de satisfaccion ───
CREATE TABLE IF NOT EXISTS csat_responses (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── Indices para rendimiento ───
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_fecha ON messages(fecha_creacion DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_mensaje_id_unique ON messages(mensaje_id);
CREATE INDEX IF NOT EXISTS idx_messages_wa_message_id ON messages(wa_message_id);
CREATE INDEX IF NOT EXISTS idx_contacts_session_id ON contacts(session_id);
CREATE INDEX IF NOT EXISTS idx_contacts_telefono ON contacts(telefono);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(conversation_status);
CREATE INDEX IF NOT EXISTS idx_contact_labels_contact ON contact_labels(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_labels_label ON contact_labels(label_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);

-- ─── Datos iniciales ───

-- ─── Backfills / compat ───
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS tipo_archivo TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS ruta_archivo TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status INTEGER DEFAULT 1;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS nombre_agente TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS nota_interna BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS mensaje_eliminado BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS private BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS wa_message_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_mensaje_id_unique ON messages(mensaje_id);
CREATE INDEX IF NOT EXISTS idx_messages_wa_message_id ON messages(wa_message_id);

ALTER TABLE labels ADD COLUMN IF NOT EXISTS title TEXT;
UPDATE labels SET title = COALESCE(title, name) WHERE title IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_labels_title_unique ON labels(title);

ALTER TABLE canned_responses ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]';

ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS message_text TEXT;
UPDATE campaigns SET message_text = COALESCE(message_text, message) WHERE message_text IS NULL;

ALTER TABLE campaign_recipients ADD COLUMN IF NOT EXISTS wa_message_id TEXT;

-- Configuracion por defecto
INSERT INTO settings (key, value) VALUES
  ('business_hours', '{"enabled": false, "timezone": "America/Bogota", "schedule": {}, "auto_message": "Estamos fuera de horario. Te responderemos pronto."}'),
  ('welcome_message', '{"enabled": false, "message": "Hola {nombre}! Bienvenido. En que podemos ayudarte?", "delay_seconds": 5}'),
  ('csat', '{"enabled": false, "message": "Como calificarias nuestra atencion? Responde del 1 al 5", "trigger": "on_resolve"}')
ON CONFLICT (key) DO NOTHING;

-- Integraciones disponibles
INSERT INTO integrations (id, name) VALUES
  ('mercadolibre', 'MercadoLibre'),
  ('facebook', 'Facebook Messenger'),
  ('instagram', 'Instagram DM'),
  ('tiktok', 'TikTok'),
  ('webchat', 'Chat Web')
ON CONFLICT (id) DO NOTHING;

-- Etiquetas de ejemplo
INSERT INTO labels (title, color) VALUES
  ('Nuevo', '#22C55E'),
  ('VIP', '#EAB308'),
  ('Soporte', '#3B82F6'),
  ('Urgente', '#EF4444')
ON CONFLICT (title) DO NOTHING;

-- ============================================
-- Setup completado!
-- ============================================
