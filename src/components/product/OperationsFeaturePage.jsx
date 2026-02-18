import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { redirectToLogin } from "@/shared/auth/loginRedirect";

const STATUS_STYLES = {
  success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border border-amber-200",
  progress: "bg-blue-100 text-blue-700 border border-blue-200",
  danger: "bg-rose-100 text-rose-700 border border-rose-200",
};

const getStatusTone = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("aprob") || value.includes("complet") || value.includes("public")) return "success";
  if (value.includes("proceso") || value.includes("concili") || value.includes("program")) return "progress";
  if (value.includes("revisión") || value.includes("revision") || value.includes("pendiente")) return "warning";
  if (value.includes("fall") || value.includes("rechaz")) return "danger";
  return "progress";
};

function hexToRgba(hex, alpha) {
  const safe = String(hex || "#635BFF").replace("#", "");
  const full = safe.length === 3 ? safe.split("").map((c) => c + c).join("") : safe;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function OperationsFeaturePage({
  eyebrow,
  title,
  subtitle,
  accentColor,
  previewImage,
  previewAlt,
  metrics,
  highlights,
  flow,
  operations,
}) {
  const accentSoft = hexToRgba(accentColor, 0.14);
  const accentBorder = hexToRgba(accentColor, 0.28);

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="text-xs tracking-[0.18em] uppercase text-gray-500 mb-4">{eyebrow}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">{title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
          >
            <img src={previewImage} alt={previewAlt} className="w-full h-auto" loading="lazy" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 content-start">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-xl border p-4"
                  style={{ backgroundColor: accentSoft, borderColor: accentBorder }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: hexToRgba(accentColor, 0.2) }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <p className="text-3xl font-bold mb-1" style={{ color: accentColor }}>
                {metric.value}
              </p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Operaciones recientes</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[760px] bg-white text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600">Operación</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Detalle</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Importe</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Estado</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Actualización</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((row) => (
                  <tr key={row.operation} className="border-b border-gray-100 last:border-b-0">
                    <td className="p-3 font-medium text-gray-900">{row.operation}</td>
                    <td className="p-3 text-gray-600">{row.counterparty}</td>
                    <td className="p-3 font-medium text-gray-900">{row.amount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[getStatusTone(row.status)]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{row.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Flujo operativo</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {flow.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-gray-200 p-5 bg-white">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold mb-3"
                  style={{ backgroundColor: hexToRgba(accentColor, 0.2), color: accentColor }}
                >
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={redirectToLogin}
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <Button variant="outline" onClick={() => (window.location.href = createPageUrl("Contact"))}>
              Hablar con ventas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
