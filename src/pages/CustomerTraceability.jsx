import { ArrowLeft, BarChart3, Copy, Download, LayoutDashboard, MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, User, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";
import { useLanguage } from "@/components/i18n/LanguageContext";

const customers = [
  {
    name: "Stats Customer 29",
    email: "stats-customer-29@example.com",
    created: "2026-02-17",
    type: "client",
    business: "Stats Business 29",
  },
  {
    name: "Customer 2",
    email: "customer2@example.com",
    created: "2026-02-17",
    type: "client",
    business: "Business 2",
  },
  {
    name: "Customer 1",
    email: "customer1@example.com",
    created: "2026-02-17",
    type: "client",
    business: "Business 1",
  },
  {
    name: "Stats Customer 14",
    email: "stats-customer-14@example.com",
    created: "2026-02-17",
    type: "client",
    business: "Stats Business 14",
  },
];

const payments = [
  { date: "2026-02-09", amount: "4.64 USD", currency: "USD", status: "completed" },
  { date: "2026-01-18", amount: "7.42 USD", currency: "USD", status: "completed" },
  { date: "2025-12-28", amount: "15.00 USD", currency: "USD", status: "completed" },
];

const copyByLanguage = {
  es: {
    heroBadge: "Dashboard de clientes 360",
    title: "Trazabilidad por cliente",
    heroDescription:
      "Convierte datos operativos en inteligencia comercial. Segmenta clientes, revisa historial de pagos y toma decisiones con contexto completo en una sola vista.",
    enterDashboard: "Entrar al dashboard",
    viewList: "Ver listado",
    valueTitle: "Valor comercial para equipos de operacion y crecimiento",
    fasterResolution: "Resolucion mas rapida",
    customerView: "Vista del cliente",
    includeLabel: "Incluye funcionalidades clave:",
    chipSearch: "Busqueda avanzada",
    chipExport: "Exportacion PDF/CSV/XLSX",
    chipHistory: "Historial por cliente",
    cards: [
      { title: "Segmentacion por cliente", desc: "Filtra y monitorea clientes por tipo, fecha y comportamiento operativo." },
      { title: "Analisis orientado a crecimiento", desc: "Descubre recurrencia, valor promedio y tendencia de cada cuenta." },
      { title: "Trazas listas para auditoria", desc: "Consulta historial consolidado y exporta evidencia financiera con un clic." },
    ],
    operationalView: "Vista operativa",
    customersTitle: "Clientes",
    traceabilityPanel: "Panel de trazabilidad",
    newCustomer: "Nuevo cliente",
    search: "Buscar",
    filterDate: "+ Fecha de creacion",
    filterType: "+ Tipo",
    exportAll: "Exportar toda la informacion",
    editColumns: "Editar columnas",
    showingCustomers: "Mostrando 26 clientes",
    exportViewHint: "Puedes exportar la vista completa de clientes en PDF, CSV o XLSX.",
    tableName: "Nombre",
    tableEmail: "Correo",
    tableCreated: "Creado",
    tableType: "Tipo",
    tableBusiness: "Empresa",
    goBackCustomers: "Clientes",
    customerFile: "Ficha del cliente",
    createdOn: "Creado",
    copyId: "Copiar ID",
    copyEmail: "Copiar email",
    basicInfo: "Informacion basica",
    paymentHistory: "Historial de pagos",
    tableDate: "Fecha",
    tableAmount: "Importe",
    tableCurrency: "Moneda",
    tableStatus: "Estado",
    customerType: { client: "Cliente" },
    paymentStatus: { completed: "Completado" },
    promoBadge: "Promocion Dashboard",
    promoTitle: "Aprovecha la vista cliente 360 para vender mejor",
    promoDesc: "Consulta historial, exporta datos y toma decisiones con contexto real.",
    signIn: "Iniciar sesion",
    contactSales: "Hablar con ventas",
  },
  en: {
    heroBadge: "360 customer dashboard",
    title: "Customer traceability",
    heroDescription:
      "Turn operational data into commercial intelligence. Segment customers, review payment history, and make decisions with full context in one view.",
    enterDashboard: "Enter dashboard",
    viewList: "View list",
    valueTitle: "Commercial value for operations and growth teams",
    fasterResolution: "Faster resolution",
    customerView: "Customer view",
    includeLabel: "Key capabilities included:",
    chipSearch: "Advanced search",
    chipExport: "PDF/CSV/XLSX export",
    chipHistory: "Customer history",
    cards: [
      { title: "Customer segmentation", desc: "Filter and monitor customers by type, date, and operational behavior." },
      { title: "Growth-oriented analytics", desc: "Discover recurrence, average value, and trends for each account." },
      { title: "Audit-ready traces", desc: "Review consolidated history and export financial evidence in one click." },
    ],
    operationalView: "Operational view",
    customersTitle: "Customers",
    traceabilityPanel: "Traceability panel",
    newCustomer: "New customer",
    search: "Search",
    filterDate: "+ Creation date",
    filterType: "+ Type",
    exportAll: "Export all information",
    editColumns: "Edit columns",
    showingCustomers: "Showing 26 customers",
    exportViewHint: "You can export the full customer view in PDF, CSV, or XLSX.",
    tableName: "Name",
    tableEmail: "Email",
    tableCreated: "Created",
    tableType: "Type",
    tableBusiness: "Business",
    goBackCustomers: "Customers",
    customerFile: "Customer profile",
    createdOn: "Created",
    copyId: "Copy ID",
    copyEmail: "Copy email",
    basicInfo: "Basic information",
    paymentHistory: "Payment history",
    tableDate: "Date",
    tableAmount: "Amount",
    tableCurrency: "Currency",
    tableStatus: "Status",
    customerType: { client: "Customer" },
    paymentStatus: { completed: "Completed" },
    promoBadge: "Dashboard promotion",
    promoTitle: "Use the 360 customer view to sell better",
    promoDesc: "Review history, export data, and make decisions with real context.",
    signIn: "Sign in",
    contactSales: "Contact sales",
  },
};

function SectionTitle({ children }) {
  return <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">{children}</h3>;
}

export default function CustomerTraceability() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-[#111B5A] via-[#2C3B99] to-[#5B5DF0] p-8 md:p-10 text-white shadow-[0_20px_80px_-35px_rgba(79,70,229,0.65)]">
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
                  href="#listado-clientes"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  {copy.viewList}
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-indigo-100 mb-4">{copy.valueTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">+32%</p>
                  <p className="text-xs text-indigo-100 mt-1">{copy.fasterResolution}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">360°</p>
                  <p className="text-xs text-indigo-100 mt-1">{copy.customerView}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-indigo-100 mb-2">{copy.includeLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipSearch}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipExport}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipHistory}</span>
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
              <Users className="w-5 h-5" />
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{copy.cards[2].title}</h3>
            <p className="text-sm text-slate-600">{copy.cards[2].desc}</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        <article id="listado-clientes" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">{copy.operationalView}</p>
            <h2 className="text-4xl font-semibold text-slate-900">{copy.customersTitle}</h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <SectionTitle>{copy.traceabilityPanel}</SectionTitle>
            <Button className="bg-[#5b5df0] hover:bg-[#4f51d6] text-white shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              {copy.newCustomer}
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="w-full lg:max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <span className="text-slate-500">{copy.search}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  {copy.filterDate}
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  {copy.filterType}
                </button>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {copy.exportAll}
                </button>
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  {copy.editColumns}
                </button>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-3">{copy.showingCustomers}</p>
          <p className="text-xs text-slate-500 mb-2">{copy.exportViewHint}</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold">{copy.tableName}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">{copy.tableEmail}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">{copy.tableCreated}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">{copy.tableType}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">{copy.tableBusiness}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.email} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                    <td className="px-6 py-5 font-semibold text-slate-900">{customer.name}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.email}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.created}</td>
                    <td className="px-6 py-5 text-slate-700">{copy.customerType[customer.type]}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.business}</td>
                    <td className="px-6 py-5">
                      <button className="text-slate-500 hover:text-slate-700">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <a href="#listado-clientes" className="inline-flex items-center gap-2 text-[#5b5df0] font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            {copy.goBackCustomers}
          </a>

          <div className="flex flex-wrap items-start gap-5 mb-7">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <User className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.customerFile}</p>
              <h4 className="text-4xl font-semibold text-slate-900 mb-2">Stats Customer 29</h4>
              <p className="text-xl text-slate-700">stats-customer-29@example.com</p>
              <p className="text-xl text-slate-500 mb-4">Stats Business 29</p>
              <div className="flex flex-wrap items-center gap-3 text-slate-500">
                <span>ID 02738d39-fffc-4088-b383-fd1abfa86479</span>
                <span>•</span>
                <span>{copy.createdOn} 2026-02-17</span>
                <button className="inline-flex items-center gap-1 text-[#5b5df0]">
                  <Copy className="w-4 h-4" />
                  {copy.copyId}
                </button>
                <button className="inline-flex items-center gap-1 text-[#5b5df0]">
                  <Copy className="w-4 h-4" />
                  {copy.copyEmail}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 mb-6 bg-gradient-to-br from-white to-indigo-50/20">
            <h5 className="text-3xl font-semibold text-slate-900 mb-5">{copy.basicInfo}</h5>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.tableName}</p>
                <p className="text-slate-900 text-xl">Stats Customer 29</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.tableEmail}</p>
                <p className="text-slate-900 text-xl">stats-customer-29@example.com</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.tableCreated}</p>
                <p className="text-slate-900 text-xl">2026-02-17</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.tableType}</p>
                <p className="text-slate-900 text-xl">{copy.customerType.client}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h5 className="text-3xl font-semibold text-slate-900">{copy.paymentHistory}</h5>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                {copy.exportAll}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-[0.12em]">
                    <th className="py-3 font-medium">{copy.tableDate}</th>
                    <th className="py-3 font-medium">{copy.tableAmount}</th>
                    <th className="py-3 font-medium">{copy.tableCurrency}</th>
                    <th className="py-3 font-medium">{copy.tableStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={`${payment.date}-${payment.amount}`} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                      <td className="py-4 text-slate-700">{payment.date}</td>
                      <td className="py-4 text-slate-900 font-semibold">{payment.amount}</td>
                      <td className="py-4 text-slate-700">{payment.currency}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 text-sm">
                          {copy.paymentStatus[payment.status]}
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
            <Sparkles className="w-4 h-4" />
            {copy.signIn}
          </button>
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))} className="inline-flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {copy.contactSales}
          </Button>
        </div>
      </section>
    </div>
  );
}
