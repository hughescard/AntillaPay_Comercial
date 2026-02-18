import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";
import { useLanguage } from "@/components/i18n/LanguageContext";

const isExternalUrl = (href) => typeof href === "string" && /^https?:\/\//i.test(href);

const accentById = Object.freeze({
  pymes: {
    gradient: "from-indigo-600 via-violet-600 to-blue-600",
    soft: "from-indigo-50 via-violet-50 to-blue-50",
    border: "border-indigo-200",
    chip: "bg-indigo-100 text-indigo-700",
  },
  retail: {
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    soft: "from-cyan-50 via-blue-50 to-indigo-50",
    border: "border-cyan-200",
    chip: "bg-cyan-100 text-cyan-700",
  },
  transporte: {
    gradient: "from-sky-600 via-cyan-600 to-blue-600",
    soft: "from-sky-50 via-cyan-50 to-blue-50",
    border: "border-sky-200",
    chip: "bg-sky-100 text-sky-700",
  },
  "hosteleria-ocio": {
    gradient: "from-fuchsia-600 via-violet-600 to-indigo-600",
    soft: "from-fuchsia-50 via-violet-50 to-indigo-50",
    border: "border-fuchsia-200",
    chip: "bg-fuchsia-100 text-fuchsia-700",
  },
  vending: {
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    soft: "from-emerald-50 via-teal-50 to-cyan-50",
    border: "border-emerald-200",
    chip: "bg-emerald-100 text-emerald-700",
  },
  energia: {
    gradient: "from-lime-600 via-emerald-600 to-green-600",
    soft: "from-lime-50 via-emerald-50 to-green-50",
    border: "border-lime-200",
    chip: "bg-lime-100 text-lime-700",
  },
  "servicios-hogar": {
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    soft: "from-amber-50 via-orange-50 to-rose-50",
    border: "border-amber-200",
    chip: "bg-amber-100 text-amber-700",
  },
  bancos: {
    gradient: "from-blue-700 via-indigo-700 to-slate-800",
    soft: "from-blue-50 via-indigo-50 to-slate-50",
    border: "border-blue-200",
    chip: "bg-blue-100 text-blue-700",
  },
});

export default function SectorSolutionPage({ solution }) {
  const { language } = useLanguage();
  const accent = accentById[solution.id] || accentById.pymes;
  const uiCopyByLanguage = {
    es: {
      backToSolutions: "Volver a soluciones",
      signIn: "Iniciar sesion",
      contactSales: "Hablar con ventas",
      impactTitle: "Impacto esperado en este sector",
      modulesTitle: "Modulos recomendados del dashboard",
      directLink: "Vinculacion directa",
      goToModule: "Ir al modulo",
      flowTitle: "Flujo operativo sugerido",
      traceabilityNote: "Todas las soluciones incluyen trazabilidad y exportacion documental para control operativo.",
      designImplementation: "Disenar implementacion",
    },
    en: {
      backToSolutions: "Back to solutions",
      signIn: "Sign in",
      contactSales: "Contact sales",
      impactTitle: "Expected impact in this sector",
      modulesTitle: "Recommended dashboard modules",
      directLink: "Direct integration",
      goToModule: "Go to module",
      flowTitle: "Suggested operating flow",
      traceabilityNote: "All solutions include traceability and document export for operational control.",
      designImplementation: "Design implementation",
    },
  };
  const copy = uiCopyByLanguage[language] || uiCopyByLanguage.en;

  return (
    <div className="min-h-screen bg-[#f6f8fc] pt-24 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to={createPageUrl("Solutions")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {copy.backToSolutions}
        </Link>

        <div className={`relative overflow-hidden rounded-3xl border ${accent.border} bg-gradient-to-br ${accent.gradient} p-8 md:p-10 text-white shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)]`}>
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/80 mb-4">
                {solution.badge}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{solution.title}</h1>
              <p className="text-white/90 text-lg max-w-xl mb-5">{solution.subtitle}</p>
              <p className="text-sm text-white/75 mb-6">{solution.audience}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={redirectToLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2.5 font-semibold hover:bg-slate-100"
                >
                  {copy.signIn}
                </button>
                <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))} className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  {copy.contactSales}
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 md:p-6">
              <p className="text-sm text-white/85 mb-4">{copy.impactTitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {solution.stats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 p-4 border border-white/15">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-white/80 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <article className={`rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.soft} p-6`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{copy.modulesTitle}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accent.chip}`}>{copy.directLink}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {solution.modules.map((module) => (
              <div key={module.name} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900 mb-1">{module.name}</p>
                <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                {isExternalUrl(module.href) ? (
                  <a
                    href={module.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#5b5df0] hover:underline"
                  >
                    {copy.goToModule}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link to={module.href} className="inline-flex items-center gap-1 text-sm text-[#5b5df0] hover:underline">
                    {copy.goToModule}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          {solution.capabilities.map((capability) => (
            <article key={capability.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <capability.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{capability.title}</h3>
              <p className="text-sm text-slate-600">{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-5">{copy.flowTitle}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {solution.flow.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-700 mb-3">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700 inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {copy.traceabilityNote}
            </p>
            <Button onClick={() => (window.location.href = createPageUrl("Contact"))}>{copy.designImplementation}</Button>
          </div>
        </article>
      </section>
    </div>
  );
}
