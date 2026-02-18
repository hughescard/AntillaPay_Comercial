import {
  BarChart3,
  Clock3,
  Coffee,
  CreditCard,
  FileDown,
  Fuel,
  Home,
  Landmark,
  Link2,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { getTerminalPosUrl } from "@/shared/terminal/terminalPosRedirect";

const terminalPosUrl = getTerminalPosUrl();

const baseSectorSolutions = {
  pymes: {
    id: "pymes",
    badge: "Solución para Pymes",
    title: "Convierte ventas diarias en operación financiera ordenada",
    subtitle:
      "AntillaPay ayuda a pequeños negocios a cobrar, controlar saldos y dar seguimiento a clientes desde un dashboard simple y accionable.",
    audience: "Comercios, servicios profesionales y negocios emergentes.",
    stats: [
      { value: "48h", label: "Tiempo típico de activación" },
      { value: "24/7", label: "Visibilidad de cobros y estado" },
      { value: "-35%", label: "Menos trabajo manual operativo" },
    ],
    capabilities: [
      {
        icon: CreditCard,
        title: "Cobros rápidos en múltiples canales",
        description: "Usa enlaces de pago y flujos de cobro digital para acelerar ventas sin complejidad técnica.",
      },
      {
        icon: Wallet,
        title: "Control de saldo y movimientos",
        description: "Supervisa disponibilidad, extracciones y conciliación en una sola vista financiera.",
      },
      {
        icon: Users,
        title: "Seguimiento por cliente",
        description: "Consulta historial de pagos y comportamiento para mejorar retención y recurrencia.",
      },
      {
        icon: FileDown,
        title: "Exportación documental",
        description: "Descarga reportes operativos y financieros en formatos listos para control interno.",
      },
    ],
    modules: [
      { name: "Payment Links", description: "Generación de cobros compartibles", href: createPageUrl("Payments") },
      { name: "Trazabilidad de operaciones", description: "Estados en tiempo real", href: createPageUrl("OperationsTraceability") },
      { name: "Gestiona tu saldo", description: "Liquidez y movimientos", href: createPageUrl("BalanceManagement") },
      { name: "Trazabilidad por cliente", description: "Ficha comercial 360", href: createPageUrl("CustomerTraceability") },
    ],
    flow: [
      { title: "Configura productos y montos", description: "Define lo que vendes y el esquema de cobro más adecuado." },
      { title: "Activa cobros y monitorea estados", description: "Opera con alertas y seguimiento de cada transacción." },
      { title: "Exporta y toma decisiones", description: "Usa reportes para gestionar caja, crecimiento y control interno." },
    ],
  },
  retail: {
    id: "retail",
    badge: "Solución para Retail",
    title: "Unifica tienda física y digital con control comercial en tiempo real",
    subtitle:
      "Desde cajas en punto de venta hasta cobros digitales, AntillaPay centraliza la operación para equipos retail con alto volumen.",
    audience: "Cadenas, tiendas especializadas y retail multicanal.",
    stats: [
      { value: "+18%", label: "Mejora potencial en conversión de cobro" },
      { value: "1 panel", label: "Control de canales físico y digital" },
      { value: "Tiempo real", label: "Estado por transacción y cliente" },
    ],
    capabilities: [
      {
        icon: ShoppingCart,
        title: "Cobro omnicanal",
        description: "Gestiona ventas en tienda, redes y enlaces directos desde la misma operación.",
      },
      {
        icon: Zap,
        title: "Flujo ágil en punto de venta",
        description: "Integra terminales de pago para reducir fricción y filas en caja.",
      },
      {
        icon: BarChart3,
        title: "Lectura comercial por turno",
        description: "Mide desempeño por horario, canal y comportamiento de clientes.",
      },
      {
        icon: ShieldCheck,
        title: "Control operativo y trazas",
        description: "Consolida evidencia transaccional para auditoría y gestión interna.",
      },
    ],
    modules: [
      { name: "Terminal de Punto de Venta", description: "Cobro presencial para retail", href: terminalPosUrl },
      { name: "Payment Links", description: "Ventas rápidas fuera de tienda", href: createPageUrl("Payments") },
      { name: "Trazabilidad de operaciones", description: "Estados y conciliación", href: createPageUrl("OperationsTraceability") },
      { name: "Trazabilidad por cliente", description: "Historial para fidelización", href: createPageUrl("CustomerTraceability") },
    ],
    flow: [
      { title: "Activa tus canales de cobro", description: "Define canal físico y digital según cada tipo de venta." },
      { title: "Monitorea ventas por operación", description: "Controla aprobadas, pendientes y rechazadas en vivo." },
      { title: "Optimiza conversión y recurrencia", description: "Usa datos por cliente para promociones y retención." },
    ],
  },
  transporte: {
    id: "transporte",
    badge: "Solución para Transporte",
    title: "Gestiona cobros y dispersión de fondos sin perder trazabilidad",
    subtitle:
      "AntillaPay permite operar pagos de alta frecuencia y mantener control financiero claro en rutas, servicios y clientes.",
    audience: "Operadores logísticos, movilidad y transporte de pasajeros.",
    stats: [
      { value: "Alta frecuencia", label: "Procesamiento operativo continuo" },
      { value: "1-3 días", label: "Ventana estimada de payouts nacionales" },
      { value: "Total", label: "Trazabilidad de cobros y salidas" },
    ],
    capabilities: [
      {
        icon: Truck,
        title: "Cobros recurrentes y por evento",
        description: "Opera pagos de tickets, rutas o servicios de forma consistente.",
      },
      {
        icon: Clock3,
        title: "Seguimiento de estado en vivo",
        description: "Visualiza el progreso de operaciones para reaccionar con rapidez.",
      },
      {
        icon: Landmark,
        title: "Payouts a terceros",
        description: "Gestiona transferencias nacionales a cuentas vinculadas de forma controlada.",
      },
      {
        icon: FileDown,
        title: "Exportables para control financiero",
        description: "Genera reportes para conciliación administrativa y cierre operativo.",
      },
    ],
    modules: [
      { name: "Trazabilidad de operaciones", description: "Control de cobros por servicio", href: createPageUrl("OperationsTraceability") },
      { name: "Payouts nacionales", description: "Transferencias y pagos nacionales", href: createPageUrl("NationalPayouts") },
      { name: "Gestiona tu saldo", description: "Liquidez para operación diaria", href: createPageUrl("BalanceManagement") },
    ],
    flow: [
      { title: "Centraliza cobros operativos", description: "Consolida pagos por ruta, unidad o tipo de servicio." },
      { title: "Distribuye fondos con control", description: "Programa salidas y monitorea cada payout nacional." },
      { title: "Concilia y reporta", description: "Exporta información para control administrativo y decisiones." },
    ],
  },
  hosteleriaOcio: {
    id: "hosteleria-ocio",
    badge: "Solución para Hostelería y Ocio",
    title: "Eleva la experiencia del huésped con cobros fluidos y control interno",
    subtitle:
      "Simplifica pagos de reservas, servicios y consumos mientras tu equipo mantiene visibilidad completa de la operación.",
    audience: "Hoteles, restaurantes, bares y espacios de entretenimiento.",
    stats: [
      { value: "+20%", label: "Potencial de mejora en experiencia de cobro" },
      { value: "24/7", label: "Monitoreo operativo desde dashboard" },
      { value: "360°", label: "Vista de cliente y transacciones" },
    ],
    capabilities: [
      {
        icon: Coffee,
        title: "Checkout rápido para clientes",
        description: "Reduce fricción en pagos de consumo y servicios adicionales.",
      },
      {
        icon: Link2,
        title: "Cobro remoto antes y después del servicio",
        description: "Envía links para reservas, anticipos y cargos complementarios.",
      },
      {
        icon: Users,
        title: "Perfil de cliente y recurrencia",
        description: "Consulta histórico y comportamiento para fidelización y upselling.",
      },
      {
        icon: FileDown,
        title: "Reportes para cierre diario",
        description: "Exporta información para administración y control por turno.",
      },
    ],
    modules: [
      { name: "Payment Links", description: "Reservas y cobros remotos", href: createPageUrl("Payments") },
      { name: "Trazabilidad por cliente", description: "Historial de pagos por huésped", href: createPageUrl("CustomerTraceability") },
      { name: "Trazabilidad de operaciones", description: "Estado en vivo de la operación", href: createPageUrl("OperationsTraceability") },
    ],
    flow: [
      { title: "Define experiencias y cobros", description: "Configura reservas, anticipos y pagos de servicios." },
      { title: "Monitorea operación por cliente", description: "Controla estados para brindar atención proactiva." },
      { title: "Cierra turno con evidencia", description: "Exporta reportes para administración y seguimiento." },
    ],
  },
  vending: {
    id: "vending",
    badge: "Solución para Vending",
    title: "Automatiza cobros de alto volumen con operación ligera",
    subtitle:
      "AntillaPay soporta modelos de cobro automatizado con visibilidad de transacciones y control financiero centralizado.",
    audience: "Operadores de máquinas expendedoras y autoservicio.",
    stats: [
      { value: "Escalable", label: "Operación para múltiples puntos" },
      { value: "En vivo", label: "Estado por transacción" },
      { value: "Exportable", label: "Control documental recurrente" },
    ],
    capabilities: [
      {
        icon: Zap,
        title: "Cobro digital eficiente",
        description: "Habilita flujos rápidos para transacciones frecuentes y de ticket medio bajo.",
      },
      {
        icon: BarChart3,
        title: "Monitoreo por punto operativo",
        description: "Mide rendimiento por ubicación y tipo de máquina.",
      },
      {
        icon: Wallet,
        title: "Gestión de saldo centralizada",
        description: "Controla disponibilidad para sostener reposición y mantenimiento.",
      },
      {
        icon: FileDown,
        title: "Reportes para control de red",
        description: "Descarga información para análisis financiero y operativo.",
      },
    ],
    modules: [
      { name: "Payment Links", description: "Cobro digital simplificado", href: createPageUrl("Payments") },
      { name: "Trazabilidad de operaciones", description: "Lectura de estado por cobro", href: createPageUrl("OperationsTraceability") },
      { name: "Gestiona tu saldo", description: "Liquidez de operación", href: createPageUrl("BalanceManagement") },
    ],
    flow: [
      { title: "Configura esquema de cobro", description: "Estandariza montos y canales según el punto de venta." },
      { title: "Controla estatus y recurrencia", description: "Monitorea comportamiento por hora, día y ubicación." },
      { title: "Exporta y optimiza la red", description: "Analiza datos para mejorar rendimiento y cobertura." },
    ],
  },
  energia: {
    id: "energia",
    badge: "Solución para Energía",
    title: "Ordena la cobranza de servicios energéticos con trazabilidad integral",
    subtitle:
      "Desde pagos periódicos hasta conciliación financiera, AntillaPay mejora la operación de empresas del sector energético.",
    audience: "Comercializadoras, distribuidores y servicios energéticos.",
    stats: [
      { value: "Mensual", label: "Cobranza recurrente estructurada" },
      { value: "Integral", label: "Control de clientes y operación" },
      { value: "Auditable", label: "Reportes para cumplimiento interno" },
    ],
    capabilities: [
      {
        icon: Fuel,
        title: "Cobros por ciclo de servicio",
        description: "Gestiona pagos periódicos y seguimiento por estado de cobranza.",
      },
      {
        icon: Users,
        title: "Relación operativa por cliente",
        description: "Visualiza historial para priorizar recuperación y atención.",
      },
      {
        icon: ShieldCheck,
        title: "Control y cumplimiento",
        description: "Conserva trazas y evidencias para revisiones de auditoría.",
      },
      {
        icon: FileDown,
        title: "Exportación documental",
        description: "Genera información lista para finanzas, operaciones y dirección.",
      },
    ],
    modules: [
      { name: "Trazabilidad de operaciones", description: "Cobranza y estados por ciclo", href: createPageUrl("OperationsTraceability") },
      { name: "Trazabilidad por cliente", description: "Historial y segmentación", href: createPageUrl("CustomerTraceability") },
      { name: "Gestiona tu saldo", description: "Control de liquidez", href: createPageUrl("BalanceManagement") },
    ],
    flow: [
      { title: "Estructura la cobranza", description: "Define procesos de cobro por tipo de servicio energético." },
      { title: "Supervisa clientes y pagos", description: "Monitorea cumplimiento y comportamiento por segmento." },
      { title: "Concilia y reporta", description: "Exporta información para control y mejora continua." },
    ],
  },
  serviciosHogar: {
    id: "servicios-hogar",
    badge: "Solución para Servicios del Hogar",
    title: "Mejora la relación con clientes con cobros simples y seguimiento claro",
    subtitle:
      "AntillaPay facilita cobros para servicios recurrentes del hogar con visibilidad por cliente y operación centralizada.",
    audience: "Servicios de mantenimiento, reparaciones y suscripciones domésticas.",
    stats: [
      { value: "+30%", label: "Respuesta comercial más rápida" },
      { value: "1 vista", label: "Gestión por cliente y transacción" },
      { value: "Listo", label: "Exportables para seguimiento interno" },
    ],
    capabilities: [
      {
        icon: Home,
        title: "Cobro flexible por servicio",
        description: "Acepta pagos puntuales o recurrentes según el tipo de contrato.",
      },
      {
        icon: Link2,
        title: "Links para pago remoto",
        description: "Envía cobros a clientes sin depender de procesos manuales complejos.",
      },
      {
        icon: Users,
        title: "Historial por cliente",
        description: "Analiza recurrencia, puntualidad y valor por cuenta atendida.",
      },
      {
        icon: FileDown,
        title: "Documentación operativa",
        description: "Exporta datos para administración, facturación y soporte.",
      },
    ],
    modules: [
      { name: "Payment Links", description: "Cobros remotos inmediatos", href: createPageUrl("Payments") },
      { name: "Trazabilidad por cliente", description: "Relación y actividad histórica", href: createPageUrl("CustomerTraceability") },
      { name: "Trazabilidad de operaciones", description: "Seguimiento de estado", href: createPageUrl("OperationsTraceability") },
    ],
    flow: [
      { title: "Activa cobro por servicio", description: "Configura esquema de pago por visita o plan recurrente." },
      { title: "Sigue cada operación", description: "Controla estados para mantener una experiencia consistente." },
      { title: "Exporta para control interno", description: "Documenta operación y mejora decisiones comerciales." },
    ],
  },
  bancos: {
    id: "bancos",
    badge: "Solución para Bancos",
    title: "Potencia servicios financieros con una capa de operación moderna",
    subtitle:
      "AntillaPay habilita experiencias de pago y control operativo para instituciones financieras que necesitan agilidad y trazabilidad.",
    audience: "Bancos, entidades financieras y unidades de servicios transaccionales.",
    stats: [
      { value: "Escala", label: "Operación multiunidad y multicanal" },
      { value: "Tiempo real", label: "Monitoreo de estados críticos" },
      { value: "Confiable", label: "Trazas para riesgo y cumplimiento" },
    ],
    capabilities: [
      {
        icon: Landmark,
        title: "Infraestructura para pagos y salidas",
        description: "Gestiona cobros, saldo y dispersión nacional desde un marco operativo unificado.",
      },
      {
        icon: ShieldCheck,
        title: "Gobierno de operación",
        description: "Fortalece trazabilidad y control para equipos de riesgo y cumplimiento.",
      },
      {
        icon: Wallet,
        title: "Control de liquidez por vista",
        description: "Monitorea disponibilidad, extracciones y movimientos críticos.",
      },
      {
        icon: FileDown,
        title: "Exportación para auditoría",
        description: "Obtén reportes listos para revisión financiera y regulatoria interna.",
      },
    ],
    modules: [
      { name: "Payouts nacionales", description: "Transferencias y gestión bancaria local", href: createPageUrl("NationalPayouts") },
      { name: "Gestiona tu saldo", description: "Liquidez y movimientos", href: createPageUrl("BalanceManagement") },
      { name: "Trazabilidad de operaciones", description: "Control de estados y alertas", href: createPageUrl("OperationsTraceability") },
      { name: "Trazabilidad por cliente", description: "Visión comercial y de riesgo", href: createPageUrl("CustomerTraceability") },
    ],
    flow: [
      { title: "Configura servicios transaccionales", description: "Estructura procesos según producto o segmento bancario." },
      { title: "Monitorea operación y cumplimiento", description: "Controla estados críticos con visión consolidada." },
      { title: "Audita y optimiza", description: "Exporta trazas y mejora tiempos de respuesta operativa." },
    ],
  },
};

const localizedSectorOverrides = {
  en: {
    pymes: {
      badge: "Solution for SMBs",
      title: "Turn daily sales into a structured financial operation",
      subtitle:
        "AntillaPay helps small businesses collect payments, control balances, and track customers from one practical dashboard.",
      audience: "Retail, professional services, and emerging businesses.",
      stats: [
        { value: "48h", label: "Typical activation time" },
        { value: "24/7", label: "Payment and status visibility" },
        { value: "-35%", label: "Less manual operational work" },
      ],
      capabilities: [
        { title: "Fast payments across channels", description: "Use payment links and digital payment flows to close sales faster without technical complexity." },
        { title: "Balance and movement control", description: "Monitor availability, withdrawals, and reconciliation from one financial view." },
        { title: "Customer-level tracking", description: "Review payment history and behavior to improve retention and recurrence." },
        { title: "Document export", description: "Download operational and financial reports in formats ready for internal control." },
      ],
      modules: [
        { name: "Payment Links", description: "Shareable payment collection" },
        { name: "Operations traceability", description: "Real-time statuses" },
        { name: "Manage your balance", description: "Liquidity and movements" },
        { name: "Customer traceability", description: "360 commercial profile" },
      ],
      flow: [
        { title: "Configure products and amounts", description: "Define what you sell and the best collection model." },
        { title: "Activate collections and monitor status", description: "Operate with alerts and transaction-level visibility." },
        { title: "Export and decide", description: "Use reports to manage cash flow and growth." },
      ],
    },
    retail: {
      badge: "Solution for Retail",
      title: "Unify physical and digital commerce with real-time control",
      subtitle:
        "From in-store checkout to digital payments, AntillaPay centralizes high-volume retail operations.",
      audience: "Chains, specialized stores, and multichannel retail teams.",
      stats: [
        { value: "+18%", label: "Potential payment conversion uplift" },
        { value: "1 panel", label: "Control for physical and digital channels" },
        { value: "Real time", label: "Transaction and customer status" },
      ],
      capabilities: [
        { title: "Omnichannel collection", description: "Run store, social, and direct-link sales from one operation." },
        { title: "Faster point-of-sale flows", description: "Integrate payment terminals to reduce friction at checkout." },
        { title: "Shift-level commercial visibility", description: "Measure performance by time, channel, and customer behavior." },
        { title: "Operational control and traces", description: "Consolidate evidence for audits and internal management." },
      ],
      modules: [
        { name: "Point of Sale Terminal", description: "In-person retail payments" },
        { name: "Payment Links", description: "Fast sales outside the store" },
        { name: "Operations traceability", description: "Statuses and reconciliation" },
        { name: "Customer traceability", description: "History for loyalty" },
      ],
      flow: [
        { title: "Enable your payment channels", description: "Set physical and digital channels based on each sale type." },
        { title: "Monitor sales by operation", description: "Track approved, pending, and rejected payments live." },
        { title: "Optimize conversion and recurrence", description: "Use customer data for promotions and retention." },
      ],
    },
    transporte: {
      badge: "Solution for Transport",
      title: "Manage collections and fund distribution with full traceability",
      subtitle:
        "AntillaPay supports high-frequency payments with strong financial control for routes, services, and customers.",
      audience: "Logistics operators, mobility services, and passenger transport.",
      stats: [
        { value: "High frequency", label: "Continuous operational processing" },
        { value: "1-3 days", label: "Estimated domestic payout window" },
        { value: "Full", label: "Payment and payout traceability" },
      ],
      capabilities: [
        { title: "Recurring and event-based collections", description: "Run ticket, route, or service payments consistently." },
        { title: "Live status tracking", description: "Follow operation progress to react quickly." },
        { title: "Third-party payouts", description: "Manage domestic transfers to linked accounts with control." },
        { title: "Exportable financial control", description: "Generate reports for admin reconciliation and closeouts." },
      ],
      modules: [
        { name: "Operations traceability", description: "Service-level payment control" },
        { name: "National payouts", description: "Transfers and domestic payments" },
        { name: "Manage your balance", description: "Liquidity for daily operation" },
      ],
      flow: [
        { title: "Centralize operational collections", description: "Consolidate payments by route, unit, or service type." },
        { title: "Distribute funds with control", description: "Schedule outflows and monitor each domestic payout." },
        { title: "Reconcile and report", description: "Export information for administrative decisions." },
      ],
    },
    hosteleriaOcio: {
      badge: "Solution for Hospitality and Leisure",
      title: "Upgrade guest experience with smooth checkout and stronger control",
      subtitle:
        "Simplify payments for bookings, services, and consumptions while keeping end-to-end operational visibility.",
      audience: "Hotels, restaurants, bars, and entertainment venues.",
      stats: [
        { value: "+20%", label: "Potential improvement in payment experience" },
        { value: "24/7", label: "Operational monitoring from dashboard" },
        { value: "360", label: "Customer and transaction view" },
      ],
      capabilities: [
        { title: "Fast customer checkout", description: "Reduce friction in service and add-on charges." },
        { title: "Remote collection before and after service", description: "Send links for bookings, deposits, and complementary charges." },
        { title: "Customer profile and recurrence", description: "Review history and behavior for loyalty and upsell." },
        { title: "Shift-close reporting", description: "Export data for administration and shift-level control." },
      ],
      modules: [
        { name: "Payment Links", description: "Bookings and remote collections" },
        { name: "Customer traceability", description: "Guest-level payment history" },
        { name: "Operations traceability", description: "Live operation status" },
      ],
      flow: [
        { title: "Design experiences and collection flows", description: "Configure reservations, deposits, and service payments." },
        { title: "Monitor operations by customer", description: "Track statuses to deliver proactive support." },
        { title: "Close shifts with evidence", description: "Export reports for follow-up and control." },
      ],
    },
    vending: {
      badge: "Solution for Vending",
      title: "Automate high-volume collections with lightweight operations",
      subtitle:
        "AntillaPay supports automated collection models with transaction visibility and centralized financial control.",
      audience: "Vending and self-service network operators.",
      stats: [
        { value: "Scalable", label: "Operation across multiple points" },
        { value: "Live", label: "Transaction-level status" },
        { value: "Exportable", label: "Recurring documental control" },
      ],
      capabilities: [
        { title: "Efficient digital collection", description: "Enable quick flows for high-frequency, low-ticket transactions." },
        { title: "Point-level monitoring", description: "Measure performance by location and machine type." },
        { title: "Centralized balance management", description: "Control available funds for replenishment and maintenance." },
        { title: "Network reporting", description: "Download information for financial and operational analysis." },
      ],
      modules: [
        { name: "Payment Links", description: "Simplified digital collection" },
        { name: "Operations traceability", description: "Status by payment" },
        { name: "Manage your balance", description: "Operational liquidity" },
      ],
      flow: [
        { title: "Configure the collection model", description: "Standardize amounts and channels by selling point." },
        { title: "Track status and recurrence", description: "Monitor behavior by hour, day, and location." },
        { title: "Export and optimize network", description: "Use data to improve coverage and performance." },
      ],
    },
    energia: {
      badge: "Solution for Energy",
      title: "Structure energy-service collections with full traceability",
      subtitle:
        "From recurring charges to financial reconciliation, AntillaPay improves operations for energy-sector companies.",
      audience: "Energy service providers, distributors, and utility operators.",
      stats: [
        { value: "Monthly", label: "Structured recurring collection" },
        { value: "Integral", label: "Customer and operation control" },
        { value: "Auditable", label: "Reports for internal compliance" },
      ],
      capabilities: [
        { title: "Service-cycle collections", description: "Run recurring charges and track collection status." },
        { title: "Customer operational relationship", description: "Review history to prioritize recovery and support." },
        { title: "Control and compliance", description: "Keep traces and evidence for internal audit reviews." },
        { title: "Document export", description: "Generate information ready for finance, operations, and leadership." },
      ],
      modules: [
        { name: "Operations traceability", description: "Collections and cycle statuses" },
        { name: "Customer traceability", description: "History and segmentation" },
        { name: "Manage your balance", description: "Liquidity control" },
      ],
      flow: [
        { title: "Structure collection operations", description: "Define processes by energy service type." },
        { title: "Supervise customers and payments", description: "Monitor compliance and behavior by segment." },
        { title: "Reconcile and report", description: "Export data for control and continuous improvement." },
      ],
    },
    serviciosHogar: {
      badge: "Solution for Home Services",
      title: "Improve customer relationships with simple collection flows",
      subtitle:
        "AntillaPay simplifies collections for recurring home services with customer-level visibility and centralized operation.",
      audience: "Maintenance, repair, and household subscription services.",
      stats: [
        { value: "+30%", label: "Faster commercial response" },
        { value: "1 view", label: "Customer and transaction management" },
        { value: "Ready", label: "Exportables for internal follow-up" },
      ],
      capabilities: [
        { title: "Flexible service charging", description: "Accept one-time or recurring payments based on contract type." },
        { title: "Remote payment links", description: "Send collections without manual-heavy processes." },
        { title: "Customer-level history", description: "Analyze recurrence, punctuality, and account value." },
        { title: "Operational documentation", description: "Export data for administration, billing, and support." },
      ],
      modules: [
        { name: "Payment Links", description: "Immediate remote collections" },
        { name: "Customer traceability", description: "Relationship and historical activity" },
        { name: "Operations traceability", description: "Status monitoring" },
      ],
      flow: [
        { title: "Enable service-based charging", description: "Configure payment by visit or recurring plan." },
        { title: "Track each operation", description: "Control statuses to keep a consistent experience." },
        { title: "Export for internal control", description: "Document operation and improve commercial decisions." },
      ],
    },
    bancos: {
      badge: "Solution for Banks",
      title: "Power financial services with a modern operations layer",
      subtitle:
        "AntillaPay enables payment experiences and operational control for institutions that need agility and traceability.",
      audience: "Banks, financial institutions, and transactional service units.",
      stats: [
        { value: "Scale", label: "Multi-unit and multichannel operation" },
        { value: "Real time", label: "Critical-status monitoring" },
        { value: "Reliable", label: "Traces for risk and compliance" },
      ],
      capabilities: [
        { title: "Infrastructure for payments and outflows", description: "Manage collections, balances, and domestic disbursements from one framework." },
        { title: "Operational governance", description: "Strengthen traceability and control for risk and compliance teams." },
        { title: "Liquidity view control", description: "Monitor availability, withdrawals, and critical movements." },
        { title: "Audit export", description: "Get reports ready for internal financial and regulatory review." },
      ],
      modules: [
        { name: "National payouts", description: "Transfers and local banking management" },
        { name: "Manage your balance", description: "Liquidity and movements" },
        { name: "Operations traceability", description: "Status and alert control" },
        { name: "Customer traceability", description: "Commercial and risk view" },
      ],
      flow: [
        { title: "Configure transactional services", description: "Structure processes by product or banking segment." },
        { title: "Monitor operations and compliance", description: "Track critical statuses with a consolidated view." },
        { title: "Audit and optimize", description: "Export traces and improve operational response times." },
      ],
    },
  },
};

const mergeSolutionByLanguage = (base, override = {}) => ({
  ...base,
  ...override,
  stats: base.stats.map((item, index) => ({ ...item, ...(override.stats?.[index] || {}) })),
  capabilities: base.capabilities.map((item, index) => ({ ...item, ...(override.capabilities?.[index] || {}) })),
  modules: base.modules.map((item, index) => ({ ...item, ...(override.modules?.[index] || {}) })),
  flow: base.flow.map((item, index) => ({ ...item, ...(override.flow?.[index] || {}) })),
});

export function getSectorSolutions(language = "es") {
  if (language === "es") {
    return baseSectorSolutions;
  }

  const languageCopy = localizedSectorOverrides[language] || localizedSectorOverrides.en;
  return Object.fromEntries(
    Object.entries(baseSectorSolutions).map(([key, solution]) => [
      key,
      mergeSolutionByLanguage(solution, languageCopy[key]),
    ]),
  );
}

export const sectorSolutions = baseSectorSolutions;
