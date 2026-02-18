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

export const sectorSolutions = {
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
