import { useMemo, useState } from "react";
import { BarChart3, Bell, Download, Filter, LayoutDashboard, Search, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";

const paymentSources = Object.freeze({
  bank: {
    key: "bank",
    label: "Por Cuenta Bancaria",
    count: 46,
    rows: [
      { client: "customer0@example.com", date: "2025-10-20", amount: "1.50", status: "Pending", currency: "USD" },
      { client: "stats-customer-27@example.com", date: "2026-02-17", amount: "11.64", status: "Completed", currency: "USD" },
      { client: "stats-customer-19@example.com", date: "2026-02-15", amount: "9.30", status: "Completed", currency: "USD" },
      { client: "stats-customer-29@example.com", date: "2026-02-09", amount: "4.64", status: "Completed", currency: "USD" },
      { client: "stats-customer-32@example.com", date: "2026-02-09", amount: "0.85", status: "Completed", currency: "USD" },
      { client: "stats-customer-8@example.com", date: "2026-02-08", amount: "7.02", status: "Completed", currency: "USD" },
    ],
  },
  balance: {
    key: "balance",
    label: "Por Saldo Antilla",
    count: 23,
    rows: [
      { client: "business0@example.com", date: "2025-10-30", amount: "2.20", status: "Rejected", currency: "USD" },
      { client: "business9@example.com", date: "2026-02-12", amount: "3.58", status: "Completed", currency: "USD" },
      { client: "business8@example.com", date: "2026-02-04", amount: "8.93", status: "Completed", currency: "USD" },
      { client: "business5@example.com", date: "2026-02-03", amount: "5.45", status: "Completed", currency: "USD" },
      { client: "business3@example.com", date: "2026-02-01", amount: "14.64", status: "Completed", currency: "USD" },
      { client: "business1@example.com", date: "2026-01-31", amount: "5.00", status: "Completed", currency: "USD" },
    ],
  },
});

const statusTone = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function OperationsTraceability() {
  const [activeSource, setActiveSource] = useState("bank");
  const [query, setQuery] = useState("");
  const source = paymentSources[activeSource];

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return source.rows;
    return source.rows.filter(
      (row) =>
        row.client.toLowerCase().includes(normalized) ||
        row.status.toLowerCase().includes(normalized) ||
        row.date.includes(normalized),
    );
  }, [query, source.rows]);

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
                Dashboard oficial de cobros
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Trazabilidad de operaciones</h1>
              <p className="text-indigo-100 text-lg max-w-xl mb-6">
                Visualiza todo el ciclo de cobros desde una consola comercial: estados en vivo, segmentación por fuente de fondos y
                exportables para control operativo.
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
                  href="#consola-cobros"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  Ver consola
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-indigo-100 mb-4">Impacto esperado con la operación centralizada</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">+41%</p>
                  <p className="text-xs text-indigo-100 mt-1">Velocidad de auditoría</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">-28%</p>
                  <p className="text-xs text-indigo-100 mt-1">Incidencias operativas</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-indigo-100 mb-2">Incluye alertas y monitoreo continuo:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Alertas por estado</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Exportación PDF/CSV/XLSX</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Seguimiento por cliente</span>
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
            <h3 className="font-semibold text-slate-900 mb-1">Lectura comercial en tiempo real</h3>
            <p className="text-sm text-slate-600">Monitorea conversiones y montos por fuente sin esperar cierres manuales.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Alertas que previenen pérdidas</h3>
            <p className="text-sm text-slate-600">Detecta pendientes y rechazados de forma temprana con foco en continuidad.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Control para finanzas y riesgo</h3>
            <p className="text-sm text-slate-600">Trazas exportables para conciliación, auditoría y seguimiento operativo.</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article id="consola-cobros" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Vista operativa</p>
            <h2 className="text-4xl font-semibold text-slate-900 mb-1">Cobros</h2>
            <p className="text-slate-600 mb-6">Filtra por origen de fondos y revisa el estado de cada transacción al instante.</p>
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
                  {item.label}
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
                placeholder="Buscar cliente, estado o fecha"
                className="w-full text-slate-700 placeholder:text-slate-500 bg-transparent outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Fecha de creación
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Estado
                </button>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar toda la información
              </button>
            </div>
          </div>

          <div className="px-6 pb-6">
            <p className="text-xs text-slate-500 mb-2">Formatos disponibles: PDF, CSV y XLSX.</p>
            <p className="text-slate-600 mb-3">
              Mostrando {query ? `${filteredRows.length} de ${source.count}` : source.count} pagos
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Cliente</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Fecha</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Importe</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Moneda</th>
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
                        {row.status}
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
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 mb-1">Promoción Dashboard</p>
            <h4 className="text-xl font-semibold text-slate-900">Activa trazabilidad completa y acelera tu operación</h4>
            <p className="text-slate-600 text-sm mt-1">Alertas, filtros avanzados y exportación lista para finanzas en una sola consola.</p>
          </div>
          <button
            type="button"
            onClick={redirectToLogin}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:opacity-90"
          >
            <Zap className="w-4 h-4" />
            Iniciar sesión
          </button>
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))} className="inline-flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Hablar con ventas
          </Button>
        </div>
      </section>
    </div>
  );
}
