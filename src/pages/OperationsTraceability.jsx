import { useMemo, useState } from "react";
import { BarChart3, Bell, Download, Filter, LayoutDashboard, Search, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";
import { useLanguage } from "@/components/i18n/LanguageContext";

const paymentSources = Object.freeze({
  bank: {
    key: "bank",
    count: 46,
    rows: [
      { client: "customer0@example.com", date: "2025-10-20", amount: "1.50", status: "pending", currency: "USD" },
      { client: "stats-customer-27@example.com", date: "2026-02-17", amount: "11.64", status: "completed", currency: "USD" },
      { client: "stats-customer-19@example.com", date: "2026-02-15", amount: "9.30", status: "completed", currency: "USD" },
      { client: "stats-customer-29@example.com", date: "2026-02-09", amount: "4.64", status: "completed", currency: "USD" },
      { client: "stats-customer-32@example.com", date: "2026-02-09", amount: "0.85", status: "completed", currency: "USD" },
      { client: "stats-customer-8@example.com", date: "2026-02-08", amount: "7.02", status: "completed", currency: "USD" },
    ],
  },
  balance: {
    key: "balance",
    count: 23,
    rows: [
      { client: "business0@example.com", date: "2025-10-30", amount: "2.20", status: "rejected", currency: "USD" },
      { client: "business9@example.com", date: "2026-02-12", amount: "3.58", status: "completed", currency: "USD" },
      { client: "business8@example.com", date: "2026-02-04", amount: "8.93", status: "completed", currency: "USD" },
      { client: "business5@example.com", date: "2026-02-03", amount: "5.45", status: "completed", currency: "USD" },
      { client: "business3@example.com", date: "2026-02-01", amount: "14.64", status: "completed", currency: "USD" },
      { client: "business1@example.com", date: "2026-01-31", amount: "5.00", status: "completed", currency: "USD" },
    ],
  },
});

const statusTone = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const copyByLanguage = {
  es: {
    heroBadge: "Dashboard oficial de cobros",
    title: "Trazabilidad de operaciones",
    heroDescription:
      "Visualiza todo el ciclo de cobros desde una consola comercial: estados en vivo, segmentacion por fuente de fondos y exportables para control operativo.",
    enterDashboard: "Entrar al dashboard",
    viewConsole: "Ver consola",
    impactTitle: "Impacto esperado con la operacion centralizada",
    auditSpeed: "Velocidad de auditoria",
    incidents: "Incidencias operativas",
    includeLabel: "Incluye alertas y monitoreo continuo:",
    chipAlerts: "Alertas por estado",
    chipExport: "Exportacion PDF/CSV/XLSX",
    chipCustomer: "Seguimiento por cliente",
    cards: [
      {
        title: "Lectura comercial en tiempo real",
        desc: "Monitorea conversiones y montos por fuente sin esperar cierres manuales.",
      },
      {
        title: "Alertas que previenen perdidas",
        desc: "Detecta pendientes y rechazados de forma temprana con foco en continuidad.",
      },
      {
        title: "Control para finanzas y riesgo",
        desc: "Trazas exportables para conciliacion, auditoria y seguimiento operativo.",
      },
    ],
    operationalView: "Vista operativa",
    tableTitle: "Cobros",
    tableSubtitle: "Filtra por origen de fondos y revisa el estado de cada transaccion al instante.",
    tabBank: "Por Cuenta Bancaria",
    tabBalance: "Por Saldo Antilla",
    searchPlaceholder: "Buscar cliente, estado o fecha",
    filterDate: "Fecha de creacion",
    filterStatus: "Estado",
    exportAll: "Exportar toda la informacion",
    availableFormats: "Formatos disponibles: PDF, CSV y XLSX.",
    showing: "Mostrando",
    of: "de",
    payments: "pagos",
    tableClient: "Cliente",
    tableDate: "Fecha",
    tableAmount: "Importe",
    tableStatus: "Estado",
    tableCurrency: "Moneda",
    status: { completed: "Completado", pending: "Pendiente", rejected: "Rechazado" },
    promoBadge: "Promocion Dashboard",
    promoTitle: "Activa trazabilidad completa y acelera tu operacion",
    promoDesc: "Alertas, filtros avanzados y exportacion lista para finanzas en una sola consola.",
    signIn: "Iniciar sesion",
    contactSales: "Hablar con ventas",
  },
  en: {
    heroBadge: "Official payments dashboard",
    title: "Operations traceability",
    heroDescription:
      "Track the full payment lifecycle from a commercial console: live statuses, funding-source segmentation, and exportable records for operational control.",
    enterDashboard: "Enter dashboard",
    viewConsole: "View console",
    impactTitle: "Expected impact with centralized operations",
    auditSpeed: "Audit speed",
    incidents: "Operational incidents",
    includeLabel: "Includes alerts and continuous monitoring:",
    chipAlerts: "Status alerts",
    chipExport: "PDF/CSV/XLSX export",
    chipCustomer: "Customer tracking",
    cards: [
      {
        title: "Real-time commercial visibility",
        desc: "Monitor conversions and amounts by source without waiting for manual closes.",
      },
      {
        title: "Alerts that prevent losses",
        desc: "Detect pending and rejected operations early to protect continuity.",
      },
      {
        title: "Control for finance and risk",
        desc: "Exportable traces for reconciliation, audit, and operational follow-up.",
      },
    ],
    operationalView: "Operational view",
    tableTitle: "Payments",
    tableSubtitle: "Filter by funding source and review each transaction status instantly.",
    tabBank: "By bank account",
    tabBalance: "By Antilla balance",
    searchPlaceholder: "Search client, status, or date",
    filterDate: "Creation date",
    filterStatus: "Status",
    exportAll: "Export all information",
    availableFormats: "Available formats: PDF, CSV, and XLSX.",
    showing: "Showing",
    of: "of",
    payments: "payments",
    tableClient: "Client",
    tableDate: "Date",
    tableAmount: "Amount",
    tableStatus: "Status",
    tableCurrency: "Currency",
    status: { completed: "Completed", pending: "Pending", rejected: "Rejected" },
    promoBadge: "Dashboard promotion",
    promoTitle: "Enable full traceability and accelerate operations",
    promoDesc: "Alerts, advanced filters, and finance-ready exports in one console.",
    signIn: "Sign in",
    contactSales: "Contact sales",
  },
};

export default function OperationsTraceability() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

  const [activeSource, setActiveSource] = useState("bank");
  const [query, setQuery] = useState("");
  const source = paymentSources[activeSource];

  const tabs = {
    bank: copy.tabBank,
    balance: copy.tabBalance,
  };

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return source.rows;
    return source.rows.filter(
      (row) =>
        row.client.toLowerCase().includes(normalized) ||
        copy.status[row.status].toLowerCase().includes(normalized) ||
        row.date.includes(normalized),
    );
  }, [copy.status, query, source.rows]);

  const showingText = query
    ? `${copy.showing} ${filteredRows.length} ${copy.of} ${source.count} ${copy.payments}`
    : `${copy.showing} ${source.count} ${copy.payments}`;

  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-[#1E2A78] via-[#2D3AA0] to-[#4F46E5] p-8 md:p-10 text-white shadow-[0_20px_80px_-35px_rgba(79,70,229,0.65)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-indigo-100 mb-4">
                <LayoutDashboard className="w-4 h-4" />
                {copy.heroBadge}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{copy.title}</h1>
              <p className="text-indigo-100 text-lg max-w-xl mb-6">{copy.heroDescription}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-4 py-2.5 font-semibold hover:bg-indigo-50"
                >
                  {copy.enterDashboard}
                </button>
                <a
                  href="#consola-cobros"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  {copy.viewConsole}
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-indigo-100 mb-4">{copy.impactTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">+41%</p>
                  <p className="text-xs text-indigo-100 mt-1">{copy.auditSpeed}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">-28%</p>
                  <p className="text-xs text-indigo-100 mt-1">{copy.incidents}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-indigo-100 mb-2">{copy.includeLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipAlerts}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipExport}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipCustomer}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[0].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[0].desc}</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[1].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[1].desc}</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[2].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[2].desc}</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article id="consola-cobros" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">{copy.operationalView}</p>
            <h2 className="text-4xl font-semibold text-slate-900 mb-1">{copy.tableTitle}</h2>
            <p className="text-slate-600 mb-6">{copy.tableSubtitle}</p>
          </div>

          <div className="border-b border-slate-200 flex gap-8 px-6">
            {Object.values(paymentSources).map((item) => {
              const isActive = item.key === activeSource;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSource(item.key)}
                  className={`pb-4 text-[20px] font-medium border-b-4 transition-colors ${
                    isActive ? "text-[#5b5df0] border-[#5b5df0]" : "text-slate-700 border-transparent hover:text-slate-900"
                  }`}
                >
                  {tabs[item.key]}
                </button>
              );
            })}
          </div>

          <div className="px-6 py-5 space-y-4">
            <label className="w-full lg:max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full text-slate-700 placeholder:text-slate-500 bg-transparent outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {copy.filterDate}
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {copy.filterStatus}
                </button>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                {copy.exportAll}
              </button>
            </div>
          </div>

          <div className="px-6 pb-6">
            <p className="text-xs text-slate-500 mb-2">{copy.availableFormats}</p>
            <p className="text-slate-600 mb-3">{showingText}</p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[860px] text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableClient}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableDate}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableAmount}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableStatus}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableCurrency}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={`${row.client}-${row.date}-${row.amount}`} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                      <td className="px-6 py-5">
                        <a href={createPageUrl("CustomerTraceability")} className="font-semibold text-[#5b5df0] hover:underline">
                          {row.client}
                        </a>
                      </td>
                      <td className="px-6 py-5 text-slate-700">{row.date}</td>
                      <td className="px-6 py-5 text-slate-700">{row.amount}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-sm border ${statusTone[row.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                          {copy.status[row.status]}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-700">{row.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 mb-1">{copy.promoBadge}</p>
            <h4 className="text-xl font-semibold text-slate-900">{copy.promoTitle}</h4>
            <p className="text-slate-600 text-sm mt-1">{copy.promoDesc}</p>
          </div>
          <button
            type="button"
            onClick={redirectToLogin}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:opacity-90"
          >
            <Zap className="w-4 h-4" />
            {copy.signIn}
          </button>
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))} className="inline-flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {copy.contactSales}
          </Button>
        </div>
      </section>
    </div>
  );
}
