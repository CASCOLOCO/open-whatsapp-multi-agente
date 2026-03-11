"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Themes ───
const THEMES = {
  dark: {
    name: "Oscuro",
    icon: "🌙",
    bg: "bg-neutral-950",
    sidebar: "bg-neutral-900",
    sidebarBorder: "border-neutral-800",
    chatBg: "bg-neutral-950",
    inputBg: "bg-neutral-800",
    inputBorder: "border-neutral-700",
    headerBg: "bg-neutral-900",
    bubbleOut: "bg-green-900/60",
    bubbleIn: "bg-neutral-800",
    bubbleNote: "bg-amber-900/40 border border-amber-700/40",
    text: "text-white",
    textMuted: "text-neutral-400",
    textMuted2: "text-neutral-500",
    hover: "hover:bg-neutral-800",
    selected: "bg-neutral-800",
    accent: "text-green-500",
    accentBg: "bg-green-600",
    contactActive: "bg-neutral-800/80",
    scrollTrack: "[&::-webkit-scrollbar-track]:bg-neutral-900",
    scrollThumb: "[&::-webkit-scrollbar-thumb]:bg-neutral-700",
  },
  light: {
    name: "Claro",
    icon: "☀️",
    bg: "bg-gray-100",
    sidebar: "bg-white",
    sidebarBorder: "border-gray-200",
    chatBg: "bg-[#efeae2]",
    inputBg: "bg-white",
    inputBorder: "border-gray-300",
    headerBg: "bg-white",
    bubbleOut: "bg-[#d9fdd3]",
    bubbleIn: "bg-white",
    bubbleNote: "bg-amber-50 border border-amber-200",
    text: "text-gray-900",
    textMuted: "text-gray-600",
    textMuted2: "text-gray-400",
    hover: "hover:bg-gray-100",
    selected: "bg-green-50",
    accent: "text-green-600",
    accentBg: "bg-green-600",
    contactActive: "bg-green-50",
    scrollTrack: "[&::-webkit-scrollbar-track]:bg-gray-100",
    scrollThumb: "[&::-webkit-scrollbar-thumb]:bg-gray-300",
  },
  whatsapp: {
    name: "WhatsApp",
    icon: "💬",
    bg: "bg-[#111b21]",
    sidebar: "bg-[#111b21]",
    sidebarBorder: "border-[#2a3942]",
    chatBg: "bg-[#0b141a]",
    inputBg: "bg-[#2a3942]",
    inputBorder: "border-[#2a3942]",
    headerBg: "bg-[#202c33]",
    bubbleOut: "bg-[#005c4b]",
    bubbleIn: "bg-[#202c33]",
    bubbleNote: "bg-amber-900/30 border border-amber-700/30",
    text: "text-[#e9edef]",
    textMuted: "text-[#8696a0]",
    textMuted2: "text-[#667781]",
    hover: "hover:bg-[#2a3942]",
    selected: "bg-[#2a3942]",
    accent: "text-[#00a884]",
    accentBg: "bg-[#00a884]",
    contactActive: "bg-[#2a3942]",
    scrollTrack: "[&::-webkit-scrollbar-track]:bg-[#111b21]",
    scrollThumb: "[&::-webkit-scrollbar-thumb]:bg-[#374045]",
  },
  midnight: {
    name: "Medianoche",
    icon: "🌌",
    bg: "bg-[#0a0e1a]",
    sidebar: "bg-[#0f1525]",
    sidebarBorder: "border-[#1a2540]",
    chatBg: "bg-[#070b14]",
    inputBg: "bg-[#151d30]",
    inputBorder: "border-[#1a2540]",
    headerBg: "bg-[#0f1525]",
    bubbleOut: "bg-indigo-900/50",
    bubbleIn: "bg-[#151d30]",
    bubbleNote: "bg-amber-900/30 border border-amber-700/30",
    text: "text-blue-100",
    textMuted: "text-blue-300/60",
    textMuted2: "text-blue-400/40",
    hover: "hover:bg-[#151d30]",
    selected: "bg-[#1a2540]",
    accent: "text-indigo-400",
    accentBg: "bg-indigo-600",
    contactActive: "bg-indigo-900/30",
    scrollTrack: "[&::-webkit-scrollbar-track]:bg-[#0a0e1a]",
    scrollThumb: "[&::-webkit-scrollbar-thumb]:bg-[#1a2540]",
  },
  forest: {
    name: "Bosque",
    icon: "🌿",
    bg: "bg-[#0a1a0f]",
    sidebar: "bg-[#0f2016]",
    sidebarBorder: "border-[#1a3525]",
    chatBg: "bg-[#070f0a]",
    inputBg: "bg-[#152a1c]",
    inputBorder: "border-[#1a3525]",
    headerBg: "bg-[#0f2016]",
    bubbleOut: "bg-emerald-900/50",
    bubbleIn: "bg-[#152a1c]",
    bubbleNote: "bg-amber-900/30 border border-amber-700/30",
    text: "text-emerald-100",
    textMuted: "text-emerald-300/60",
    textMuted2: "text-emerald-400/40",
    hover: "hover:bg-[#152a1c]",
    selected: "bg-[#1a3525]",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-600",
    contactActive: "bg-emerald-900/30",
    scrollTrack: "[&::-webkit-scrollbar-track]:bg-[#0a1a0f]",
    scrollThumb: "[&::-webkit-scrollbar-thumb]:bg-[#1a3525]",
  },
} as const;

type ThemeKey = keyof typeof THEMES;

// ─── Types ───
interface Contact {
  id: number;
  session_id: string;
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  pais: string;
  dispositivo: string;
  fecha_creacion: string;
  fecha_ultimo_mensaje: string;
  total_messages: number;
  ultimo_mensaje: string;
  ultimo_es_bot: boolean;
  ultimo_mensaje_cliente: string | null;
  contact_type: number;
  conversation_status: number;
  assigned_agent_id: number | null;
  agent_name: string | null;
  labels?: Label[];
}

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface StatusCounts {
  all: number;
  open: number;
  pending: number;
  resolved: number;
  snoozed: number;
}

interface Message {
  id: number;
  mensaje_id: string;
  session_id: string;
  mensaje: string;
  is_bot: boolean;
  nombre_agente: string;
  tipo_archivo: string;
  ruta_archivo: string;
  nota_interna: boolean;
  mensaje_eliminado: boolean;
  fecha_creacion: string;
  status: number;
  private: boolean;
}

interface MediaItem {
  url: string;
  type: string;
  name: string;
}

interface CannedResponse {
  id: number;
  short_code: string;
  content: string;
  media?: MediaItem[];
}

interface Label {
  id: number;
  title: string;
  color: string;
}

// ─── Helpers ───
function formatDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Ayer";
  if (days < 7) return date.toLocaleDateString("es-CO", { weekday: "short" });
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" });
}

function formatFullDate(d: string) {
  return new Date(d).toLocaleString("es-CO", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function isWithin24Hours(messages: Message[]): boolean {
  const inbound = messages.filter((m) => !m.is_bot && !m.private);
  if (inbound.length === 0) return false;
  const last = inbound[inbound.length - 1];
  const hours = (Date.now() - new Date(last.fecha_creacion).getTime()) / 3600000;
  return hours < 24;
}

function getStatusIcon(status: number, isBot: boolean) {
  if (!isBot) return null;
  switch (status) {
    case 0: return <span className="text-neutral-500 text-[10px]">●</span>; // pending
    case 1: return <span className="text-neutral-400 text-[10px]">✓</span>; // sent
    case 2: return <span className="text-neutral-400 text-[10px]">✓✓</span>; // delivered
    case 3: return <span className="text-blue-400 text-[10px]">✓✓</span>; // read
    case 4: return <span className="text-red-500 text-[10px]">✕</span>; // failed
    default: return null;
  }
}

function interpolateVars(text: string, contact: Contact | null) {
  if (!contact) return text;
  return text
    .replace(/\{nombre\}/g, contact.nombre || "cliente")
    .replace(/\{telefono\}/g, contact.session_id || "")
    .replace(/\{ciudad\}/g, contact.ciudad || "")
    .replace(/\{pais\}/g, contact.pais || "");
}

// ─── Agent Colors ───
const AGENT_COLORS: Record<string, { bg: string; text: string }> = {};
const DEFAULT_AGENT_COLORS = [
  { bg: "bg-purple-900/30", text: "text-purple-400" },
  { bg: "bg-teal-900/30", text: "text-teal-400" },
  { bg: "bg-pink-900/30", text: "text-pink-400" },
  { bg: "bg-cyan-900/30", text: "text-cyan-400" },
  { bg: "bg-lime-900/30", text: "text-lime-400" },
  { bg: "bg-amber-900/30", text: "text-amber-400" },
];
function getAgentColor(name: string) {
  if (AGENT_COLORS[name]) return AGENT_COLORS[name];
  // Deterministic color for unknown agents based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return DEFAULT_AGENT_COLORS[Math.abs(hash) % DEFAULT_AGENT_COLORS.length];
}

// ─── Main Component ───
export default function WhatsAppPage() {
  // State - Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterLabel, setFilterLabel] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterAgent, setFilterAgent] = useState<string>("unassigned");
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ all: 0, open: 0, pending: 0, resolved: 0, snoozed: 0 });
  const [agents, setAgents] = useState<Agent[]>([]);

  // State - Mobile view
  const [mobileView, setMobileView] = useState<"contacts" | "chat" | "info">("contacts");

  // State - Messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgPage, setMsgPage] = useState(1);
  const [msgTotalPages, setMsgTotalPages] = useState(1);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // State - Send
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [canSendRegular, setCanSendRegular] = useState(false);

  // State - UI
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showCanned, setShowCanned] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
  const [cannedFilter, setCannedFilter] = useState("");
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [contactLabels, setContactLabels] = useState<Label[]>([]);
  const [msgSearch, setMsgSearch] = useState("");
  const [showMsgSearch, setShowMsgSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [linkPreview, setLinkPreview] = useState<{ url: string; title: string; description: string; image: string; domain: string; favicon: string } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const linkPreviewTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [msgPreviews, setMsgPreviews] = useState<Record<string, { url: string; title: string; description: string; image: string; domain: string; favicon: string } | null>>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState<{ id: number | string; name: string; template_id: string; components: any; category?: string; language?: string; status?: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [showThemePanel, setShowThemePanel] = useState(false);

  // State - Multi-select
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [lastClickedIdx, setLastClickedIdx] = useState<number>(-1);

  // State - Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; contact: Contact } | null>(null);

  // State - Bulk send
  const [showBulkSend, setShowBulkSend] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [bulkMode, setBulkMode] = useState<"text" | "template">("text");
  const [bulkResults, setBulkResults] = useState<{ session_id: string; nombre: string; ok: boolean; error?: string }[]>([]);

  // State - Date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [datePresetLabel, setDatePresetLabel] = useState("");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [pickingStart, setPickingStart] = useState(true);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout>(undefined);
  const contactPollRef = useRef<NodeJS.Timeout>(undefined);
  const prevMsgCountRef = useRef<number>(0);
  const prevLastMsgIdRef = useRef<string>("");
  const isInitialLoadRef = useRef<boolean>(true);
  const shouldScrollToBottomRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  // ─── Fetch functions ───
  const fetchContacts = useCallback(async (p: number, s: string, status?: string, labelId?: number | null, dFrom?: string, dTo?: string, agId?: string) => {
    setLoading(true);
    try {
      let url = `/api/plazbot?page=${p}&limit=50&search=${encodeURIComponent(s)}`;
      if (status !== undefined && status !== "") url += `&status=${status}`;
      if (labelId) url += `&labelId=${labelId}`;
      if (dFrom) url += `&dateFrom=${dFrom}`;
      if (dTo) url += `&dateTo=${dTo}`;
      if (agId) url += `&agentId=${agId}`;
      const res = await fetch(url);
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotalPages(data.totalPages || 1);
      setTotalContacts(data.total || 0);
      if (data.statusCounts) setStatusCounts(data.statusCounts);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  // Notification sound using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.25);
    } catch {}
  }, []);

  const fetchMessages = useCallback(async (sessionId: string, p: number, isPolling = false) => {
    if (!isPolling) setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/plazbot/messages?sessionId=${sessionId}&page=${p}&limit=200`);
      const data = await res.json();
      const newMessages: Message[] = data.messages || [];
      const newLastId = newMessages.length > 0 ? newMessages[newMessages.length - 1].mensaje_id : "";
      const newCount = newMessages.length;
      if (newLastId !== prevLastMsgIdRef.current || newCount !== prevMsgCountRef.current) {
        // Detect if a new inbound message arrived (for notification sound)
        if (isPolling && prevLastMsgIdRef.current && newLastId !== prevLastMsgIdRef.current) {
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && !lastMsg.is_bot && soundEnabled) {
            playNotificationSound();
          }
        }
        setMessages(newMessages);
        prevLastMsgIdRef.current = newLastId;
        prevMsgCountRef.current = newCount;
      }
      setMsgTotalPages(data.totalPages || 1);
    } catch (e) { console.error(e); }
    if (!isPolling) setLoadingMsgs(false);
  }, [soundEnabled, playNotificationSound]);

  const fetchLabels = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/labels");
      setLabels(await res.json());
    } catch {}
  }, []);

  const fetchContactLabels = useCallback(async (contactId: number) => {
    try {
      const res = await fetch("/api/plazbot/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", contactId }),
      });
      // If get doesn't work, labels come back empty
    } catch {}
  }, []);

  const fetchCanned = useCallback(async (filter: string) => {
    try {
      const res = await fetch(`/api/plazbot/canned?search=${encodeURIComponent(filter)}`);
      setCannedResponses(await res.json());
    } catch {}
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/agents");
      setAgents(await res.json());
    } catch {}
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/plazbot/templates");
      if (res.ok) setTemplates(await res.json());
    } catch {}
  }, []);

  const sendTemplate = async (tmpl: any) => {
    if (!selectedContact) return;
    setSending(true);
    setSendError("");
    try {
      const components: any[] = [];
      const header = tmpl.components?.find((c: any) => c.type === "HEADER");

      // IMAGE/VIDEO headers always require media to be sent
      if (header && (header.format === "IMAGE" || header.format === "VIDEO")) {
        // Use permanently hosted image on our server, fallback to Meta's CDN handle
        const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";
        const localImage = `/uploads/templates/${tmpl.name}-header.${header.format === "IMAGE" ? "png" : "mp4"}`;
        const handleUrl = header.example?.header_handle?.[0];
        const mediaLink = `${BASE}${localImage}`;

        components.push({
          type: "header",
          parameters: [{
            type: header.format.toLowerCase(),
            [header.format.toLowerCase()]: { link: mediaLink },
          }],
        });
      }

      // Check body for dynamic variables like {{1}}, {{2}}
      const body = tmpl.components?.find((c: any) => c.type === "BODY");
      const bodyVarCount = (body?.text?.match(/\{\{\d+\}\}/g) || []).length;
      if (bodyVarCount > 0 && body?.example?.body_text?.[0]) {
        const params = body.example.body_text[0].map((p: string) => {
          if (selectedContact.nombre && p.toLowerCase().includes("name")) return selectedContact.nombre;
          return p;
        });
        components.push({
          type: "body",
          parameters: params.map((p: string) => ({ type: "text", text: p })),
        });
      }

      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedContact.session_id,
          template: tmpl.name,
          templateLang: tmpl.language || "es",
          templateComponents: components.length > 0 ? components : undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setSendError(d.error || "Error al enviar template"); return; }
      setShowTemplateModal(false);
      shouldScrollToBottomRef.current = true;
      await fetchMessages(selectedContact.session_id, msgPage, true);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setSendError(e.message || "Error de conexion");
    } finally {
      setSending(false);
    }
  };

  // ─── Status / Agent handlers ───
  const updateContactStatus = async (status: number) => {
    if (!selectedContact) return;
    try {
      const res = await fetch("/api/plazbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContact.id, conversation_status: status }),
      });
      const updated = await res.json();
      setSelectedContact({ ...selectedContact, conversation_status: status });
      fetchContacts(page, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
    } catch {}
  };

  const assignAgent = async (agentId: number | null) => {
    if (!selectedContact) return;
    try {
      await fetch("/api/plazbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContact.id, assigned_agent_id: agentId }),
      });
      const agentName = agentId ? agents.find(a => a.id === agentId)?.name || null : null;
      setSelectedContact({ ...selectedContact, assigned_agent_id: agentId, agent_name: agentName });
      fetchContacts(page, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
    } catch {}
  };

  // ─── Keyboard Shortcuts ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // Alt+N = new note mode
      if (e.altKey && e.key === "n") { e.preventDefault(); setIsNoteMode(true); msgInputRef.current?.focus(); }
      // Alt+M = message mode
      if (e.altKey && e.key === "m") { e.preventDefault(); setIsNoteMode(false); msgInputRef.current?.focus(); }
      // Alt+R = resolve conversation
      if (e.altKey && e.key === "r" && selectedContact) { e.preventDefault(); updateContactStatus(selectedContact.conversation_status === 2 ? 0 : 2); }
      // Alt+I = toggle contact info
      if (e.altKey && e.key === "i") { e.preventDefault(); setShowContactInfo(p => !p); }
      // Alt+F = search in messages
      if (e.altKey && e.key === "f") { e.preventDefault(); setShowMsgSearch(p => !p); }
      // Escape = close menus/panels
      if (e.key === "Escape") {
        if (contextMenu) { setContextMenu(null); }
        else if (showDatePicker) { setShowDatePicker(false); }
        else if (showBulkSend) { if (!bulkSending) setShowBulkSend(false); }
        else if (showMsgSearch) { setShowMsgSearch(false); setMsgSearch(""); }
        else if (showContactInfo) { setShowContactInfo(false); }
        else if (showCanned) { setShowCanned(false); }
        else if (selectedContacts.size > 0) { clearMultiSelect(); }
      }
      // Arrow Up/Down to navigate contacts (only when not in input)
      if (!isInput && contacts.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const idx = selectedContact ? contacts.findIndex(c => c.session_id === selectedContact.session_id) : -1;
          const next = idx < contacts.length - 1 ? idx + 1 : 0;
          selectContact(contacts[next]);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const idx = selectedContact ? contacts.findIndex(c => c.session_id === selectedContact.session_id) : 0;
          const prev = idx > 0 ? idx - 1 : contacts.length - 1;
          selectContact(contacts[prev]);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedContact, contacts, showMsgSearch, showContactInfo, showCanned]);

  // ─── Effects ───
  // Load theme from localStorage + listen for sidebar "Temas" button
  useEffect(() => {
    const saved = localStorage.getItem("wa-theme") as ThemeKey | null;
    if (saved && THEMES[saved]) setTheme(saved);
    const openThemes = () => setShowThemePanel(true);
    window.addEventListener("openThemes", openThemes);
    return () => window.removeEventListener("openThemes", openThemes);
  }, []);

  const changeTheme = (t: ThemeKey) => {
    setTheme(t);
    localStorage.setItem("wa-theme", t);
  };

  const t = THEMES[theme];

  useEffect(() => { fetchContacts(1, "", "", null, dateFrom, dateTo, "unassigned"); fetchLabels(); fetchAgents(); fetchTemplates(); }, [fetchContacts, fetchLabels, fetchAgents, fetchTemplates]); // eslint-disable-line

  // Contact list polling - refresh every 15 seconds to show new messages in list
  useEffect(() => {
    const pollContacts = () => {
      fetchContacts(page, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
    };
    contactPollRef.current = setInterval(pollContacts, 15000);
    return () => { if (contactPollRef.current) clearInterval(contactPollRef.current); };
  }, [page, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent, fetchContacts]);

  // Fetch link previews for messages containing URLs
  useEffect(() => {
    if (messages.length === 0) return;
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const toFetch: { id: string; url: string }[] = [];
    for (const msg of messages) {
      if (!msg.mensaje) continue;
      const match = msg.mensaje.match(urlRegex);
      if (match && !msgPreviews[msg.mensaje_id] && msgPreviews[msg.mensaje_id] !== null) {
        toFetch.push({ id: msg.mensaje_id, url: match[1] });
      }
    }
    if (toFetch.length === 0) return;
    // Fetch max 5 at a time to avoid overload
    toFetch.slice(0, 5).forEach(async ({ id, url }) => {
      setMsgPreviews(prev => ({ ...prev, [id]: null })); // mark as loading
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.title || data.description) {
            setMsgPreviews(prev => ({ ...prev, [id]: data }));
            return;
          }
        }
      } catch {}
      setMsgPreviews(prev => ({ ...prev, [id]: null }));
    });
  }, [messages]); // eslint-disable-line

  useEffect(() => {
    setCanSendRegular(isWithin24Hours(messages));
  }, [messages]);

  // Polling - pause when tab hidden (inspired by WhatsApp Cloud Inbox)
  useEffect(() => {
    if (!selectedContact) return;
    let interval: NodeJS.Timeout;

    const startPolling = () => {
      interval = setInterval(() => {
        fetchMessages(selectedContact.session_id, msgPage, true);
      }, 5000);
      pollIntervalRef.current = interval;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        startPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [selectedContact, msgPage, fetchMessages]);

  useEffect(() => {
    if (!chatEndRef.current || messages.length === 0) return;
    if (isInitialLoadRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "instant" });
      isInitialLoadRef.current = false;
    } else if (shouldScrollToBottomRef.current) {
      // Explicit scroll request (after sending message)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottomRef.current = false;
    } else {
      // New message arrived via polling - smooth scroll only if already near bottom
      const chatContainer = chatEndRef.current.parentElement;
      if (chatContainer) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        if (isNearBottom) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages]);

  // ─── Handlers ───
  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchContacts(1, value, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
    }, 400);
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setPage(1);
    fetchContacts(1, search, status, filterLabel, dateFrom, dateTo, filterAgent);
  };

  // ─── Multi-select handlers ───
  const toggleSelectContact = (sessionId: string, idx: number, e?: React.MouseEvent) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (e?.shiftKey && lastClickedIdx >= 0) {
        const start = Math.min(lastClickedIdx, idx);
        const end = Math.max(lastClickedIdx, idx);
        for (let i = start; i <= end; i++) {
          next.add(contacts[i].session_id);
        }
      } else if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
    setLastClickedIdx(idx);
  };

  const clearMultiSelect = () => {
    setSelectedContacts(new Set());
    setLastClickedIdx(-1);
  };

  const selectAllVisible = () => {
    setSelectedContacts(new Set(contacts.map(c => c.session_id)));
  };

  // ─── Bulk send ───
  const startBulkSend = async () => {
    if (!bulkMessage.trim() || bulkSending) return;
    const recipients = contacts.filter(c => selectedContacts.has(c.session_id));
    if (recipients.length === 0) return;

    setBulkSending(true);
    setBulkProgress({ sent: 0, failed: 0, total: recipients.length });
    setBulkResults([]);

    for (let i = 0; i < recipients.length; i++) {
      const c = recipients[i];
      try {
        const body: any = { to: c.session_id };
        if (bulkMode === "template") {
          body.template = bulkMessage.trim();
        } else {
          body.message = bulkMessage.trim();
        }
        const res = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await res.json();
        if (res.ok) {
          setBulkProgress(p => ({ ...p, sent: p.sent + 1 }));
          setBulkResults(prev => [...prev, { session_id: c.session_id, nombre: c.nombre, ok: true }]);
        } else {
          setBulkProgress(p => ({ ...p, failed: p.failed + 1 }));
          setBulkResults(prev => [...prev, { session_id: c.session_id, nombre: c.nombre, ok: false, error: d.error }]);
        }
      } catch (err: any) {
        setBulkProgress(p => ({ ...p, failed: p.failed + 1 }));
        setBulkResults(prev => [...prev, { session_id: c.session_id, nombre: c.nombre, ok: false, error: err.message }]);
      }
      // Rate limiting delay
      if (i < recipients.length - 1) await new Promise(r => setTimeout(r, 500));
    }
    setBulkSending(false);
  };

  // ─── Date picker helpers ───
  const applyDatePreset = (preset: string) => {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    let from = "", to = "";

    switch (preset) {
      case "today":
        from = to = fmt(today);
        setDatePresetLabel("Hoy");
        break;
      case "yesterday": {
        const y = new Date(today); y.setDate(y.getDate() - 1);
        from = to = fmt(y);
        setDatePresetLabel("Ayer");
        break;
      }
      case "last7": {
        const d = new Date(today); d.setDate(d.getDate() - 6);
        from = fmt(d); to = fmt(today);
        setDatePresetLabel("Últimos 7 días");
        break;
      }
      case "last30": {
        const d = new Date(today); d.setDate(d.getDate() - 29);
        from = fmt(d); to = fmt(today);
        setDatePresetLabel("Últimos 30 días");
        break;
      }
      case "thisMonth":
        from = fmt(new Date(today.getFullYear(), today.getMonth(), 1));
        to = fmt(today);
        setDatePresetLabel("Este mes");
        break;
      case "lastMonth": {
        const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const last = new Date(today.getFullYear(), today.getMonth(), 0);
        from = fmt(first); to = fmt(last);
        setDatePresetLabel("Mes pasado");
        break;
      }
    }
    setDateFrom(from);
    setDateTo(to);
    setPickingStart(true);
  };

  const applyDateFilter = () => {
    setShowDatePicker(false);
    setPage(1);
    fetchContacts(1, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setDatePresetLabel("");
    setShowDatePicker(false);
    setPage(1);
    fetchContacts(1, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent);
  };

  const handleCalendarDayClick = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    const fmt = (dt: Date) => dt.toISOString().split("T")[0];
    if (pickingStart) {
      setDateFrom(fmt(d));
      setDateTo(fmt(d));
      setPickingStart(false);
      setDatePresetLabel("Personalizado");
    } else {
      const fromDate = new Date(dateFrom);
      if (d < fromDate) {
        setDateFrom(fmt(d));
        setDateTo(fmt(fromDate));
      } else {
        setDateTo(fmt(d));
      }
      setPickingStart(true);
      setDatePresetLabel("Personalizado");
    }
  };

  const getCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const days: (number | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isDayInRange = (day: number) => {
    if (!dateFrom || !dateTo || !day) return false;
    const d = new Date(calYear, calMonth, day).toISOString().split("T")[0];
    return d >= dateFrom && d <= dateTo;
  };

  const isDayStart = (day: number) => {
    if (!dateFrom || !day) return false;
    return new Date(calYear, calMonth, day).toISOString().split("T")[0] === dateFrom;
  };

  const isDayEnd = (day: number) => {
    if (!dateTo || !day) return false;
    return new Date(calYear, calMonth, day).toISOString().split("T")[0] === dateTo;
  };

  const selectContact = (contact: Contact, e?: React.MouseEvent) => {
    // Ctrl/Cmd+click = multi-select
    if (e && (e.ctrlKey || e.metaKey)) {
      const idx = contacts.findIndex(c => c.session_id === contact.session_id);
      toggleSelectContact(contact.session_id, idx, e);
      return;
    }
    // Shift+click = range select
    if (e && e.shiftKey && selectedContacts.size > 0) {
      const idx = contacts.findIndex(c => c.session_id === contact.session_id);
      toggleSelectContact(contact.session_id, idx, e);
      return;
    }
    // Normal click = single select
    setSelectedContact(contact);
    setMsgPage(1);
    setShowContactInfo(false);
    setNewMessage("");
    setSendError("");
    setIsNoteMode(false);
    setShowCanned(false);
    setMobileView("chat");
    isInitialLoadRef.current = true;
    prevLastMsgIdRef.current = "";
    prevMsgCountRef.current = 0;
    fetchMessages(contact.session_id, 1);
    setTimeout(() => msgInputRef.current?.focus(), 200);
  };

  const sendMessage = async () => {
    if (!selectedContact || sending) return;
    if (!newMessage.trim() && pendingMedia.length === 0) return;
    setSending(true);
    setSendError("");

    try {
      if (isNoteMode) {
        // Send private note
        const res = await fetch("/api/plazbot/note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: selectedContact.session_id, note: newMessage.trim() }),
        });
        if (!res.ok) {
          const d = await res.json();
          setSendError(d.error || "Error al guardar nota");
          return;
        }
      } else {
        // Send WhatsApp message (only if there's text)
        if (newMessage.trim()) {
          const res = await fetch("/api/whatsapp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: selectedContact.session_id, message: newMessage.trim() }),
          });
          const d = await res.json();
          if (!res.ok) {
            setSendError(d.error || "Error al enviar");
            return;
          }
          // Preserve link preview for the sent message bubble
          if (d.messageId && linkPreview) {
            setMsgPreviews(prev => ({ ...prev, [d.messageId]: linkPreview }));
          }
        }
      }
      // Send pending media items (from canned responses) sequentially
      if (pendingMedia.length > 0 && !isNoteMode) {
        for (const media of pendingMedia) {
          await new Promise(r => setTimeout(r, 300));
          try {
            await fetch("/api/whatsapp/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ to: selectedContact.session_id, mediaUrl: media.url, mediaType: media.type }),
            });
          } catch {}
        }
      }
      setNewMessage("");
      setPendingMedia([]);
      setLinkPreview(null);
      setIsNoteMode(false);
      shouldScrollToBottomRef.current = true;
      await fetchMessages(selectedContact.session_id, msgPage, true);
      // Force scroll to bottom after sending
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      msgInputRef.current?.focus();
    } catch (e: any) {
      setSendError(e.message || "Error de conexion");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    // Detect /shortcode for canned responses
    if (value.startsWith("/") && value.length > 1) {
      const code = value.slice(1);
      setShowCanned(true);
      setCannedFilter(code);
      fetchCanned(code);
    } else {
      setShowCanned(false);
    }
    // Detect URLs for link preview
    if (linkPreviewTimeoutRef.current) clearTimeout(linkPreviewTimeoutRef.current);
    const urlMatch = value.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch && urlMatch[1] !== linkPreview?.url) {
      linkPreviewTimeoutRef.current = setTimeout(async () => {
        setLoadingPreview(true);
        try {
          const res = await fetch(`/api/link-preview?url=${encodeURIComponent(urlMatch[1])}`);
          if (res.ok) {
            const data = await res.json();
            if (data.title || data.description) setLinkPreview(data);
          }
        } catch {}
        setLoadingPreview(false);
      }, 600);
    } else if (!urlMatch) {
      setLinkPreview(null);
    }
  };

  const applyCanned = (cr: CannedResponse) => {
    const interpolated = interpolateVars(cr.content, selectedContact);
    setNewMessage(interpolated);
    setPendingMedia(cr.media || []);
    setShowCanned(false);
    msgInputRef.current?.focus();
  };

  const toggleLabel = async (labelId: number) => {
    if (!selectedContact) return;
    const hasLabel = contactLabels.some((l) => l.id === labelId);
    try {
      const res = await fetch("/api/plazbot/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: hasLabel ? "remove" : "add",
          contactId: selectedContact.id,
          labelId,
        }),
      });
      setContactLabels(await res.json());
    } catch {}
  };

  // Group messages by date
  const filteredMessages = msgSearch
    ? messages.filter((m) => m.mensaje?.toLowerCase().includes(msgSearch.toLowerCase()))
    : messages;

  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  let currentDate = "";
  filteredMessages.forEach((msg) => {
    const d = new Date(msg.fecha_creacion).toLocaleDateString("es-CO", {
      day: "2-digit", month: "long", year: "numeric",
    });
    if (d !== currentDate) {
      currentDate = d;
      groupedMessages.push({ date: d, msgs: [] });
    }
    groupedMessages[groupedMessages.length - 1].msgs.push(msg);
  });

  // ─── Render ───
  return (
    <div className={`h-screen md:h-[calc(100vh-48px)] flex md:-m-6 ${t.bg} ${t.text} transition-colors duration-300`}>
      {/* ─── Theme Picker Panel ─── */}
      {showThemePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowThemePanel(false)}>
          <div className={`${t.sidebar} border ${t.sidebarBorder} rounded-2xl p-6 w-full max-w-96 mx-4 shadow-2xl`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${t.text}`}>🎨 Temas</h3>
              <button onClick={() => setShowThemePanel(false)} className={`${t.textMuted} hover:${t.text} text-xl`}>✕</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, th]) => (
                <button
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                    theme === key
                      ? `${th.selected} border-green-500 ring-1 ring-green-500/50`
                      : `${th.sidebar} ${th.sidebarBorder} hover:border-green-500/30`
                  }`}
                >
                  <span className="text-2xl">{th.icon}</span>
                  <div className="flex-1 text-left">
                    <span className={`font-medium ${th.text}`}>{th.name}</span>
                  </div>
                  {/* Color preview dots */}
                  <div className="flex gap-1">
                    <span className={`w-4 h-4 rounded-full ${th.bubbleOut}`} />
                    <span className={`w-4 h-4 rounded-full ${th.bubbleIn}`} />
                    <span className={`w-4 h-4 rounded-full ${th.accentBg}`} />
                  </div>
                  {theme === key && <span className="text-green-500 text-lg">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── LEFT: Contact List ─── */}
      <div className={`${mobileView === "contacts" ? "flex" : "hidden"} md:flex w-full md:w-72 ${t.sidebar} border-r ${t.sidebarBorder} flex-col shrink-0 transition-colors duration-300`}>
        <div className={`p-3 border-b ${t.sidebarBorder}`}>
          <h2 className={`text-lg font-bold ${t.text} flex items-center gap-2`}>
            <img src="/logo-sm.png" alt="CRM" className="w-8 h-8 rounded-full object-cover ml-5 md:ml-0" /> WhatsApp CRM
            <span className={`text-xs ${t.textMuted2} font-normal ml-auto flex items-center gap-2`}>
              {totalContacts.toLocaleString()} chats
              <Link href="/panel/whatsapp/campaigns" className={`${t.textMuted2} hover:${t.text} transition`} title="Campanas">📢</Link>
              <Link href="/panel/whatsapp/analytics" className={`${t.textMuted2} hover:${t.text} transition`} title="Analytics">📊</Link>
              <button onClick={() => setShowThemePanel(true)} className={`${t.textMuted2} hover:${t.text} transition`} title="Temas">🎨</button>
              <Link href="/panel/whatsapp/settings" className={`${t.textMuted2} hover:${t.text} transition`} title="Configuracion">⚙</Link>
            </span>
          </h2>
          <div className="mt-2 flex gap-1.5">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar contacto..."
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-2 text-sm ${t.text} placeholder:${t.textMuted2} outline-none focus:border-green-600 transition-colors`}
              />
              {search && (
                <button onClick={() => { setSearch(""); fetchContacts(1, "", filterStatus, filterLabel, dateFrom, dateTo, filterAgent); setPage(1); }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${t.textMuted2} hover:${t.text} text-xs`}>✕</button>
              )}
            </div>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-2.5 py-2 rounded-lg text-sm transition shrink-0 ${
                dateFrom ? `${t.accentBg} text-white` : `${t.inputBg} border ${t.inputBorder} ${t.textMuted2} hover:${t.text}`
              }`}
              title="Filtrar por fecha"
            >📅</button>
            <select
              value={filterAgent}
              onChange={(e) => { setFilterAgent(e.target.value); setPage(1); fetchContacts(1, search, filterStatus, filterLabel, dateFrom, dateTo, e.target.value); }}
              className={`px-2 py-2 rounded-lg text-xs transition shrink-0 max-w-[100px] ${
                filterAgent ? `${t.accentBg} text-white` : `${t.inputBg} border ${t.inputBorder} ${t.textMuted2}`
              } outline-none`}
              title="Filtrar por agente"
            >
              <option value="">👤 Agente</option>
              <option value="unassigned">Sin asignar</option>
              {agents.map(a => (
                <option key={a.id} value={String(a.id)}>{a.name}</option>
              ))}
            </select>
          </div>
          {/* Active filter chips */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {dateFrom && (
              <div className={`flex items-center gap-1 text-[10px] ${t.accent}`}>
                <span>📅 {datePresetLabel || "Personalizado"}: {dateFrom === dateTo ? dateFrom : `${dateFrom} — ${dateTo}`}</span>
                <button onClick={clearDateFilter} className="hover:text-red-400 ml-1">✕</button>
              </div>
            )}
            {filterAgent && (
              <div className={`flex items-center gap-1 text-[10px] ${t.accent}`}>
                <span>👤 {filterAgent === "unassigned" ? "Sin asignar" : agents.find(a => a.id === parseInt(filterAgent))?.name || filterAgent}</span>
                <button onClick={() => { setFilterAgent(""); setPage(1); fetchContacts(1, search, filterStatus, filterLabel, dateFrom, dateTo, ""); }} className="hover:text-red-400 ml-1">✕</button>
              </div>
            )}
          </div>
          {/* Status tabs */}
          <div className={`flex gap-0.5 mt-2 ${t.inputBg} rounded-lg p-0.5`}>
            {([
              { key: "", label: "Todos", count: statusCounts.all },
              { key: "0", label: "Abiertos", count: statusCounts.open },
              { key: "1", label: "Pendientes", count: statusCounts.pending },
              { key: "2", label: "Resueltos", count: statusCounts.resolved },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusFilter(tab.key)}
                className={`flex-1 text-[10px] py-1.5 rounded-md transition font-medium ${
                  filterStatus === tab.key
                    ? `${t.selected} ${t.text} shadow-sm`
                    : `${t.textMuted2} hover:${t.textMuted}`
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 text-[9px] ${filterStatus === tab.key ? t.accent : t.textMuted2}`}>
                    {tab.count > 999 ? Math.floor(tab.count/1000) + "k" : tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Label filter chips (hidden on mobile) */}
          <div className="hidden md:flex flex-wrap gap-1 mt-2">
            {labels.slice(0, 6).map((l) => (
              <button
                key={l.id}
                onClick={() => { setFilterLabel(filterLabel === l.id ? null : l.id); setPage(1); fetchContacts(1, search, filterStatus, filterLabel === l.id ? null : l.id, dateFrom, dateTo, filterAgent); }}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                  filterLabel === l.id
                    ? `border-white/30 ${t.text}`
                    : `${t.sidebarBorder} ${t.textMuted2} hover:${t.textMuted}`
                }`}
                style={filterLabel === l.id ? { backgroundColor: l.color + "30", borderColor: l.color } : {}}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: l.color }} />
                {l.title}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-select action bar */}
        {selectedContacts.size > 0 && (
          <div className={`p-2 border-b ${t.sidebarBorder} ${t.accentBg}/10 flex items-center gap-2`}>
            <span className={`text-xs ${t.accent} font-medium flex-1`}>
              ☑ {selectedContacts.size} seleccionado{selectedContacts.size > 1 ? "s" : ""}
            </span>
            <button onClick={() => { setShowBulkSend(true); setBulkResults([]); setBulkProgress({ sent: 0, failed: 0, total: 0 }); }}
              className="text-[10px] px-2 py-1 bg-green-700 text-white rounded hover:bg-green-600 transition">📢 Masivo</button>
            <button onClick={selectAllVisible}
              className={`text-[10px] px-2 py-1 ${t.inputBg} ${t.textMuted} rounded hover:${t.text} transition`}>☑ Todos</button>
            <button onClick={clearMultiSelect}
              className={`text-[10px] px-1.5 py-1 ${t.textMuted2} hover:text-red-400 transition`}>✕</button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${t.scrollTrack} ${t.scrollThumb} [&::-webkit-scrollbar]:w-1.5`}>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent" />
            </div>
          ) : contacts.length === 0 ? (
            <p className={`${t.textMuted2} text-sm text-center py-10`}>No hay contactos</p>
          ) : (
            contacts.map((c, idx) => {
              const isMultiSelected = selectedContacts.has(c.session_id);
              return (
                <button
                  key={c.session_id}
                  onClick={(e) => selectContact(c, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, contact: c });
                  }}
                  className={`w-full text-left px-3 py-3 border-b ${t.sidebarBorder}/50 ${t.hover} transition ${
                    selectedContact?.session_id === c.session_id ? `${t.contactActive} border-l-2 border-l-green-500` : ""
                  } ${isMultiSelected ? `${t.contactActive} ring-1 ring-green-500/40` : ""}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Checkbox for multi-select */}
                    {selectedContacts.size > 0 && (
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleSelectContact(c.session_id, idx); }}
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition ${
                          isMultiSelected
                            ? `${t.accentBg} border-green-500 text-white`
                            : `${t.inputBorder} ${t.inputBg}`
                        }`}
                      >
                        {isMultiSelected && <span className="text-[10px]">✓</span>}
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-full ${t.inputBg} flex items-center justify-center text-lg shrink-0`}>
                      {c.nombre ? c.nombre.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className={`text-sm font-medium ${t.text} truncate`}>{c.nombre || c.session_id}</p>
                        <span className={`text-[10px] ${t.textMuted2} shrink-0 ml-2`}>{formatDate(c.fecha_ultimo_mensaje)}</span>
                      </div>
                      <p className={`text-xs ${t.textMuted2} truncate mt-0.5`}>{c.ultimo_mensaje || "Sin mensajes"}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] ${t.textMuted2} hidden md:inline`}>{c.session_id}</span>
                        {c.total_messages > 0 && (
                          <span className={`text-[10px] ${t.inputBg} ${t.textMuted} px-1.5 rounded`}>{c.total_messages}</span>
                        )}
                        {c.conversation_status === 0 && (() => {
                          const lastClientMsg = c.ultimo_mensaje_cliente ? new Date(c.ultimo_mensaje_cliente) : null;
                          const expired = lastClientMsg ? (Date.now() - lastClientMsg.getTime()) > 24 * 60 * 60 * 1000 : true;
                          return expired
                            ? <span className="text-[9px] text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded">⏳ Ventana 24H</span>
                            : <span className="text-[9px] text-green-500">● abierto</span>;
                        })()}
                        {c.conversation_status === 1 && <span className="text-[9px] text-yellow-500">● pendiente</span>}
                        {c.conversation_status === 2 && <span className={`text-[9px] ${t.textMuted2}`}>✓ resuelto</span>}
                        {c.agent_name && (
                          <span className={`text-[9px] ${getAgentColor(c.agent_name).bg} ${getAgentColor(c.agent_name).text} px-1.5 py-0.5 rounded ml-auto`}>{c.agent_name.split(" ")[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className={`p-2 border-t ${t.sidebarBorder} flex items-center justify-between`}>
            <button onClick={() => { setPage(page - 1); fetchContacts(page - 1, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent); }} disabled={page <= 1}
              className={`px-2 py-1 text-xs ${t.inputBg} rounded ${t.textMuted} hover:${t.text} disabled:opacity-30`}>◀</button>
            <span className={`text-xs ${t.textMuted2}`}>{page}/{totalPages}</span>
            <button onClick={() => { setPage(page + 1); fetchContacts(page + 1, search, filterStatus, filterLabel, dateFrom, dateTo, filterAgent); }} disabled={page >= totalPages}
              className={`px-2 py-1 text-xs ${t.inputBg} rounded ${t.textMuted} hover:${t.text} disabled:opacity-30`}>▶</button>
          </div>
        )}
      </div>

      {/* ─── RIGHT: Chat Area ─── */}
      <div className={`${mobileView === "chat" || mobileView === "info" ? "flex" : "hidden"} md:flex flex-1 flex-col ${t.chatBg} transition-colors duration-300 w-full`}>
        {!selectedContact ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">💬</div>
              <p className={`${t.textMuted2} text-lg`}>Selecciona un chat</p>
              <p className={`${t.textMuted2} text-sm mt-2`}>{totalContacts.toLocaleString()} conversaciones</p>
              <div className={`mt-6 text-left inline-block ${t.sidebar} border ${t.sidebarBorder} rounded-xl p-4`}>
                <p className={`${t.textMuted2} text-xs font-medium mb-3`}>Atajos de teclado</p>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    ["↑ ↓", "Navegar contactos"],
                    ["Alt+R", "Resolver / Reabrir"],
                    ["Alt+N", "Modo nota interna"],
                    ["Alt+M", "Modo mensaje"],
                    ["Alt+I", "Info del contacto"],
                    ["Alt+F", "Buscar en mensajes"],
                    ["/", "Respuestas rapidas"],
                    ["Esc", "Cerrar paneles"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center gap-3">
                      <kbd className={`${t.inputBg} ${t.textMuted} px-1.5 py-0.5 rounded text-[10px] font-mono min-w-[50px] text-center`}>{key}</kbd>
                      <span className={t.textMuted2}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className={`px-2 md:px-4 py-3 ${t.headerBg} border-b ${t.sidebarBorder} flex items-center gap-2 md:gap-3 transition-colors duration-300`}>
              {/* Back button (mobile only) */}
              <button
                className={`md:hidden p-1.5 rounded-lg ${t.textMuted} active:bg-white/10`}
                onClick={() => { setMobileView("contacts"); setSelectedContact(null); }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              </button>
              <div className={`w-10 h-10 rounded-full ${t.inputBg} flex items-center justify-center text-lg shrink-0`}>
                {selectedContact.nombre ? selectedContact.nombre.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`${t.text} font-medium truncate`}>{selectedContact.nombre || "Sin nombre"}</h3>
                <p className={`text-xs ${t.textMuted2}`}>{selectedContact.session_id}{selectedContact.ciudad ? ` · ${selectedContact.ciudad}` : ""}</p>
              </div>
              <div className="flex gap-1 md:gap-2 shrink-0 items-center">
                {/* Status actions */}
                {selectedContact.conversation_status !== 2 ? (
                  <button
                    onClick={() => updateContactStatus(2)}
                    className="px-2 md:px-3 py-1.5 rounded-lg text-xs bg-green-700/80 text-white hover:bg-green-600 transition flex items-center gap-1"
                  ><span className="hidden md:inline">✓ </span>Resolver</button>
                ) : (
                  <button
                    onClick={() => updateContactStatus(0)}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs ${t.inputBg} text-yellow-400 ${t.hover} transition flex items-center gap-1`}
                  >↻<span className="hidden md:inline"> Reabrir</span></button>
                )}

                {/* Pending button - desktop only */}
                {selectedContact.conversation_status === 0 && (
                  <button
                    onClick={() => updateContactStatus(1)}
                    className={`hidden md:block px-2.5 py-1.5 rounded-lg text-xs ${t.inputBg} text-yellow-400 ${t.hover} transition`}
                    title="Marcar como pendiente"
                  >⏳</button>
                )}

                {/* Agent assignment - desktop only */}
                <select
                  value={selectedContact.assigned_agent_id || ""}
                  onChange={(e) => assignAgent(e.target.value ? Number(e.target.value) : null)}
                  className={`hidden md:block ${t.inputBg} border ${t.inputBorder} text-xs ${t.textMuted} rounded-lg px-2 py-1.5 outline-none focus:border-green-600 max-w-[120px]`}
                >
                  <option value="">Sin asignar</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>

                <div className={`hidden md:block w-px h-5 ${t.inputBorder}`} />

                <button
                  onClick={() => setShowMsgSearch(!showMsgSearch)}
                  className={`hidden md:block px-2.5 py-1.5 rounded-lg text-xs transition ${showMsgSearch ? `${t.accentBg} text-white` : `${t.inputBg} ${t.textMuted} hover:${t.text}`}`}
                >🔍</button>
                <a href={`https://wa.me/${selectedContact.session_id}`} target="_blank" rel="noopener"
                  className="hidden md:block px-2.5 py-1.5 rounded-lg text-xs bg-green-700 text-white hover:bg-green-600 transition">WA</a>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-2 md:px-2.5 py-1.5 rounded-lg text-xs transition ${soundEnabled ? `${t.inputBg} ${t.textMuted} hover:${t.text}` : `bg-red-900/50 text-red-400`}`}
                  title={soundEnabled ? "Silenciar notificaciones" : "Activar sonido"}
                >{soundEnabled ? "🔔" : "🔕"}</button>
                <button
                  onClick={() => {
                    if (bgMusicRef.current) {
                      if (bgMusicPlaying) { bgMusicRef.current.pause(); setBgMusicPlaying(false); }
                      else { bgMusicRef.current.play().then(() => setBgMusicPlaying(true)).catch(() => {}); }
                    }
                  }}
                  className={`px-2 md:px-2.5 py-1.5 rounded-lg text-xs transition ${bgMusicPlaying ? `${t.inputBg} ${t.textMuted} hover:${t.text}` : `bg-red-900/50 text-red-400`}`}
                  title={bgMusicPlaying ? "Pausar música" : "Reproducir música"}
                >{bgMusicPlaying ? "🎵" : "🎵"}</button>
                <button
                  onClick={() => { setShowContactInfo(!showContactInfo); if (!showContactInfo) setMobileView("info"); else setMobileView("chat"); }}
                  className={`px-2 md:px-2.5 py-1.5 rounded-lg text-xs transition ${showContactInfo ? `${t.accentBg} text-white` : `${t.inputBg} ${t.textMuted} hover:${t.text}`}`}
                >ℹ</button>
              </div>
            </div>

            {/* Msg search bar */}
            {showMsgSearch && (
              <div className={`px-4 py-2 ${t.headerBg}/50 border-b ${t.sidebarBorder}`}>
                <input
                  type="text"
                  value={msgSearch}
                  onChange={(e) => setMsgSearch(e.target.value)}
                  placeholder="Buscar en mensajes..."
                  className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg px-3 py-1.5 text-sm ${t.text} placeholder:${t.textMuted2} outline-none focus:border-green-600`}
                  autoFocus
                />
                {msgSearch && <p className={`text-[10px] ${t.textMuted2} mt-1`}>{filteredMessages.length} resultados</p>}
              </div>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className={`flex-1 overflow-y-auto px-4 py-4 ${t.scrollTrack} ${t.scrollThumb} [&::-webkit-scrollbar]:w-1.5`} style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.02) 0%, transparent 50%)" }}>
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
                    </div>
                  ) : (
                    <>
                      {msgTotalPages > 1 && (
                        <div className="flex justify-center mb-4 gap-2">
                          <button onClick={() => { setMsgPage(msgPage - 1); fetchMessages(selectedContact.session_id, msgPage - 1); }} disabled={msgPage <= 1}
                            className={`px-3 py-1 text-xs ${t.inputBg} rounded ${t.textMuted} hover:${t.text} disabled:opacity-30`}>◀ Anterior</button>
                          <span className={`text-xs ${t.textMuted2} py-1`}>{msgPage}/{msgTotalPages}</span>
                          <button onClick={() => { setMsgPage(msgPage + 1); fetchMessages(selectedContact.session_id, msgPage + 1); }} disabled={msgPage >= msgTotalPages}
                            className={`px-3 py-1 text-xs ${t.inputBg} rounded ${t.textMuted} hover:${t.text} disabled:opacity-30`}>Siguiente ▶</button>
                        </div>
                      )}

                      {groupedMessages.map((group) => (
                        <div key={group.date}>
                          <div className="flex justify-center my-4">
                            <span className={`${t.inputBg} ${t.textMuted} text-[11px] px-3 py-1 rounded-full`}>{group.date}</span>
                          </div>
                          {group.msgs.map((msg) => (
                            <div key={msg.id} className={`flex mb-2 ${msg.is_bot ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] rounded-xl px-3 py-2 shadow-sm ${
                                msg.private
                                  ? t.bubbleNote
                                  : msg.is_bot
                                    ? t.bubbleOut
                                    : t.bubbleIn
                              } ${msg.mensaje_eliminado ? "opacity-40 line-through" : ""}`}>
                                {msg.private && <p className="text-[10px] text-yellow-500 font-medium mb-1">📌 Nota interna</p>}
                                {msg.is_bot && msg.nombre_agente && !msg.private && (
                                  <p className={`text-[10px] ${getAgentColor(msg.nombre_agente).text} font-medium mb-1`}>{msg.nombre_agente}</p>
                                )}
                                {msg.tipo_archivo && msg.ruta_archivo && (() => {
                                  // Resolve media URL: if it's a numeric Meta media ID, use proxy; otherwise use direct URL
                                  const isMediaId = /^\d+$/.test(msg.ruta_archivo);
                                  const mediaUrl = isMediaId ? `/api/whatsapp/media?id=${msg.ruta_archivo}` : msg.ruta_archivo;
                                  const isImage = msg.tipo_archivo === "image" || msg.tipo_archivo === "image/jpeg" || msg.tipo_archivo === "image/png" || msg.ruta_archivo.match(/\.(jpg|jpeg|png|gif|webp)/i);
                                  const isAudio = msg.tipo_archivo === "audio" || msg.ruta_archivo.match(/\.(ogg|mp3|wav|opus)/i);
                                  const isVideo = msg.tipo_archivo === "video" || msg.ruta_archivo.match(/\.(mp4|webm)/i);
                                  const isSticker = msg.tipo_archivo === "sticker";
                                  return (
                                    <div className="mb-1">
                                      {(isImage || isSticker) ? (
                                        <img src={mediaUrl} alt="" className={`max-w-full rounded-lg ${isSticker ? "max-h-32" : "max-h-60"}`} loading="lazy" />
                                      ) : isAudio ? (
                                        <audio controls src={mediaUrl} className="max-w-full" />
                                      ) : isVideo ? (
                                        <video controls src={mediaUrl} className="max-w-full rounded-lg max-h-60" />
                                      ) : (
                                        <a href={mediaUrl} target="_blank" rel="noopener" className={`${t.accent} text-xs underline`}>📎 {msg.tipo_archivo || "Archivo"}</a>
                                      )}
                                    </div>
                                  );
                                })()}
                                {(() => {
                                  // Render [Template: xxx] as a rich card
                                  const templateMatch = msg.mensaje?.match(/^\[Template:\s*(.+?)\]$/);
                                  if (templateMatch) {
                                    const tmplName = templateMatch[1];
                                    const tmpl = templates.find((tt: any) => tt.name === tmplName);
                                    if (tmpl) {
                                      const hdr = tmpl.components?.find((c: any) => c.type === "HEADER");
                                      const bod = tmpl.components?.find((c: any) => c.type === "BODY");
                                      const btns = tmpl.components?.find((c: any) => c.type === "BUTTONS");
                                      const ftr = tmpl.components?.find((c: any) => c.type === "FOOTER");
                                      return (
                                        <div className={`rounded-lg overflow-hidden border ${t.inputBorder} ${t.inputBg}`}>
                                          {hdr?.format === "IMAGE" && hdr.example?.header_handle?.[0] && (
                                            <img src={hdr.example.header_handle[0]} alt="" className="w-full max-h-40 object-cover" loading="lazy" />
                                          )}
                                          {hdr?.format === "TEXT" && <p className={`px-3 pt-2 text-sm font-bold ${t.text}`}>{hdr.text}</p>}
                                          <div className="px-3 py-2">
                                            {bod?.text && <p className={`text-sm ${t.text} whitespace-pre-wrap`}>{bod.text}</p>}
                                            {ftr?.text && <p className={`text-[10px] ${t.textMuted2} mt-1`}>{ftr.text}</p>}
                                          </div>
                                          {btns?.buttons && btns.buttons.length > 0 && (
                                            <div className={`border-t ${t.inputBorder}`}>
                                              {btns.buttons.map((btn: any, bi: number) => (
                                                <div key={bi} className={`text-center py-2 text-xs ${t.accent} ${bi > 0 ? `border-t ${t.inputBorder}` : ""}`}>
                                                  {btn.type === "URL" ? (
                                                    <a href={btn.url} target="_blank" rel="noopener" className="flex items-center justify-center gap-1">🔗 {btn.text}</a>
                                                  ) : (
                                                    <span>{btn.text}</span>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    // Fallback if template not found in cache
                                    return <p className={`text-sm ${t.text} italic`}>📋 Template: {tmplName}</p>;
                                  }
                                  // Parse [Imagen: /path] or [Video: /path] in message text
                                  const mediaMatch = msg.mensaje?.match(/^\[(Imagen|Video|Doc):\s*(.+?)\]$/);
                                  if (mediaMatch && !msg.tipo_archivo) {
                                    const mType = mediaMatch[1];
                                    const mUrl = mediaMatch[2];
                                    if (mType === "Imagen") return <img src={mUrl} alt="" className="max-w-full rounded-lg max-h-60 mb-1" loading="lazy" />;
                                    if (mType === "Video") return <video controls src={mUrl} className="max-w-full rounded-lg max-h-60 mb-1" />;
                                    return <a href={mUrl} target="_blank" rel="noopener" className={`${t.accent} text-xs underline`}>📎 Archivo</a>;
                                  }
                                  // Don't show redundant [Imagen] text if we already rendered the media above
                                  const cleanMsg = msg.tipo_archivo && msg.ruta_archivo ? msg.mensaje?.replace(/^\[(Imagen|Video|Audio|Doc|Sticker)(:\s*.+?)?\]$/, "").trim() : msg.mensaje;
                                  if (!cleanMsg) return null;
                                  // Render URLs as clickable links
                                  const urlSplitRegex = /(https?:\/\/[^\s]+)/gi;
                                  const parts = cleanMsg.split(urlSplitRegex);
                                  return (
                                    <p className={`text-sm ${t.text} whitespace-pre-wrap break-words`}>
                                      {parts.map((part: string, i: number) =>
                                        /^https?:\/\//i.test(part)
                                          ? <a key={i} href={part} target="_blank" rel="noopener" className={`${t.accent} underline break-all`}>{part}</a>
                                          : part
                                      )}
                                    </p>
                                  );
                                })()}
                                {/* Link preview in bubble */}
                                {msgPreviews[msg.mensaje_id] && msgPreviews[msg.mensaje_id]!.title && (
                                  <a href={msgPreviews[msg.mensaje_id]!.url} target="_blank" rel="noopener" className={`block mt-1.5 rounded-lg overflow-hidden border ${t.inputBorder} ${t.inputBg} hover:opacity-80 transition`}>
                                    {msgPreviews[msg.mensaje_id]!.image && (
                                      <img src={msgPreviews[msg.mensaje_id]!.image} alt="" className="w-full max-h-32 object-cover" loading="lazy" />
                                    )}
                                    <div className="px-2.5 py-2">
                                      <p className={`text-[11px] font-medium ${t.text} line-clamp-1`}>{msgPreviews[msg.mensaje_id]!.title}</p>
                                      <p className={`text-[10px] ${t.textMuted2} line-clamp-2 mt-0.5`}>{msgPreviews[msg.mensaje_id]!.description}</p>
                                      <p className={`text-[9px] ${t.textMuted2} mt-1 flex items-center gap-1`}>
                                        {msgPreviews[msg.mensaje_id]!.favicon && <img src={msgPreviews[msg.mensaje_id]!.favicon} alt="" className="w-3 h-3" />}
                                        {msgPreviews[msg.mensaje_id]!.domain}
                                      </p>
                                    </div>
                                  </a>
                                )}
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                  <span className={`text-[10px] ${t.textMuted2}`}>
                                    {new Date(msg.fecha_creacion).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {getStatusIcon(msg.status, msg.is_bot)}
                                </div>
                                {msg.is_bot && msg.status === 4 && (
                                  <p className="text-[10px] text-red-400 mt-0.5">No entregado</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {filteredMessages.length === 0 && !loadingMsgs && (
                        <div className="text-center py-10">
                          <p className={t.textMuted2}>{msgSearch ? "Sin resultados" : "No hay mensajes"}</p>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* ─── Input Area ─── */}
                <div className={`px-4 py-3 ${t.headerBg} border-t ${t.sidebarBorder} relative transition-colors duration-300`}>
                  {/* Canned responses dropdown */}
                  {showCanned && cannedResponses.length > 0 && (
                    <div className={`absolute bottom-full left-4 right-4 mb-1 ${t.inputBg} border ${t.inputBorder} rounded-xl shadow-xl max-h-48 overflow-y-auto`}>
                      {cannedResponses.map((cr) => (
                        <button key={cr.id} onClick={() => applyCanned(cr)}
                          className={`w-full text-left px-3 py-2 ${t.hover} border-b ${t.inputBorder}/50 last:border-0 transition`}>
                          <div className="flex items-center gap-2">
                            <span className={`${t.accent} text-xs font-mono`}>/{cr.short_code}</span>
                            {cr.media && cr.media.length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-900/40 text-blue-400 rounded-full">
                                {cr.media.filter(m => m.type === "image").length > 0 && `${cr.media.filter(m => m.type === "image").length} img`}
                                {cr.media.filter(m => m.type === "image").length > 0 && cr.media.filter(m => m.type === "video").length > 0 && " + "}
                                {cr.media.filter(m => m.type === "video").length > 0 && `${cr.media.filter(m => m.type === "video").length} vid`}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${t.textMuted} mt-0.5 truncate`}>{cr.content}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Link preview */}
                  {(linkPreview || loadingPreview) && (
                    <div className={`mb-2 ${t.inputBg} border ${t.inputBorder} rounded-lg overflow-hidden`}>
                      {loadingPreview && !linkPreview ? (
                        <div className="flex items-center gap-2 p-2.5">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
                          <span className={`text-xs ${t.textMuted2}`}>Cargando preview...</span>
                        </div>
                      ) : linkPreview && (
                        <div className="flex">
                          {linkPreview.image && (
                            <img src={linkPreview.image} alt="" className="w-20 h-20 object-cover shrink-0" />
                          )}
                          <div className="flex-1 p-2.5 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0">
                                <p className={`text-xs font-medium ${t.text} truncate`}>{linkPreview.title}</p>
                                <p className={`text-[10px] ${t.textMuted2} line-clamp-2 mt-0.5`}>{linkPreview.description}</p>
                                <p className={`text-[10px] ${t.accent} mt-1 flex items-center gap-1`}>
                                  {linkPreview.favicon && <img src={linkPreview.favicon} alt="" className="w-3 h-3" />}
                                  {linkPreview.domain}
                                </p>
                              </div>
                              <button onClick={() => setLinkPreview(null)} className={`text-xs ${t.textMuted2} hover:text-red-400 shrink-0`}>✕</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending media preview */}
                  {pendingMedia.length > 0 && (
                    <div className={`mb-2 p-2 ${t.inputBg} border ${t.inputBorder} rounded-lg`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] ${t.textMuted2}`}>Archivos adjuntos ({pendingMedia.length})</span>
                        <button onClick={() => setPendingMedia([])} className="text-[10px] text-red-400 hover:text-red-300">Quitar todos</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {pendingMedia.map((m, idx) => (
                          <div key={idx} className="relative group">
                            {m.type === "image" ? (
                              <img src={m.url} alt={m.name} className="w-14 h-14 object-cover rounded border border-neutral-600" />
                            ) : (
                              <div className="w-14 h-14 bg-neutral-700 rounded border border-neutral-600 flex flex-col items-center justify-center">
                                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                            )}
                            <button
                              onClick={() => setPendingMedia(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >x</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sendError && (
                    <div className="mb-2 px-3 py-2 bg-red-900/30 border border-red-800/50 rounded-lg text-xs text-red-400 flex items-center justify-between">
                      <span>{sendError}</span>
                      <button onClick={() => setSendError("")} className="text-red-500 hover:text-red-300 ml-2">✕</button>
                    </div>
                  )}

                  {/* 24h warning (inspired by WhatsApp Cloud Inbox) */}
                  {!canSendRegular && !isNoteMode && messages.length > 0 && (
                    <div className="mb-2 px-3 py-2 bg-amber-900/30 border border-amber-700/40 rounded-lg">
                      <p className="text-xs text-amber-400">
                        ⚠ Ventana de 24h expirada. Solo puedes enviar mensajes tipo Template o notas internas.
                      </p>
                      <div className="flex gap-2 mt-1.5">
                        <button onClick={() => setIsNoteMode(true)}
                          className="text-[10px] px-2 py-1 bg-yellow-800/50 text-yellow-300 rounded hover:bg-yellow-800/70">
                          📌 Escribir nota
                        </button>
                        <button onClick={() => { fetchTemplates(); setShowTemplateModal(true); }}
                          className="text-[10px] px-2 py-1 bg-green-800/50 text-green-300 rounded hover:bg-green-800/70">
                          📋 Enviar Template
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mode toggle */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setIsNoteMode(false)}
                      className={`text-[10px] px-2.5 py-1 rounded-full transition ${!isNoteMode ? "bg-green-700 text-white" : `${t.inputBg} ${t.textMuted2} hover:${t.text}`}`}
                    >💬 Mensaje</button>
                    <button
                      onClick={() => setIsNoteMode(true)}
                      className={`text-[10px] px-2.5 py-1 rounded-full transition ${isNoteMode ? "bg-yellow-700 text-white" : `${t.inputBg} ${t.textMuted2} hover:${t.text}`}`}
                    >📌 Nota interna</button>
                    <span className={`text-[10px] ${t.textMuted2} ml-auto`}>
                      Escribe / para respuestas rapidas
                    </span>
                  </div>

                  <div className="flex items-end gap-2">
                    {/* Hidden file inputs */}
                    <input
                      type="file"
                      id="chat-photo-input"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const formData = new FormData();
                        Array.from(files).forEach(f => formData.append("files", f));
                        try {
                          const res = await fetch("/api/plazbot/canned/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (data.files && data.files.length > 0) {
                            setPendingMedia(prev => [...prev, ...data.files.map((f: any) => ({ url: f.url, type: f.type, name: f.name }))]);
                          }
                        } catch (err) { console.error("Upload error:", err); }
                        e.target.value = "";
                      }}
                    />
                    <input
                      type="file"
                      id="chat-doc-input"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const formData = new FormData();
                        Array.from(files).forEach(f => formData.append("files", f));
                        try {
                          const res = await fetch("/api/plazbot/canned/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (data.files && data.files.length > 0) {
                            setPendingMedia(prev => [...prev, ...data.files.map((f: any) => ({ url: f.url, type: f.type || "document", name: f.name }))]);
                          }
                        } catch (err) { console.error("Upload error:", err); }
                        e.target.value = "";
                      }}
                    />
                    {/* Attach menu button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        disabled={!canSendRegular && !isNoteMode && messages.length > 0}
                        className={`px-2.5 py-2.5 rounded-xl text-lg transition shrink-0 disabled:opacity-40 ${t.inputBg} border ${t.inputBorder} ${t.textMuted} hover:${t.text}`}
                        title="Adjuntar"
                      >📎</button>
                      {showAttachMenu && (
                        <div className={`absolute bottom-full left-0 mb-2 ${t.sidebar} border ${t.sidebarBorder} rounded-xl shadow-2xl overflow-hidden z-50 min-w-[160px]`}>
                          <button
                            onClick={() => { document.getElementById("chat-photo-input")?.click(); setShowAttachMenu(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm ${t.text} hover:${t.inputBg} transition text-left`}
                          >
                            <span className="text-lg">🖼️</span> Foto / Video
                          </button>
                          <button
                            onClick={() => { document.getElementById("chat-doc-input")?.click(); setShowAttachMenu(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm ${t.text} hover:${t.inputBg} transition text-left border-t ${t.sidebarBorder}`}
                          >
                            <span className="text-lg">📄</span> Documento
                          </button>
                        </div>
                      )}
                    </div>
                    <textarea
                      ref={msgInputRef}
                      value={newMessage}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isNoteMode ? "Escribe una nota interna..." : "Escribe un mensaje..."}
                      rows={1}
                      disabled={!canSendRegular && !isNoteMode && messages.length > 0}
                      className={`flex-1 border rounded-xl px-4 py-2.5 text-sm ${t.text} placeholder:${t.textMuted2} outline-none resize-none max-h-32 disabled:opacity-40 ${
                        isNoteMode
                          ? "bg-yellow-900/20 border-yellow-700/40 focus:border-yellow-600"
                          : `${t.inputBg} ${t.inputBorder} focus:border-green-600`
                      }`}
                      style={{ height: "auto", minHeight: "40px", overflow: "hidden" }}
                      onInput={(e) => {
                        const el = e.target as HTMLTextAreaElement;
                        el.style.height = "auto";
                        el.style.height = Math.min(el.scrollHeight, 128) + "px";
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={(!newMessage.trim() && pendingMedia.length === 0) || sending || (!canSendRegular && !isNoteMode && messages.length > 0)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition shrink-0 disabled:opacity-40 ${
                        isNoteMode ? "bg-yellow-600 hover:bg-yellow-500 text-white" : `${t.accentBg} hover:opacity-90 text-white`
                      }`}
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : isNoteMode ? "📌" : "➤"}
                    </button>
                  </div>
                  <p className={`text-[10px] ${t.textMuted2} mt-1 hidden md:block`}>Enter enviar · Shift+Enter nueva linea · Alt+N nota · Alt+R resolver</p>
                </div>
              </div>

              {/* ─── Contact Info Sidebar ─── */}
              {showContactInfo && (
                <div className={`absolute inset-0 z-40 md:relative md:inset-auto md:z-auto w-full md:w-72 ${t.sidebar} border-l ${t.sidebarBorder} overflow-y-auto p-4 shrink-0 transition-colors duration-300 ${t.scrollTrack} ${t.scrollThumb} [&::-webkit-scrollbar]:w-1.5`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`${t.text} font-medium`}>Contacto</h4>
                    <button onClick={() => { setShowContactInfo(false); setMobileView("chat"); }} className={`${t.textMuted2} hover:${t.text} text-xs`}>✕</button>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${t.inputBg} flex items-center justify-center text-2xl mb-2`}>
                      {selectedContact.nombre ? selectedContact.nombre.charAt(0).toUpperCase() : "?"}
                    </div>
                    <p className={`${t.text} font-medium`}>{selectedContact.nombre || "Sin nombre"}</p>
                    <p className={`text-xs ${t.textMuted2}`}>{selectedContact.session_id}</p>
                  </div>

                  {/* Labels */}
                  <div className="mb-4">
                    <p className={`text-[10px] ${t.textMuted2} uppercase mb-2`}>Etiquetas</p>
                    <div className="flex flex-wrap gap-1">
                      {labels.map((l) => {
                        const has = contactLabels.some((cl) => cl.id === l.id);
                        return (
                          <button
                            key={l.id}
                            onClick={() => toggleLabel(l.id)}
                            className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                              has ? t.text : `${t.textMuted2} ${t.sidebarBorder} hover:${t.textMuted}`
                            }`}
                            style={has ? { backgroundColor: l.color + "30", borderColor: l.color, color: l.color } : {}}
                          >
                            {l.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status & Agent */}
                  <div className={`mb-4 p-3 ${t.inputBg}/50 rounded-lg space-y-2`}>
                    <div>
                      <p className={`text-[10px] ${t.textMuted2} uppercase`}>Estado</p>
                      <div className="flex gap-1 mt-1">
                        {[
                          { s: 0, label: "Abierto", color: "green" },
                          { s: 1, label: "Pendiente", color: "yellow" },
                          { s: 2, label: "Resuelto", color: "neutral" },
                        ].map(({ s, label, color }) => (
                          <button
                            key={s}
                            onClick={() => updateContactStatus(s)}
                            className={`text-[10px] px-2 py-1 rounded-md transition ${
                              selectedContact.conversation_status === s
                                ? `bg-${color}-700/50 text-${color}-300 border border-${color}-600/50`
                                : `${t.inputBg} ${t.textMuted2} hover:${t.textMuted}`
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`text-[10px] ${t.textMuted2} uppercase`}>Agente</p>
                      <select
                        value={selectedContact.assigned_agent_id || ""}
                        onChange={(e) => assignAgent(e.target.value ? Number(e.target.value) : null)}
                        className={`w-full mt-1 ${t.inputBg} border ${t.inputBorder} text-xs ${t.textMuted} rounded-lg px-2 py-1.5 outline-none focus:border-green-600`}
                      >
                        <option value="">Sin asignar</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Info fields */}
                  <div className="space-y-3">
                    {[
                      ["Email", selectedContact.email],
                      ["Ciudad", selectedContact.ciudad],
                      ["Pais", selectedContact.pais],
                      ["Dispositivo", selectedContact.dispositivo],
                      ["Primer contacto", selectedContact.fecha_creacion ? formatFullDate(selectedContact.fecha_creacion) : null],
                      ["Ultimo mensaje", selectedContact.fecha_ultimo_mensaje ? formatFullDate(selectedContact.fecha_ultimo_mensaje) : null],
                      ["Total mensajes", selectedContact.total_messages?.toString()],
                    ].map(([label, value]) => (
                      <div key={label as string}>
                        <p className={`text-[10px] ${t.textMuted2} uppercase`}>{label}</p>
                        <p className={`text-sm ${t.text}`}>{value || "-"}</p>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 pt-4 border-t ${t.sidebarBorder}`}>
                    <a href={`https://wa.me/${selectedContact.session_id}`} target="_blank" rel="noopener"
                      className="block w-full text-center px-3 py-2 bg-green-700 text-white rounded-lg text-xs hover:bg-green-600 transition">
                      Abrir en WhatsApp Web
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowTemplateModal(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className={`relative w-full max-w-md mx-4 ${t.sidebar} border ${t.sidebarBorder} rounded-xl shadow-2xl p-4`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${t.text} font-medium`}>Enviar Template</h3>
              <button onClick={() => setShowTemplateModal(false)} className={`${t.textMuted2} hover:${t.text}`}>✕</button>
            </div>
            {templates.length === 0 ? (
              <p className={`${t.textMuted2} text-sm text-center py-6`}>No hay templates aprobados. Crea templates en Meta Business.</p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {templates.map(tmpl => {
                  const header = tmpl.components?.find((c: any) => c.type === "HEADER");
                  const body = tmpl.components?.find((c: any) => c.type === "BODY");
                  const buttons = tmpl.components?.find((c: any) => c.type === "BUTTONS");
                  return (
                    <div key={tmpl.id} className={`p-3 ${t.inputBg} rounded-lg border ${t.inputBorder}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className={`text-sm ${t.text} font-medium`}>{tmpl.name}</p>
                          <p className={`text-[10px] ${t.textMuted2}`}>{tmpl.category} · {tmpl.language}</p>
                        </div>
                        <button
                          onClick={() => sendTemplate(tmpl)}
                          disabled={sending}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.accentBg} text-white hover:opacity-90 transition disabled:opacity-40`}
                        >{sending ? "Enviando..." : "Enviar ➤"}</button>
                      </div>
                      {header?.format === "IMAGE" && header.example?.header_handle?.[0] && (
                        <img src={header.example.header_handle[0]} alt="" className="w-full max-h-32 object-cover rounded-lg mb-2" />
                      )}
                      {body?.text && (
                        <p className={`text-xs ${t.textMuted} bg-black/20 rounded-lg p-2`}>{body.text}</p>
                      )}
                      {buttons?.buttons && (
                        <div className="flex gap-1 mt-2">
                          {buttons.buttons.map((b: any, i: number) => (
                            <span key={i} className={`text-[10px] ${t.accent} ${t.inputBg} px-2 py-0.5 rounded`}>🔗 {b.text}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Context Menu ─── */}
      {contextMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)}>
          <div
            className={`absolute ${t.sidebar} border ${t.sidebarBorder} rounded-xl shadow-2xl py-1 min-w-[200px]`}
            style={{ left: Math.min(contextMenu.x, window.innerWidth - 220), top: Math.min(contextMenu.y, window.innerHeight - 300) }}
            onClick={e => e.stopPropagation()}
          >
            <div className={`px-3 py-2 border-b ${t.sidebarBorder}`}>
              <p className={`text-xs font-medium ${t.text} truncate`}>{contextMenu.contact.nombre || contextMenu.contact.session_id}</p>
              <p className={`text-[10px] ${t.textMuted2}`}>{contextMenu.contact.session_id}</p>
            </div>
            <button onClick={() => { selectContact(contextMenu.contact); setContextMenu(null); }}
              className={`w-full text-left px-3 py-2 text-xs ${t.text} ${t.hover} transition flex items-center gap-2`}>
              📩 Abrir chat
            </button>
            <button onClick={() => {
              toggleSelectContact(contextMenu.contact.session_id, contacts.findIndex(c => c.session_id === contextMenu.contact.session_id));
              setContextMenu(null);
            }}
              className={`w-full text-left px-3 py-2 text-xs ${t.text} ${t.hover} transition flex items-center gap-2`}>
              {selectedContacts.has(contextMenu.contact.session_id) ? "☑ Deseleccionar" : "☐ Seleccionar"}
            </button>
            <button onClick={() => { selectAllVisible(); setContextMenu(null); }}
              className={`w-full text-left px-3 py-2 text-xs ${t.text} ${t.hover} transition flex items-center gap-2`}>
              ☑ Seleccionar todos ({contacts.length})
            </button>
            {selectedContacts.size > 0 && (
              <button onClick={() => {
                setShowBulkSend(true); setBulkResults([]); setBulkProgress({ sent: 0, failed: 0, total: 0 });
                setContextMenu(null);
              }}
                className={`w-full text-left px-3 py-2 text-xs text-green-400 ${t.hover} transition flex items-center gap-2`}>
                📢 Enviar masivo ({selectedContacts.size})
              </button>
            )}
            <div className={`border-t ${t.sidebarBorder} my-1`} />
            <button onClick={() => {
              updateContactStatus(contextMenu.contact.conversation_status === 2 ? 0 : 2);
              setContextMenu(null);
            }}
              className={`w-full text-left px-3 py-2 text-xs ${t.text} ${t.hover} transition flex items-center gap-2`}>
              {contextMenu.contact.conversation_status === 2 ? "↻ Reabrir" : "✓ Resolver"}
            </button>
            <button onClick={() => {
              updateContactStatus(1);
              setContextMenu(null);
            }}
              className={`w-full text-left px-3 py-2 text-xs text-yellow-400 ${t.hover} transition flex items-center gap-2`}>
              ⏳ Pendiente
            </button>
            <a href={`https://wa.me/${contextMenu.contact.session_id}`} target="_blank" rel="noopener"
              onClick={() => setContextMenu(null)}
              className={`block w-full text-left px-3 py-2 text-xs ${t.text} ${t.hover} transition`}>
              🔗 Abrir en WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ─── Date Picker Modal ─── */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDatePicker(false)}>
          <div className={`${t.sidebar} border ${t.sidebarBorder} rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 overflow-hidden max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${t.sidebarBorder}`}>
              <h3 className={`${t.text} font-medium`}>📅 Filtrar por fecha</h3>
              <button onClick={() => setShowDatePicker(false)} className={`${t.textMuted2} hover:${t.text} text-lg`}>✕</button>
            </div>
            <div className="flex flex-col md:flex-row">
              {/* Presets sidebar */}
              <div className={`md:w-[160px] border-b md:border-b-0 md:border-r ${t.sidebarBorder} flex flex-col`}>
                <div className="p-2 space-y-0.5 flex-1">
                  {[
                    { key: "today", label: "Hoy" },
                    { key: "yesterday", label: "Ayer" },
                    { key: "last7", label: "Últimos 7 días" },
                    { key: "last30", label: "Últimos 30 días" },
                    { key: "thisMonth", label: "Este mes" },
                    { key: "lastMonth", label: "Mes pasado" },
                  ].map(preset => (
                    <button
                      key={preset.key}
                      onClick={() => applyDatePreset(preset.key)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                        datePresetLabel === preset.label
                          ? `${t.accentBg} text-white`
                          : `${t.text} ${t.hover}`
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {/* Desde / Hasta inputs */}
                <div className={`p-2 border-t ${t.sidebarBorder} space-y-2`}>
                  <div>
                    <label className={`text-[10px] ${t.textMuted2} uppercase font-medium`}>Desde</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => { setDateFrom(e.target.value); if (!dateTo || e.target.value > dateTo) setDateTo(e.target.value); setDatePresetLabel("Personalizado"); }}
                      className={`w-full mt-0.5 ${t.inputBg} border ${t.inputBorder} rounded-md px-2 py-1.5 text-[11px] ${t.text} outline-none focus:border-green-600 [color-scheme:dark]`}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] ${t.textMuted2} uppercase font-medium`}>Hasta</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => { setDateTo(e.target.value); if (!dateFrom || e.target.value < dateFrom) setDateFrom(e.target.value); setDatePresetLabel("Personalizado"); }}
                      className={`w-full mt-0.5 ${t.inputBg} border ${t.inputBorder} rounded-md px-2 py-1.5 text-[11px] ${t.text} outline-none focus:border-green-600 [color-scheme:dark]`}
                    />
                  </div>
                </div>
              </div>
              {/* Calendar */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => {
                    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                    else setCalMonth(calMonth - 1);
                  }} className={`${t.textMuted} hover:${t.text} text-sm px-2 py-1 rounded ${t.hover} transition`}>◀</button>
                  <span className={`${t.text} text-sm font-medium`}>
                    {new Date(calYear, calMonth).toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={() => {
                    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                    else setCalMonth(calMonth + 1);
                  }} className={`${t.textMuted} hover:${t.text} text-sm px-2 py-1 rounded ${t.hover} transition`}>▶</button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map(d => (
                    <div key={d} className={`text-center text-[10px] ${t.textMuted2} py-1 font-medium`}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {getCalendarDays().map((day, i) => (
                    <button
                      key={i}
                      onClick={() => day && handleCalendarDayClick(day)}
                      disabled={!day}
                      className={`h-8 text-xs rounded-md transition ${
                        !day
                          ? ""
                          : isDayStart(day) || isDayEnd(day)
                            ? `${t.accentBg} text-white font-bold`
                            : isDayInRange(day)
                              ? `${t.accentBg}/30 ${t.accent}`
                              : `${t.text} ${t.hover}`
                      }`}
                    >
                      {day || ""}
                    </button>
                  ))}
                </div>
                {/* Selected range display */}
                {dateFrom && (
                  <div className={`mt-3 text-center text-xs ${t.textMuted}`}>
                    {dateFrom === dateTo
                      ? new Date(dateFrom + "T12:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                      : `${new Date(dateFrom + "T12:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short" })} — ${new Date(dateTo + "T12:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}`
                    }
                  </div>
                )}
              </div>
            </div>
            <div className={`flex justify-between px-4 py-3 border-t ${t.sidebarBorder}`}>
              <button onClick={clearDateFilter}
                className={`px-4 py-2 text-xs ${t.inputBg} ${t.textMuted} rounded-lg ${t.hover} transition`}>
                Limpiar
              </button>
              <button onClick={applyDateFilter}
                className={`px-6 py-2 text-xs ${t.accentBg} text-white rounded-lg hover:opacity-90 transition font-medium`}>
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bulk Send Modal ─── */}
      {showBulkSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { if (!bulkSending) setShowBulkSend(false); }}>
          <div className={`${t.sidebar} border ${t.sidebarBorder} rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${t.sidebarBorder}`}>
              <h3 className={`${t.text} font-bold text-lg`}>📢 Envío masivo</h3>
              {!bulkSending && (
                <button onClick={() => setShowBulkSend(false)} className={`${t.textMuted2} hover:${t.text} text-xl`}>✕</button>
              )}
            </div>
            <div className="p-5 space-y-4">
              {/* Recipients */}
              <div>
                <p className={`text-xs ${t.textMuted} mb-2`}>Destinatarios: <span className={`${t.accent} font-bold`}>{selectedContacts.size} contactos</span></p>
                <div className={`${t.inputBg} rounded-lg p-2 max-h-20 overflow-y-auto`}>
                  <p className={`text-[10px] ${t.textMuted2} leading-relaxed`}>
                    {contacts.filter(c => selectedContacts.has(c.session_id)).map(c => c.nombre || c.session_id).join(" · ")}
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                <p className="text-[11px] text-amber-400">
                  ⚠ Solo se enviará texto libre a contactos con ventana de 24h activa. Fuera de ventana, usa Templates.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2">
                <button onClick={() => setBulkMode("text")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                    bulkMode === "text" ? `${t.accentBg} text-white` : `${t.inputBg} ${t.textMuted}`
                  }`}>
                  💬 Texto libre
                </button>
                <button onClick={() => setBulkMode("template")}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                    bulkMode === "template" ? `${t.accentBg} text-white` : `${t.inputBg} ${t.textMuted}`
                  }`}>
                  📋 Template
                </button>
              </div>

              {/* Message input */}
              <textarea
                value={bulkMessage}
                onChange={e => setBulkMessage(e.target.value)}
                placeholder={bulkMode === "template" ? "Nombre del template (ej: hello_world)" : "Escribe el mensaje para todos los contactos..."}
                rows={4}
                disabled={bulkSending}
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl px-4 py-3 text-sm ${t.text} placeholder:${t.textMuted2} outline-none focus:border-green-600 resize-none disabled:opacity-50`}
              />

              {/* Send button */}
              {!bulkSending && bulkResults.length === 0 && (
                <button
                  onClick={startBulkSend}
                  disabled={!bulkMessage.trim()}
                  className={`w-full py-3 rounded-xl text-sm font-bold ${t.accentBg} text-white hover:opacity-90 transition disabled:opacity-40`}
                >
                  ENVIAR A {selectedContacts.size} CONTACTOS
                </button>
              )}

              {/* Progress */}
              {(bulkSending || bulkResults.length > 0) && (
                <div className="space-y-3">
                  {/* Progress bar */}
                  <div className={`w-full h-2 ${t.inputBg} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${t.accentBg} transition-all duration-300`}
                      style={{ width: `${bulkProgress.total > 0 ? ((bulkProgress.sent + bulkProgress.failed) / bulkProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">✓ Enviados: {bulkProgress.sent}</span>
                    <span className="text-red-400">✕ Fallidos: {bulkProgress.failed}</span>
                    <span className={t.textMuted2}>Restantes: {bulkProgress.total - bulkProgress.sent - bulkProgress.failed}</span>
                  </div>

                  {/* Results list */}
                  {bulkResults.length > 0 && (
                    <div className={`${t.inputBg} rounded-lg max-h-32 overflow-y-auto`}>
                      {bulkResults.map((r, i) => (
                        <div key={i} className={`flex items-center gap-2 px-3 py-1.5 text-[11px] border-b ${t.sidebarBorder}/30 last:border-0`}>
                          <span>{r.ok ? "✅" : "❌"}</span>
                          <span className={`${t.text} flex-1 truncate`}>{r.nombre || r.session_id}</span>
                          {r.error && <span className="text-red-400 text-[10px] truncate max-w-[150px]">{r.error}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Done */}
                  {!bulkSending && bulkResults.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={() => { setShowBulkSend(false); clearMultiSelect(); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-medium ${t.accentBg} text-white hover:opacity-90 transition`}>
                        ✓ Listo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
