import { Clock3, Download, Landmark, ShieldCheck, WalletCards, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";
import { useLanguage } from "@/components/i18n/LanguageContext";

const payoutRows = [
  { beneficiary: "Stats Business 29", bank: "BANDEC", amount: "US$ 1,860.00", status: "completed", date: "2026-02-17" },
  { beneficiary: "Business 2", bank: "BPA", amount: "US$ 642.50", status: "inProgress", date: "2026-02-16" },
  { beneficiary: "Business 8", bank: "Metropolitano", amount: "US$ 210.00", status: "rejected", date: "2026-02-14" },
];

const statusTone = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inProgress: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const copyByLanguage = {
  es: {
    badge: "Payouts nacionales",
    title: "Payouts nacionales",
    heroDescription:
      "Ejecuta transferencias nacionales con gestion de cuentas bancarias locales, controles de extraccion y trazabilidad completa por estado.",
    enterDashboard: "Entrar al dashboard",
    viewManagement: "Ver gestion",
    infraTitle: "Infraestructura local conectada",
    nationalBanks: "Bancos nacionales",
    extractionTime: "Tiempo de extraccion",
    flowIncluded: "Flujo completo incluido:",
    chipAddBank: "Anadir cuenta bancaria",
    chipWithdraw: "Extraer fondos",
    chipExport: "Exportacion PDF/CSV/XLSX",
    addBankTitle: "Anadir cuenta bancaria",
    addBankDesc: "Introduce los datos de la cuenta bancaria donde recibiras tus fondos.",
    bankName: "Nombre del banco",
    bankCurrency: "Moneda del banco",
    accountNumber: "Numero de cuenta",
    representativeId: "Numero de identificacion del representante",
    representativeName: "Nombre del representante",
    cancel: "Cancelar",
    saveAccount: "Guardar cuenta",
    withdrawTitle: "Extraer fondos",
    withdrawDesc: "Gestiona extracciones de forma controlada hacia cuentas nacionales vinculadas.",
    amount: "Importe",
    useMax: "USAR MAXIMO",
    maxAvailable: "Maximo disponible: 1000.00",
    sendTo: "Enviar a",
    addBankAction: "+ Anadir cuenta bancaria",
    extractionDelay: "Las extracciones tardan de 1 a 3 dias habiles.",
    withdrawFunds: "Extraer fondos",
    operationalMonitoring: "Monitoreo operativo",
    recentTitle: "Payouts recientes",
    exportAll: "Exportar toda la informacion",
    exportHint: "Exportacion completa disponible en PDF, CSV y XLSX.",
    tableBeneficiary: "Beneficiario",
    tableBank: "Banco",
    tableAmount: "Importe",
    tableStatus: "Estado",
    tableDate: "Fecha",
    status: { completed: "Completada", inProgress: "En proceso", rejected: "Rechazada" },
    promoBadge: "Promocion Dashboard",
    promoTitle: "Lleva tus payouts nacionales a operacion profesional",
    promoDesc: "Gestiona cuentas bancarias, extracciones y estados desde una sola consola.",
    signIn: "Iniciar sesion",
    contactSales: "Hablar con ventas",
  },
  en: {
    badge: "National payouts",
    title: "National payouts",
    heroDescription:
      "Execute domestic transfers with local bank account management, withdrawal controls, and full status traceability.",
    enterDashboard: "Enter dashboard",
    viewManagement: "View management",
    infraTitle: "Connected local infrastructure",
    nationalBanks: "National banks",
    extractionTime: "Withdrawal time",
    flowIncluded: "Complete flow included:",
    chipAddBank: "Add bank account",
    chipWithdraw: "Withdraw funds",
    chipExport: "PDF/CSV/XLSX export",
    addBankTitle: "Add bank account",
    addBankDesc: "Enter the bank account details where you will receive your funds.",
    bankName: "Bank name",
    bankCurrency: "Bank currency",
    accountNumber: "Account number",
    representativeId: "Representative ID number",
    representativeName: "Representative name",
    cancel: "Cancel",
    saveAccount: "Save account",
    withdrawTitle: "Withdraw funds",
    withdrawDesc: "Manage controlled withdrawals to linked domestic accounts.",
    amount: "Amount",
    useMax: "USE MAX",
    maxAvailable: "Maximum available: 1000.00",
    sendTo: "Send to",
    addBankAction: "+ Add bank account",
    extractionDelay: "Withdrawals take 1 to 3 business days.",
    withdrawFunds: "Withdraw funds",
    operationalMonitoring: "Operational monitoring",
    recentTitle: "Recent payouts",
    exportAll: "Export all information",
    exportHint: "Full export available in PDF, CSV, and XLSX.",
    tableBeneficiary: "Beneficiary",
    tableBank: "Bank",
    tableAmount: "Amount",
    tableStatus: "Status",
    tableDate: "Date",
    status: { completed: "Completed", inProgress: "In progress", rejected: "Rejected" },
    promoBadge: "Dashboard promotion",
    promoTitle: "Take your national payouts to a professional operation",
    promoDesc: "Manage bank accounts, withdrawals, and statuses from one console.",
    signIn: "Sign in",
    contactSales: "Contact sales",
  },
};

export default function NationalPayouts() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

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
                {copy.badge}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{copy.title}</h1>
              <p className="text-blue-100 text-lg max-w-xl mb-6">{copy.heroDescription}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2.5 font-semibold hover:bg-blue-50"
                >
                  {copy.enterDashboard}
                </button>
                <a
                  href="#cuentas-bancarias"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-4 py-2.5 text-white hover:bg-white/10"
                >
                  {copy.viewManagement}
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-blue-100 mb-4">{copy.infraTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-blue-100 mt-1">{copy.nationalBanks}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15">
                  <p className="text-2xl font-bold">1-3 days</p>
                  <p className="text-xs text-blue-100 mt-1">{copy.extractionTime}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4 border border-white/15 col-span-2">
                  <p className="text-sm text-blue-100 mb-2">{copy.flowIncluded}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipAddBank}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipWithdraw}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/15">{copy.chipExport}</span>
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
            <h3 className="text-3xl font-semibold text-slate-900 mb-2">{copy.addBankTitle}</h3>
            <p className="text-slate-600 mb-5">{copy.addBankDesc}</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.bankName}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">BANDEC</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.bankCurrency}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">USD</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.accountNumber}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">1234 5678 1234 5678</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.representativeId}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">04081160106</div>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.representativeName}</p>
                <div className="rounded-lg border border-indigo-400 bg-white px-3 py-2 text-slate-800">Guillermo Hughes</div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700">{copy.cancel}</button>
                <button className="rounded-lg bg-[#5b5df0] hover:bg-[#4f51d6] text-white px-4 py-2">{copy.saveAccount}</button>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-3xl font-semibold text-slate-900 mb-2">{copy.withdrawTitle}</h3>
            <p className="text-slate-600 mb-5">{copy.withdrawDesc}</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.amount}</p>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between">
                  <span className="text-slate-900 font-medium">US$ 0.00</span>
                  <span className="text-[#5b5df0] text-sm font-semibold">{copy.useMax}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{copy.maxAvailable}</p>
              </div>
              <div>
                <p className="text-sm text-slate-700 mb-1">{copy.sendTo}</p>
                <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/40 px-3 py-3 text-[#5b5df0] text-sm font-medium">
                  {copy.addBankAction}
                </div>
              </div>
              <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                {copy.extractionDelay}
              </p>
              <div className="pt-2 flex justify-end">
                <button className="rounded-lg bg-[#5b5df0] hover:bg-[#4f51d6] text-white px-5 py-2">{copy.withdrawFunds}</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">{copy.operationalMonitoring}</p>
              <h2 className="text-4xl font-semibold text-slate-900">{copy.recentTitle}</h2>
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
              {copy.exportAll}
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">{copy.exportHint}</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableBeneficiary}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableBank}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableAmount}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableStatus}</th>
                  <th className="px-6 py-4 text-slate-700 font-semibold uppercase tracking-wide">{copy.tableDate}</th>
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
                        {copy.status[row.status]}
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
            <ShieldCheck className="w-4 h-4" />
            {copy.contactSales}
          </Button>
        </div>
      </section>
    </div>
  );
}
