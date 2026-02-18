import { ArrowLeft, BarChart3, Copy, Download, LayoutDashboard, MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, User, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";

const customers = [
  {
    name: "Stats Customer 29",
    email: "stats-customer-29@example.com",
    created: "2026-02-17",
    type: "Cliente",
    business: "Stats Business 29",
  },
  {
    name: "Customer 2",
    email: "customer2@example.com",
    created: "2026-02-17",
    type: "Cliente",
    business: "Business 2",
  },
  {
    name: "Customer 1",
    email: "customer1@example.com",
    created: "2026-02-17",
    type: "Cliente",
    business: "Business 1",
  },
  {
    name: "Stats Customer 14",
    email: "stats-customer-14@example.com",
    created: "2026-02-17",
    type: "Cliente",
    business: "Stats Business 14",
  },
];

const payments = [
  { date: "2026-02-09", amount: "4.64 USD", currency: "USD", status: "Completado" },
  { date: "2026-01-18", amount: "7.42 USD", currency: "USD", status: "Completado" },
  { date: "2025-12-28", amount: "15.00 USD", currency: "USD", status: "Completado" },
];

function SectionTitle({ children }) {
  return <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">{children}</h3>;
}

export default function CustomerTraceability() {
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
                Dashboard de clientes 360
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Trazabilidad por cliente</h1>
              <p className="text-indigo-100 text-lg max-w-xl mb-6">
                Convierte datos operativos en inteligencia comercial. Segmenta clientes, revisa historial de pagos y
                toma decisiones con contexto completo en una sola vista.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-4 py-2.5 font-semibold hover:bg-indigo-50"
                >
                  Entrar al dashboard
                </button>
                <a
                  href="#listado-clientes"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  Ver listado
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-indigo-100 mb-4">Valor comercial para equipos de operación y crecimiento</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">+32%</p>
                  <p className="text-xs text-indigo-100 mt-1">Resolución más rápida</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">360°</p>
                  <p className="text-xs text-indigo-100 mt-1">Vista del cliente</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-indigo-100 mb-2">Incluye funcionalidades clave:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Búsqueda avanzada</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Exportación PDF/CSV/XLSX</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Historial por cliente</span>
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
            <h3 className="font-semibold text-slate-900 mb-1">Segmentación por cliente</h3>
            <p className="text-sm text-slate-600">Filtra y monitorea clientes por tipo, fecha y comportamiento operativo.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Análisis orientado a crecimiento</h3>
            <p className="text-sm text-slate-600">Descubre recurrencia, valor promedio y tendencia de cada cuenta.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Trazas listas para auditoría</h3>
            <p className="text-sm text-slate-600">Consulta historial consolidado y exporta evidencia financiera con un clic.</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        <article id="listado-clientes" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Vista operativa</p>
            <h2 className="text-4xl font-semibold text-slate-900">Clientes</h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <SectionTitle>Panel de trazabilidad</SectionTitle>
            <Button className="bg-[#5b5df0] hover:bg-[#4f51d6] text-white shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo cliente
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="w-full lg:max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <span className="text-slate-500">Buscar</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  + Fecha de creación
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  + Tipo
                </button>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar toda la información
                </button>
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  Editar columnas
                </button>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-3">Mostrando 26 clientes</p>
          <p className="text-xs text-slate-500 mb-2">Puedes exportar la vista completa de clientes en PDF, CSV o XLSX.</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold">Nombre</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">Correo</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">Creado</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold">Empresa</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.email} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                    <td className="px-6 py-5 font-semibold text-slate-900">{customer.name}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.email}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.created}</td>
                    <td className="px-6 py-5 text-slate-700">{customer.type}</td>
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
            Clientes
          </a>

          <div className="flex flex-wrap items-start gap-5 mb-7">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
              <User className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">Ficha del cliente</p>
              <h4 className="text-4xl font-semibold text-slate-900 mb-2">Stats Customer 29</h4>
              <p className="text-xl text-slate-700">stats-customer-29@example.com</p>
              <p className="text-xl text-slate-500 mb-4">Stats Business 29</p>
              <div className="flex flex-wrap items-center gap-3 text-slate-500">
                <span>ID 02738d39-fffc-4088-b383-fd1abfa86479</span>
                <span>•</span>
                <span>Creado 2026-02-17</span>
                <button className="inline-flex items-center gap-1 text-[#5b5df0]">
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </button>
                <button className="inline-flex items-center gap-1 text-[#5b5df0]">
                  <Copy className="w-4 h-4" />
                  Copiar email
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 mb-6 bg-gradient-to-br from-white to-indigo-50/20">
            <h5 className="text-3xl font-semibold text-slate-900 mb-5">Información básica</h5>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">Nombre</p>
                <p className="text-slate-900 text-xl">Stats Customer 29</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">Email</p>
                <p className="text-slate-900 text-xl">stats-customer-29@example.com</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">Creado</p>
                <p className="text-slate-900 text-xl">2026-02-17</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">Tipo</p>
                <p className="text-slate-900 text-xl">Cliente</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h5 className="text-3xl font-semibold text-slate-900">Historial de pagos</h5>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar toda la información
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-[0.12em]">
                    <th className="py-3 font-medium">Fecha</th>
                    <th className="py-3 font-medium">Importe</th>
                    <th className="py-3 font-medium">Moneda</th>
                    <th className="py-3 font-medium">Estado</th>
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
                          {payment.status}
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
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 mb-1">Promoción Dashboard</p>
            <h4 className="text-xl font-semibold text-slate-900">Aprovecha la vista cliente 360 para vender mejor</h4>
            <p className="text-slate-600 text-sm mt-1">Consulta historial, exporta datos y toma decisiones con contexto real.</p>
          </div>
          <button
            type="button"
            onClick={redirectToLogin}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:opacity-90"
          >
            <Sparkles className="w-4 h-4" />
            Iniciar sesión
          </button>
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))} className="inline-flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Hablar con ventas
          </Button>
        </div>
      </section>
    </div>
  );
}
