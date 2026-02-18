import { Clock3, Download, Landmark, ShieldCheck, WalletCards, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";

const payoutRows = [
  { beneficiary: "Stats Business 29", bank: "BANDEC", amount: "US$ 1,860.00", status: "Completada", date: "2026-02-17" },
  { beneficiary: "Business 2", bank: "BPA", amount: "US$ 642.50", status: "En proceso", date: "2026-02-16" },
  { beneficiary: "Business 8", bank: "Metropolitano", amount: "US$ 210.00", status: "Rechazada", date: "2026-02-14" },
];

const statusTone = {
  Completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "En proceso": "bg-blue-50 text-blue-700 border-blue-200",
  Rechazada: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function NationalPayouts() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-[#0B3A9E] via-[#1D4ED8] to-[#3B82F6] p-8 md:p-10 text-white shadow-[0_20px_80px_-35px_rgba(59,130,246,0.65)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-100 mb-4">
                <WalletCards className="w-4 h-4" />
                Payouts nacionales
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Payouts nacionales</h1>
              <p className="text-blue-100 text-lg max-w-xl mb-6">
                Ejecuta transferencias nacionales con gestión de cuentas bancarias locales, controles de extracción
                y trazabilidad completa por estado.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2.5 font-semibold hover:bg-blue-50"
                >
                  Entrar al dashboard
                </button>
                <a
                  href="#cuentas-bancarias"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  Ver gestión
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-blue-100 mb-4">Infraestructura local conectada</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-blue-100 mt-1">Bancos nacionales</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">1-3 días</p>
                  <p className="text-xs text-blue-100 mt-1">Tiempo de extracción</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-blue-100 mb-2">Flujo completo incluido:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Añadir cuenta bancaria</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Extraer fondos</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">Exportación PDF/CSV/XLSX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cuentas-bancarias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid lg:grid-cols-2 gap-4">
          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-3xl font-semibold text-slate-900 mb-2">Añadir cuenta bancaria</h3>
            <p className="text-slate-600 mb-5">Introduce los datos de la cuenta bancaria donde recibirás tus fondos.</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-700 mb-1">Nombre del banco</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">BANDEC</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">Moneda del banco</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">USD</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">Número de cuenta</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">1234 5678 1234 5678</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">Número de identificación del representante</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">04081160106</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">Nombre del representante</p>
                <div className="rounded-lg border border-indigo-400 bg-white px-3 py-2 text-slate-800">Guillermo Hughes</div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700">Cancelar</button>
                <button className="rounded-lg bg-[#5b5df0] hover:bg-[#4f51d6] text-white px-4 py-2">Guardar cuenta</button>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-3xl font-semibold text-slate-900 mb-2">Extraer fondos</h3>
            <p className="text-slate-600 mb-5">Gestiona extracciones de forma controlada hacia cuentas nacionales vinculadas.</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-700 mb-1">Importe</p>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                  <span className="text-slate-900 font-medium">US$ 0.00</span>
                  <span className="text-[#5b5df0] text-sm font-semibold">USAR MÁXIMO</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Máximo disponible: 1000.00</p>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">Enviar a</p>
                <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/40 px-3 py-3 text-[#5b5df0] text-sm font-medium">
                  + Añadir cuenta bancaria
                </div>
              </div>
              <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                Las extracciones tardan de 1 a 3 días hábiles.
              </p>
              <div className="pt-2 flex justify-end">
                <button className="rounded-lg bg-[#5b5df0] hover:bg-[#4f51d6] text-white px-5 py-2">Extraer fondos</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">Monitoreo operativo</p>
              <h2 className="text-4xl font-semibold text-slate-900">Payouts recientes</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100 inline-flex items-center gap-1">
                <Landmark className="w-4 h-4" />
                BANDEC
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100">BPA</span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100">Metropolitano</span>
            </div>
          </div>

          <div className="flex justify-end mb-3">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar toda la información
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">Exportación completa disponible en PDF, CSV y XLSX.</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Beneficiario</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Banco</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Importe</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows.map((row) => (
                  <tr key={`${row.beneficiary}-${row.date}`} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/20">
                    <td className="px-6 py-5 text-slate-900 font-medium">{row.beneficiary}</td>
                    <td className="px-6 py-5 text-slate-700">{row.bank}</td>
                    <td className="px-6 py-5 text-slate-900 font-semibold">{row.amount}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-sm border ${statusTone[row.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-700">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 mb-1">Promoción Dashboard</p>
            <h4 className="text-xl font-semibold text-slate-900">Lleva tus payouts nacionales a operación profesional</h4>
            <p className="text-slate-600 text-sm mt-1">Gestiona cuentas bancarias, extracciones y estados desde una sola consola.</p>
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
            <ShieldCheck className="w-4 h-4" />
            Hablar con ventas
          </Button>
        </div>
      </section>
    </div>
  );
}
