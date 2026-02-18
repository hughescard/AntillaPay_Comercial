import { BarChart3, Download, TrendingUp, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";
import { useLanguage } from "@/components/i18n/LanguageContext";

const extractionRows = [
  { date: "2026-02-14", amount: "0.90 USD", status: "rejected" },
  { date: "2026-02-11", amount: "540.00 USD", status: "completed" },
  { date: "2026-02-08", amount: "120.00 USD", status: "completed" },
];

const statusTone = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const copyByLanguage = {
  es: {
    heroBadge: "Dashboard de saldo",
    title: "Gestiona tu saldo",
    heroDescription:
      "Controla liquidez en tiempo real, visualiza fondos entrantes y disponibles, y sigue el estado de cada extraccion desde una vista financiera clara.",
    enterDashboard: "Entrar al dashboard",
    viewBalance: "Ver saldo",
    kpisTitle: "KPIs de operacion financiera",
    availableBalance: "Saldo disponible",
    operationalVisibility: "Visibilidad operativa",
    integratedWith: "Integrado con extracciones y trazabilidad contable:",
    chipLive: "Estado en vivo",
    chipExport: "Exportacion PDF/CSV/XLSX",
    chipAlerts: "Alertas de saldo",
    cards: [
      { title: "Saldo consolidado", desc: "Vista centralizada de fondos disponibles y entrantes por moneda." },
      { title: "Seguimiento de extracciones", desc: "Controla cada extraccion y detecta incidencias en minutos." },
      { title: "Decisiones con contexto", desc: "Conecta liquidez, operacion y reporting financiero en una sola pantalla." },
    ],
    balanceHeadline: "Saldo 1,000.00 USD",
    withdraw: "Extraer",
    incoming: "Entrante",
    available: "Disponible",
    withdrawalsTab: "Extracciones",
    exportHint: "Puedes exportar toda la informacion en PDF, CSV o XLSX.",
    filterDate: "+ Fecha de creacion",
    filterStatus: "+ Estado",
    exportAll: "Exportar toda la informacion",
    showing: "Mostrando 1 pagos",
    tableDate: "Fecha",
    tableAmount: "Importe",
    tableStatus: "Estado",
    status: { completed: "Completada", rejected: "Rechazada" },
    promoBadge: "Promocion Dashboard",
    promoTitle: "Gestiona liquidez con control total del saldo",
    promoDesc: "Monitorea disponibilidad y estado de extracciones en una sola vista.",
    signIn: "Iniciar sesion",
    contactSales: "Hablar con ventas",
  },
  en: {
    heroBadge: "Balance dashboard",
    title: "Manage your balance",
    heroDescription:
      "Control liquidity in real time, monitor incoming and available funds, and track every withdrawal status from a clear financial view.",
    enterDashboard: "Enter dashboard",
    viewBalance: "View balance",
    kpisTitle: "Financial operation KPIs",
    availableBalance: "Available balance",
    operationalVisibility: "Operational visibility",
    integratedWith: "Integrated with withdrawals and accounting traceability:",
    chipLive: "Live status",
    chipExport: "PDF/CSV/XLSX export",
    chipAlerts: "Balance alerts",
    cards: [
      { title: "Consolidated balance", desc: "Centralized view of available and incoming funds by currency." },
      { title: "Withdrawal tracking", desc: "Track every withdrawal and detect incidents in minutes." },
      { title: "Context-aware decisions", desc: "Connect liquidity, operations, and financial reporting in one screen." },
    ],
    balanceHeadline: "Balance 1,000.00 USD",
    withdraw: "Withdraw",
    incoming: "Incoming",
    available: "Available",
    withdrawalsTab: "Withdrawals",
    exportHint: "You can export all information in PDF, CSV, or XLSX.",
    filterDate: "+ Creation date",
    filterStatus: "+ Status",
    exportAll: "Export all information",
    showing: "Showing 1 payments",
    tableDate: "Date",
    tableAmount: "Amount",
    tableStatus: "Status",
    status: { completed: "Completed", rejected: "Rejected" },
    promoBadge: "Dashboard promotion",
    promoTitle: "Manage liquidity with full balance control",
    promoDesc: "Monitor availability and withdrawal status from one view.",
    signIn: "Sign in",
    contactSales: "Contact sales",
  },
};

export default function BalanceManagement() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-[#0F5132] via-[#166534] to-[#22C55E] p-8 md:p-10 text-white shadow-[0_20px_80px_-35px_rgba(34,197,94,0.65)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-100 mb-4">
                <Wallet className="w-4 h-4" />
                {copy.heroBadge}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{copy.title}</h1>
              <p className="text-emerald-100 text-lg max-w-xl mb-6">{copy.heroDescription}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-4 py-2.5 font-semibold hover:bg-emerald-50"
                >
                  {copy.enterDashboard}
                </button>
                <a
                  href="#saldo-operativo"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  {copy.viewBalance}
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-emerald-100 mb-4">{copy.kpisTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">US$ 1,000</p>
                  <p className="text-xs text-emerald-100 mt-1">{copy.availableBalance}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-xs text-emerald-100 mt-1">{copy.operationalVisibility}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-emerald-100 mb-2">{copy.integratedWith}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipLive}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipExport}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipAlerts}</span>
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[0].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[0].desc}</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[1].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[1].desc}</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[2].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[2].desc}</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article id="saldo-operativo" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-5xl font-semibold text-slate-900">{copy.balanceHeadline}</h2>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                {copy.withdraw}
              </button>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-4">
              <div className="h-full w-full bg-[#5b5df0]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-slate-700">
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />{copy.incoming}</span>
                <span className="font-medium">0.00 USD</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#5b5df0]" />{copy.available}</span>
                <span className="font-semibold">1,000.00 USD</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="border-b border-slate-200 mb-4">
              <button className="pb-3 text-lg font-medium text-[#5b5df0] border-b-2 border-[#5b5df0]">{copy.withdrawalsTab}</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">{copy.exportHint}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  {copy.filterDate}
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  {copy.filterStatus}
                </button>
              </div>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                {copy.exportAll}
              </button>
            </div>

            <p className="text-slate-600 mb-3">{copy.showing}</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableDate}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableAmount}</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {extractionRows.map((row) => (
                    <tr key={`${row.date}-${row.amount}`} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                      <td className="px-6 py-5 text-slate-700">{row.date}</td>
                      <td className="px-6 py-5 text-slate-900 font-semibold">{row.amount}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-sm border ${statusTone[row.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                          {copy.status[row.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 flex flex-wrap items-center justify-between gap-4">
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
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))}>
            {copy.contactSales}
          </Button>
        </div>
      </section>
    </div>
  );
}
