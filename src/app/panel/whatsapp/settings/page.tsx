"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface AutomationRule {
  id: number;
  name: string;
  description: string;
  event: string;
  conditions: any;
  actions: any;
  is_active: boolean;
  execution_count: number;
}

interface Settings {
  business_hours: {
    enabled: boolean;
    timezone: string;
    schedule: { [key: string]: { start: string; end: string; enabled: boolean } };
    out_of_hours_message: string;
  };
  welcome_message: {
    enabled: boolean;
    message: string;
    delay_seconds: number;
  };
  csat: {
    enabled: boolean;
    message: string;
    trigger: string;
  };
}

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
  is_online: boolean;
}

interface CannedResponse {
  id: number;
  short_code: string;
  content: string;
}

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  config: any;
  updated_at: string;
}

const INTEGRATION_META: Record<string, { color: string; icon: string; description: string; fields: { key: string; label: string; placeholder: string; type?: string }[] }> = {
  mercadolibre: {
    color: "#FFE600",
    icon: "🟡",
    description: "Recibe preguntas de tus publicaciones de MercadoLibre",
    fields: [
      { key: "app_id", label: "App ID", placeholder: "Tu App ID de MercadoLibre" },
      { key: "client_secret", label: "Client Secret", placeholder: "Tu Client Secret", type: "password" },
      { key: "redirect_uri", label: "Redirect URI", placeholder: "https://tu-dominio.com/api/integrations/mercadolibre/callback" },
    ],
  },
  facebook: {
    color: "#1877F2",
    icon: "🔵",
    description: "Recibe mensajes de tu pagina de Facebook",
    fields: [
      { key: "page_id", label: "Page ID", placeholder: "ID de tu pagina de Facebook" },
      { key: "page_access_token", label: "Page Access Token", placeholder: "Token de acceso de la pagina", type: "password" },
    ],
  },
  instagram: {
    color: "#E4405F",
    icon: "🟣",
    description: "Recibe mensajes directos de Instagram",
    fields: [
      { key: "account_id", label: "Instagram Business Account ID", placeholder: "ID de cuenta Business" },
      { key: "access_token", label: "Access Token", placeholder: "Token de acceso de Instagram", type: "password" },
    ],
  },
  tiktok: {
    color: "#000000",
    icon: "⬛",
    description: "Recibe mensajes de TikTok Business",
    fields: [
      { key: "business_id", label: "Business Account ID", placeholder: "ID de cuenta Business de TikTok" },
      { key: "access_token", label: "Access Token", placeholder: "Token de acceso de TikTok", type: "password" },
    ],
  },
  webchat: {
    color: "#22C55E",
    icon: "🟢",
    description: "Widget de chat en vivo para tu sitio web",
    fields: [
      { key: "primary_color", label: "Color primario", placeholder: "#22C55E", type: "color" },
      { key: "welcome_message", label: "Mensaje de bienvenida", placeholder: "Hola! En que podemos ayudarte?" },
      { key: "position", label: "Posicion", placeholder: "bottom-right" },
    ],
  },
};

const EVENT_TYPES = [
  { value: "message_created", label: "Nuevo mensaje recibido" },
  { value: "conversation_created", label: "Nueva conversacion" },
  { value: "conversation_status_changed", label: "Estado cambiado" },
  { value: "conversation_assigned", label: "Conversacion asignada" },
];

const ACTION_TYPES = [
  { value: "assign_agent", label: "Asignar agente" },
  { value: "send_message", label: "Enviar mensaje" },
  { value: "change_status", label: "Cambiar estado" },
  { value: "add_label", label: "Agregar etiqueta" },
];

const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

export default function WhatsAppSettingsPage() {
  const [tab, setTab] = useState<"general" | "automation" | "agents" | "canned" | "integrations">("general");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [canned, setCanned] = useState<CannedResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // New agent form
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");

  // New canned form
  const [newCannedCode, setNewCannedCode] = useState("");
  const [newCannedContent, setNewCannedContent] = useState("");

  // New rule form
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", event: "message_created", description: "" });

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [integrationConfig, setIntegrationConfig] = useState<Record<string, string>>({});
  const [savingIntegration, setSavingIntegration] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/settings");
      if (res.ok) setSettings(await res.json());
    } catch {}
  }, []);

  const fetchRules = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/automation");
      if (res.ok) setRules(await res.json());
    } catch {}
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/agents");
      if (res.ok) setAgents(await res.json());
    } catch {}
  }, []);

  const fetchCanned = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/canned?search=");
      if (res.ok) setCanned(await res.json());
    } catch {}
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/integrations");
      if (res.ok) setIntegrations(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchRules();
    fetchAgents();
    fetchCanned();
    fetchIntegrations();
  }, [fetchSettings, fetchRules, fetchAgents, fetchCanned, fetchIntegrations]);

  const saveSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      await fetch("/api/plazbot/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      setSaveMsg("Guardado");
      setTimeout(() => setSaveMsg(""), 2000);
      fetchSettings();
    } catch { setSaveMsg("Error"); }
    setSaving(false);
  };

  const toggleRule = async (rule: AutomationRule) => {
    try {
      await fetch("/api/plazbot/automation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rule.id, is_active: !rule.is_active }),
      });
      fetchRules();
    } catch {}
  };

  const deleteRule = async (id: number) => {
    try {
      await fetch(`/api/plazbot/automation?id=${id}`, { method: "DELETE" });
      fetchRules();
    } catch {}
  };

  const createRule = async () => {
    if (!newRule.name) return;
    try {
      await fetch("/api/plazbot/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRule,
          conditions: {},
          actions: {},
        }),
      });
      setShowNewRule(false);
      setNewRule({ name: "", event: "message_created", description: "" });
      fetchRules();
    } catch {}
  };

  const createAgent = async () => {
    if (!newAgentName || !newAgentEmail) return;
    try {
      await fetch("/api/plazbot/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAgentName, email: newAgentEmail }),
      });
      setNewAgentName("");
      setNewAgentEmail("");
      fetchAgents();
    } catch {}
  };

  const deleteAgent = async (id: number) => {
    try {
      await fetch(`/api/plazbot/agents?id=${id}`, { method: "DELETE" });
      fetchAgents();
    } catch {}
  };

  const createCanned = async () => {
    if (!newCannedCode || !newCannedContent) return;
    try {
      await fetch("/api/plazbot/canned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ short_code: newCannedCode, content: newCannedContent }),
      });
      setNewCannedCode("");
      setNewCannedContent("");
      fetchCanned();
    } catch {}
  };

  const deleteCanned = async (id: number) => {
    try {
      await fetch(`/api/plazbot/canned?id=${id}`, { method: "DELETE" });
      fetchCanned();
    } catch {}
  };

  const saveIntegration = async (id: string) => {
    setSavingIntegration(true);
    try {
      await fetch("/api/plazbot/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, config: integrationConfig, connected: true }),
      });
      setSaveMsg("Integracion guardada");
      setTimeout(() => setSaveMsg(""), 2000);
      setEditingIntegration(null);
      setIntegrationConfig({});
      fetchIntegrations();
    } catch { setSaveMsg("Error al guardar"); }
    setSavingIntegration(false);
  };

  const disconnectIntegration = async (id: string) => {
    try {
      await fetch(`/api/plazbot/integrations?id=${id}`, { method: "DELETE" });
      setSaveMsg("Integracion desconectada");
      setTimeout(() => setSaveMsg(""), 2000);
      setEditingIntegration(null);
      fetchIntegrations();
    } catch {}
  };

  const openIntegrationConfig = (intg: Integration) => {
    if (editingIntegration === intg.id) {
      setEditingIntegration(null);
      return;
    }
    setEditingIntegration(intg.id);
    setIntegrationConfig(intg.config && typeof intg.config === "object" ? { ...intg.config } : {});
  };

  if (!settings) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuracion WhatsApp</h1>
          <p className="text-sm text-neutral-500 mt-1">Automatizacion, agentes y respuestas rapidas</p>
        </div>
        <Link href="/panel/whatsapp" className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition">
          ← Volver al chat
        </Link>
      </div>

      {saveMsg && (
        <div className="mb-4 px-4 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-sm text-green-400">{saveMsg}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-800/50 rounded-lg p-1 mb-6">
        {([
          { key: "general" as const, label: "General" },
          { key: "automation" as const, label: "Automatizacion" },
          { key: "agents" as const, label: "Agentes" },
          { key: "canned" as const, label: "Resp. rapidas" },
          { key: "integrations" as const, label: "Integraciones" },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              tab === t.key ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {tab === "general" && (
        <div className="space-y-6">
          {/* Business Hours */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Horario de atencion</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Respuesta automatica fuera de horario</p>
              </div>
              <button
                onClick={() => saveSetting("business_hours", { ...settings.business_hours, enabled: !settings.business_hours.enabled })}
                className={`w-12 h-6 rounded-full transition ${settings.business_hours.enabled ? "bg-green-600" : "bg-neutral-700"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.business_hours.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            {settings.business_hours.enabled && (
              <div className="space-y-3">
                {DAYS.map(day => {
                  const dayConfig = settings.business_hours.schedule[day] || { start: "08:00", end: "18:00", enabled: true };
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newSchedule = { ...settings.business_hours.schedule, [day]: { ...dayConfig, enabled: !dayConfig.enabled } };
                          saveSetting("business_hours", { ...settings.business_hours, schedule: newSchedule });
                        }}
                        className={`w-24 text-left text-sm capitalize ${dayConfig.enabled ? "text-white" : "text-neutral-600 line-through"}`}
                      >
                        {day}
                      </button>
                      <input
                        type="time"
                        value={dayConfig.start}
                        onChange={e => {
                          const newSchedule = { ...settings.business_hours.schedule, [day]: { ...dayConfig, start: e.target.value } };
                          saveSetting("business_hours", { ...settings.business_hours, schedule: newSchedule });
                        }}
                        disabled={!dayConfig.enabled}
                        className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white disabled:opacity-30"
                      />
                      <span className="text-neutral-500 text-xs">a</span>
                      <input
                        type="time"
                        value={dayConfig.end}
                        onChange={e => {
                          const newSchedule = { ...settings.business_hours.schedule, [day]: { ...dayConfig, end: e.target.value } };
                          saveSetting("business_hours", { ...settings.business_hours, schedule: newSchedule });
                        }}
                        disabled={!dayConfig.enabled}
                        className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white disabled:opacity-30"
                      />
                    </div>
                  );
                })}

                <div className="mt-4">
                  <label className="text-xs text-neutral-500">Mensaje fuera de horario</label>
                  <textarea
                    value={settings.business_hours.out_of_hours_message}
                    onChange={e => saveSetting("business_hours", { ...settings.business_hours, out_of_hours_message: e.target.value })}
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Welcome Message */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Mensaje de bienvenida</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Para contactos nuevos</p>
              </div>
              <button
                onClick={() => saveSetting("welcome_message", { ...settings.welcome_message, enabled: !settings.welcome_message.enabled })}
                className={`w-12 h-6 rounded-full transition ${settings.welcome_message.enabled ? "bg-green-600" : "bg-neutral-700"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.welcome_message.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            {settings.welcome_message.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-500">Mensaje</label>
                  <textarea
                    value={settings.welcome_message.message}
                    onChange={e => saveSetting("welcome_message", { ...settings.welcome_message, message: e.target.value })}
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
                    rows={3}
                    placeholder="Hola {nombre}! Bienvenido!..."
                  />
                  <p className="text-[10px] text-neutral-600 mt-1">Variables: {"{nombre}"} {"{telefono}"} {"{ciudad}"}</p>
                </div>
              </div>
            )}
          </div>

          {/* CSAT */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Encuesta de satisfaccion (CSAT)</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Al resolver conversaciones</p>
              </div>
              <button
                onClick={() => saveSetting("csat", { ...settings.csat, enabled: !settings.csat.enabled })}
                className={`w-12 h-6 rounded-full transition ${settings.csat.enabled ? "bg-green-600" : "bg-neutral-700"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.csat.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            {settings.csat.enabled && (
              <textarea
                value={settings.csat.message}
                onChange={e => saveSetting("csat", { ...settings.csat, message: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
                rows={2}
                placeholder="Como calificarias nuestra atencion? Responde del 1 al 5..."
              />
            )}
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {tab === "automation" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-400">{rules.length} reglas configuradas</p>
            <button
              onClick={() => setShowNewRule(true)}
              className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition"
            >
              + Nueva regla
            </button>
          </div>

          {showNewRule && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
              <h4 className="text-white font-medium mb-3">Nueva regla de automatizacion</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newRule.name}
                  onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Nombre de la regla"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                />
                <select
                  value={newRule.event}
                  onChange={e => setNewRule({ ...newRule, event: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {EVENT_TYPES.map(et => (
                    <option key={et.value} value={et.value}>{et.label}</option>
                  ))}
                </select>
                <textarea
                  value={newRule.description}
                  onChange={e => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Descripcion (opcional)"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 resize-none"
                  rows={2}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowNewRule(false)} className="px-3 py-1.5 bg-neutral-800 text-neutral-400 rounded-lg text-sm">Cancelar</button>
                  <button onClick={createRule} className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-sm">Crear</button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                <button
                  onClick={() => toggleRule(rule)}
                  className={`w-10 h-5 rounded-full transition shrink-0 ${rule.is_active ? "bg-green-600" : "bg-neutral-700"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${rule.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{rule.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {EVENT_TYPES.find(e => e.value === rule.event)?.label || rule.event}
                    {rule.description && ` · ${rule.description}`}
                  </p>
                  <p className="text-[10px] text-neutral-600 mt-0.5">Ejecutada {rule.execution_count} veces</p>
                </div>
                <button onClick={() => deleteRule(rule.id)} className="text-neutral-600 hover:text-red-400 transition text-sm">🗑</button>
              </div>
            ))}
            {rules.length === 0 && (
              <div className="text-center py-10">
                <p className="text-neutral-600">No hay reglas de automatizacion</p>
                <p className="text-xs text-neutral-700 mt-1">Crea reglas para automatizar respuestas, asignaciones y mas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {tab === "agents" && (
        <div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            <h4 className="text-white font-medium mb-3">Nuevo agente</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={newAgentName}
                onChange={e => setNewAgentName(e.target.value)}
                placeholder="Nombre"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500"
              />
              <input
                type="email"
                value={newAgentEmail}
                onChange={e => setNewAgentEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500"
              />
              <button onClick={createAgent} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition shrink-0">
                Agregar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {agents.map(a => (
              <div key={a.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-lg shrink-0">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{a.name}</p>
                  <p className="text-xs text-neutral-500">{a.email} · {a.role}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${a.is_online ? "bg-green-900/50 text-green-400" : "bg-neutral-800 text-neutral-500"}`}>
                  {a.is_online ? "En linea" : "Desconectado"}
                </span>
                <button onClick={() => deleteAgent(a.id)} className="text-neutral-600 hover:text-red-400 transition text-sm">🗑</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canned Responses Tab */}
      {tab === "canned" && (
        <div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            <h4 className="text-white font-medium mb-3">Nueva respuesta rapida</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-32">
                  <label className="text-[10px] text-neutral-500">Codigo (sin /)</label>
                  <input
                    type="text"
                    value={newCannedCode}
                    onChange={e => setNewCannedCode(e.target.value.replace(/\s/g, ""))}
                    placeholder="saludo"
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-neutral-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-neutral-500">Contenido</label>
                  <textarea
                    value={newCannedContent}
                    onChange={e => setNewCannedContent(e.target.value)}
                    placeholder="Hola {nombre}! Gracias por comunicarte..."
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 resize-none"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-neutral-600">Variables: {"{nombre}"} {"{telefono}"} {"{ciudad}"} {"{pais}"}</p>
                <button onClick={createCanned} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition">
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {canned.map(cr => (
              <div key={cr.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                <span className="text-green-400 text-sm font-mono shrink-0">/{cr.short_code}</span>
                <p className="text-sm text-neutral-300 flex-1 truncate">{cr.content}</p>
                <button onClick={() => deleteCanned(cr.id)} className="text-neutral-600 hover:text-red-400 transition text-sm">🗑</button>
              </div>
            ))}
            {canned.length === 0 && (
              <div className="text-center py-10">
                <p className="text-neutral-600">No hay respuestas rapidas</p>
                <p className="text-xs text-neutral-700 mt-1">Crea respuestas rapidas para usar con / en el chat</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {tab === "integrations" && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-neutral-400">Conecta canales externos para recibir mensajes en tu inbox unificado</p>
          </div>

          <div className="space-y-3">
            {integrations.map(intg => {
              const meta = INTEGRATION_META[intg.id];
              if (!meta) return null;
              const isEditing = editingIntegration === intg.id;

              return (
                <div key={intg.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  {/* Card header */}
                  <div className="p-5 flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: meta.color + "20", borderColor: meta.color + "40", borderWidth: 1 }}
                    >
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium text-sm">{intg.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          intg.connected
                            ? "bg-green-900/50 text-green-400 border border-green-800/50"
                            : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                        }`}>
                          {intg.connected ? "Conectado" : "No conectado"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{meta.description}</p>
                    </div>
                    <button
                      onClick={() => openIntegrationConfig(intg)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition shrink-0 ${
                        isEditing
                          ? "bg-neutral-700 text-neutral-300"
                          : intg.connected
                            ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                            : "bg-green-700 hover:bg-green-600 text-white"
                      }`}
                    >
                      {isEditing ? "Cerrar" : intg.connected ? "Configurar" : "Conectar"}
                    </button>
                  </div>

                  {/* Expandable config panel */}
                  {isEditing && (
                    <div className="border-t border-neutral-800 bg-neutral-950/50 p-5">
                      <div className="space-y-4">
                        {meta.fields.map(field => (
                          <div key={field.key}>
                            <label className="text-xs text-neutral-400 font-medium">{field.label}</label>
                            {field.type === "color" ? (
                              <div className="flex gap-2 mt-1.5 items-center">
                                <input
                                  type="color"
                                  value={integrationConfig[field.key] || "#22C55E"}
                                  onChange={e => setIntegrationConfig({ ...integrationConfig, [field.key]: e.target.value })}
                                  className="w-10 h-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={integrationConfig[field.key] || "#22C55E"}
                                  onChange={e => setIntegrationConfig({ ...integrationConfig, [field.key]: e.target.value })}
                                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                                />
                              </div>
                            ) : (
                              <input
                                type={field.type || "text"}
                                value={integrationConfig[field.key] || ""}
                                onChange={e => setIntegrationConfig({ ...integrationConfig, [field.key]: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full mt-1.5 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-neutral-600"
                              />
                            )}
                          </div>
                        ))}

                        {/* Webchat snippet */}
                        {intg.id === "webchat" && intg.connected && (
                          <div>
                            <label className="text-xs text-neutral-400 font-medium">Codigo para tu sitio web</label>
                            <div className="mt-1.5 bg-neutral-800 border border-neutral-700 rounded-lg p-3 font-mono text-xs text-green-400 select-all">
                              {`<script src="/widget/chat.js" data-widget-id="${intg.id}"></script>`}
                            </div>
                            <p className="text-[10px] text-neutral-600 mt-1">Copia y pega este codigo antes de {"</body>"} en tu sitio</p>
                          </div>
                        )}

                        <div className="flex gap-2 justify-between pt-2">
                          {intg.connected && (
                            <button
                              onClick={() => disconnectIntegration(intg.id)}
                              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 rounded-lg text-sm transition"
                            >
                              Desconectar
                            </button>
                          )}
                          <div className="flex gap-2 ml-auto">
                            <button
                              onClick={() => setEditingIntegration(null)}
                              className="px-4 py-2 bg-neutral-800 text-neutral-400 rounded-lg text-sm hover:bg-neutral-700 transition"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => saveIntegration(intg.id)}
                              disabled={savingIntegration}
                              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm transition disabled:opacity-50"
                            >
                              {savingIntegration ? "Guardando..." : "Guardar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {integrations.length === 0 && (
              <div className="text-center py-10">
                <p className="text-neutral-600">Cargando integraciones...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
