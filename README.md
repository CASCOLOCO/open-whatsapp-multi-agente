# Open WhatsApp Multi Agente

CRM de WhatsApp multi-agente, open source, llave en mano. Inbox unificado para equipos de ventas y soporte con la API oficial de WhatsApp Cloud (Meta).

## Que es esto?

Un sistema completo para gestionar todas las conversaciones de WhatsApp de tu negocio desde un solo lugar. Multiples agentes pueden atender clientes al mismo tiempo, con plantillas, campanas masivas, automatizaciones y mucho mas.

**Construido con:** Next.js 16 + React 19 + PostgreSQL + Tailwind CSS + WhatsApp Cloud API

---

## Caracteristicas

### Inbox de Chat
- **Inbox en tiempo real** — Mensajes se actualizan automaticamente cada 15 segundos
- **Multi-agente** — Varios agentes atienden simultaneamente con asignacion de conversaciones
- **Busqueda de contactos** — Busca por nombre o numero de telefono
- **Busqueda en mensajes** — Busca dentro de una conversacion (Alt+F)
- **Notas internas** — Notas privadas entre agentes que el cliente no ve (Alt+N)
- **Estados de conversacion** — Abierto, Pendiente, Resuelto, Pospuesto
- **Etiquetas** — Organiza contactos con etiquetas de colores (Nuevo, VIP, Urgente, etc.)
- **Link previews** — Al enviar un link, muestra vista previa con imagen, titulo y descripcion
- **Recibos de mensaje** — Indicadores de enviado, entregado y leido (✓ ✓✓)
- **Sonido de notificacion** — Alerta sonora cuando llegan nuevos mensajes

### Plantillas de WhatsApp
- **Templates de Meta** — Envia plantillas aprobadas de WhatsApp Business
- **Renderizado visual** — Las plantillas se muestran como cards con imagen, texto y botones
- **Parametros dinamicos** — Sustitucion automatica de variables en plantillas

### Campanas Masivas
- **Envio masivo** — Envia a multiples contactos seleccionados
- **Seleccion multiple** — Ctrl+click (individual), Shift+click (rango), Seleccionar todos
- **Seguimiento** — Ve el progreso de envio con exitos y errores por destinatario
- **Texto o plantilla** — Elige entre enviar texto libre o una plantilla de WhatsApp

### Respuestas Rapidas
- **Atajos con /** — Escribe `/saludo` en el chat y se reemplaza por tu respuesta completa
- **Variables** — Usa {nombre}, {telefono}, {ciudad}, {pais} para personalizar
- **Con adjuntos** — Adjunta imagenes o archivos a tus respuestas rapidas

### Automatizacion
- **Reglas automaticas** — Configura acciones cuando se crea un mensaje, conversacion o se asigna
- **Acciones disponibles** — Asignar agente, enviar mensaje, cambiar estado, agregar etiqueta
- **Activar/desactivar** — Cada regla puede encenderse o apagarse individualmente

### Agentes
- **Agregar agentes** — Nombre y email
- **Estado en linea** — Indicador de disponibilidad
- **Asignacion** — Asigna conversaciones a agentes especificos
- **Colores automaticos** — Cada agente tiene un color unico para identificacion

### Configuracion
- **Horario de atencion** — Define horarios por dia con mensaje automatico fuera de horario
- **Mensaje de bienvenida** — Auto-respuesta para contactos nuevos con variables
- **Encuesta de satisfaccion (CSAT)** — Envia encuesta al resolver conversaciones
- **Integraciones** — Conecta MercadoLibre, Facebook, Instagram, TikTok, Chat Web

### Personalizacion
- **5 temas visuales** — Dark, Light, WhatsApp, Midnight, Forest
- **Persistencia** — El tema se guarda en el navegador

### Filtros Avanzados
- **Por estado** — Todos, Abiertos, Pendientes, Resueltos, Pospuestos
- **Por fecha** — Hoy, ayer, ultimos 7/30 dias, este mes, rango personalizado
- **Por agente** — Sin asignar o asignado a un agente especifico
- **Por etiqueta** — Filtra por cualquier etiqueta creada

### Atajos de Teclado
| Atajo | Accion |
|-------|--------|
| Alt+N | Modo notas internas |
| Alt+M | Modo mensaje normal |
| Alt+R | Resolver/Reabrir conversacion |
| Alt+I | Panel de info del contacto |
| Alt+F | Buscar en mensajes |
| Esc | Cerrar paneles/menus |
| ↑ ↓ | Navegar entre contactos |

---

## Requisitos Previos

Antes de instalar necesitas tener:

1. **Node.js 18 o superior** — [Descargar aqui](https://nodejs.org/)
2. **PostgreSQL 14 o superior** — [Descargar aqui](https://www.postgresql.org/download/)
3. **Cuenta de Meta Business** — Para usar la API de WhatsApp
4. **Un servidor o VPS** (para produccion) — Recomendado: Ubuntu 22+ con 1GB RAM minimo

---

## Instalacion Paso a Paso

### Paso 1: Descargar el proyecto

Abre una terminal (CMD en Windows, Terminal en Mac/Linux) y escribe:

```bash
git clone https://github.com/infanteronald/open-whatsapp-multi-agente.git
cd open-whatsapp-multi-agente
```

### Paso 2: Instalar dependencias

```bash
npm install
```

> Si usas pnpm: `pnpm install`

### Paso 3: Crear la base de datos

Abre tu cliente de PostgreSQL (pgAdmin, DBeaver, o la terminal) y ejecuta:

```sql
CREATE DATABASE whatsapp_crm;
```

Luego ejecuta el script de configuracion:

```bash
psql -h localhost -U postgres -d whatsapp_crm -f scripts/setup-db.sql
```

> **En Windows con pgAdmin:** Abre pgAdmin → click derecho en "Databases" → "Create" → nombre: `whatsapp_crm`. Luego abre el Query Tool y copia-pega el contenido de `scripts/setup-db.sql`.

### Paso 4: Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Abre `.env` con cualquier editor de texto y completa los valores:

```env
# Tu dominio (o localhost para pruebas)
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com

# Datos de PostgreSQL
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/whatsapp_crm

# WhatsApp Cloud API (ver Paso 5)
WHATSAPP_ACCESS_TOKEN=tu_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
WHATSAPP_WABA_ID=tu_waba_id
WHATSAPP_VERIFY_TOKEN=un_texto_secreto_cualquiera
```

### Paso 5: Configurar WhatsApp Cloud API

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una app tipo "Business"
3. Agrega el producto "WhatsApp"
4. En "API Setup" encontraras:
   - **Phone Number ID** → ponlo en `WHATSAPP_PHONE_NUMBER_ID`
   - **WhatsApp Business Account ID** → ponlo en `WHATSAPP_WABA_ID`
5. Genera un **token permanente**:
   - Ve a "Business Settings" → "System Users"
   - Crea un System User con rol Admin
   - Genera un token con permiso `whatsapp_business_messaging`
   - Ponlo en `WHATSAPP_ACCESS_TOKEN`

6. **Configura el Webhook:**
   - URL: `https://tu-dominio.com/api/whatsapp/webhook`
   - Token de verificacion: el mismo que pusiste en `WHATSAPP_VERIFY_TOKEN`
   - Suscribete a: `messages`

> Guia detallada de Meta: [WhatsApp Cloud API Getting Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

### Paso 6: Compilar y ejecutar

**Para desarrollo (pruebas locales):**
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3001`

**Para produccion:**
```bash
npm run build
npm start
```

### Paso 7 (Opcional): Mantener corriendo con PM2

Para que la aplicacion no se cierre al cerrar la terminal:

```bash
npm install -g pm2
pm2 start npm --name "whatsapp-crm" -- start
pm2 save
pm2 startup
```

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── panel/whatsapp/
│   │   ├── page.tsx              # Chat principal (inbox)
│   │   ├── settings/page.tsx     # Configuracion y ajustes
│   │   ├── analytics/page.tsx    # Dashboard de analitica
│   │   └── campaigns/page.tsx    # Gestion de campanas
│   └── api/
│       ├── whatsapp/
│       │   ├── webhook/route.ts  # Recibe mensajes de WhatsApp
│       │   ├── send/route.ts     # Envia mensajes
│       │   └── media/route.ts    # Proxy de archivos multimedia
│       ├── plazbot/              # APIs del CRM
│       │   ├── route.ts          # Contactos (listar, filtrar)
│       │   ├── messages/         # Mensajes por conversacion
│       │   ├── agents/           # Gestion de agentes
│       │   ├── labels/           # Etiquetas
│       │   ├── canned/           # Respuestas rapidas
│       │   ├── templates/        # Templates de WhatsApp
│       │   ├── campaigns/        # Campanas masivas
│       │   ├── automation/       # Reglas de automatizacion
│       │   ├── settings/         # Configuracion general
│       │   ├── integrations/     # Integraciones externas
│       │   ├── analytics/        # Datos de analitica
│       │   ├── search/           # Busqueda de contactos
│       │   ├── note/             # Notas internas
│       │   └── import/           # Importacion de datos
│       └── link-preview/         # Vista previa de links (OG)
├── components/panel/
│   ├── PanelSidebar.tsx          # Barra de navegacion lateral
│   └── PanelMainContent.tsx      # Contenedor principal
└── lib/
    └── db.ts                     # Conexion a PostgreSQL
```

---

## Variables de Entorno

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | No | Nombre de tu app (default: "WhatsApp CRM") |
| `NEXT_PUBLIC_BASE_URL` | Si | URL de tu dominio |
| `PORT` | No | Puerto del servidor (default: 3001) |
| `DATABASE_URL` | Si | URL de conexion a PostgreSQL |
| `WHATSAPP_ACCESS_TOKEN` | Si | Token de la API de WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | Si | ID del numero de telefono en Meta |
| `WHATSAPP_WABA_ID` | Si | ID de la cuenta de WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | Si | Token para verificar el webhook |
| `IMPORT_SECRET` | No | Secreto para el endpoint de importacion |

---

## Licencia

MIT License — Usa, modifica y distribuye libremente.

---

## Contribuir

Pull requests son bienvenidos. Para cambios grandes, abre un issue primero para discutir la propuesta.

---

Desarrollado con Next.js, React, PostgreSQL y la WhatsApp Cloud API.
