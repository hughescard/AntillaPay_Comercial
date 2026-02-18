import { BarChart3, Download, TrendingUp, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";

const extractionRows = [
  { date: "2026-02-14", amount: "0.90 USD", status: "Rechazada" },
  { date: "2026-02-11", amount: "540.00 USD", status: "Completada" },
  { date: "2026-02-08", amount: "120.00 USD", status: "Completada" },
];

const statusTone = {
  Completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rechazada: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function BalanceManagement() {
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
                Dashboard de saldo
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Gestiona tu saldo</h1>
              <p className="text-emerald-100 text-lg max-w-xl mb-6">
                Controla liquidez en tiempo real, visualiza fondos entrantes y disponibles, y sigue el estado de cada
                extracción desde una vista financiera clara.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-emerald-700 px-4 py-2.5 font-semibold hover:bg-emerald-50"
                >
                  Entrar al dashboard
                </button>
                <a
                  href="#saldo-operativo"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  Ver saldo
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-emerald-100 mb-4">KPIs de operación financiera</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">US$ 1,000</p>
                  <p className="text-xs text-emerald-100 mt-1">Saldo disponible</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-xs text-emerald-100 mt-1">Visibilidad operativa</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-emerald-100 mb-2">Integrado con extracciones y trazabilidad contable:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Estado en vivo</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Exportación PDF/CSV/XLSX</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Alertas de saldo</span>
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
            <h3 className="font-semibold text-slate-900 mb-1">Saldo consolidado</h3>
            <p className="text-sm text-slate-600">Vista centralizada de fondos disponibles y entrantes por moneda.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Seguimiento de extracciones</h3>
            <p className="text-sm text-slate-600">Controla cada extracción y detecta incidencias en minutos.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Decisiones con contexto</h3>
            <p className="text-sm text-slate-600">Conecta liquidez, operación y reporting financiero en una sola pantalla.</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article id="saldo-operativo" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-5xl font-semibold text-slate-900">Saldo 1,000.00 USD</h2>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                Extraer
              </button>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-4">
              <div className="h-full w-full bg-[#5b5df0]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-slate-700">
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />Entrante</span>
                <span className="font-medium">0.00 USD</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#5b5df0]" />Disponible</span>
                <span className="font-semibold">1,000.00 USD</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="border-b border-slate-200 mb-4">
              <button className="pb-3 text-lg font-medium text-[#5b5df0] border-b-2 border-[#5b5df0]">Extracciones</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Puedes exportar toda la información en PDF, CSV o XLSX.</p>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  + Fecha de creación
                </button>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50">
                  + Estado
                </button>
              </div>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar toda la información
              </button>
            </div>

            <p className="text-slate-600 mb-3">Mostrando 1 pagos</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Fecha</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Importe</th>
                    <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {extractionRows.map((row) => (
                    <tr key={`${row.date}-${row.amount}`} className="border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/20">
                      <td className="px-6 py-5 text-slate-700">{row.date}</td>
                      <td className="px-6 py-5 text-slate-900 font-semibold">{row.amount}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-sm border ${statusTone[row.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                          {row.status}
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
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 mb-1">Promoción Dashboard</p>
            <h4 className="text-xl font-semibold text-slate-900">Gestiona liquidez con control total del saldo</h4>
            <p className="text-slate-600 text-sm mt-1">Monitorea disponibilidad y estado de extracciones en una sola vista.</p>
          </div>
          <button
            type="button"
            onClick={redirectToLogin}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:opacity-90"
          >
            <Zap className="w-4 h-4" />
            Iniciar sesión
          </button>
          <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))}>
            Hablar con ventas
          </Button>
        </div>
      </section>
    </div>
  );
}
