import { motion } from "framer-motion";
import {
  Coffee,
  Fuel,
  Home,
  Landmark,
  ShoppingCart,
  Store,
  Truck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/i18n/LanguageContext";

const sectorMeta = [
  { key: "SolutionPymes", icon: Store, color: "from-blue-500 to-indigo-600" },
  { key: "SolutionRetail", icon: ShoppingCart, color: "from-cyan-500 to-blue-600" },
  { key: "SolutionTransporte", icon: Truck, color: "from-sky-500 to-cyan-600" },
  { key: "SolutionHosteleriaOcio", icon: Coffee, color: "from-violet-500 to-fuchsia-600" },
  { key: "SolutionVending", icon: Zap, color: "from-emerald-500 to-teal-600" },
  { key: "SolutionEnergia", icon: Fuel, color: "from-lime-500 to-green-600" },
  { key: "SolutionServiciosHogar", icon: Home, color: "from-amber-500 to-orange-600" },
  { key: "SolutionBancos", icon: Landmark, color: "from-indigo-600 to-blue-700" },
];

const copyByLanguage = {
  es: {
    eyebrow: "Soluciones",
    title: "Soluciones por sector para operar con más control",
    description:
      "Explora páginas especializadas por industria con enfoque comercial, flujos operativos y módulos del dashboard vinculados para implementación real.",
    cta: "Ver solución",
    cards: {
      SolutionPymes: {
        name: "Pymes",
        description: "Cobros ágiles, control de saldo y trazabilidad por cliente para crecer con orden.",
      },
      SolutionRetail: {
        name: "Retail",
        description: "Unifica punto de venta y cobros digitales con seguimiento operativo en tiempo real.",
      },
      SolutionTransporte: {
        name: "Transporte",
        description: "Gestiona cobros frecuentes y salidas de fondos con visibilidad financiera completa.",
      },
      SolutionHosteleriaOcio: {
        name: "Hostelería y Ocio",
        description: "Checkout rápido para huéspedes y control centralizado por cliente y operación.",
      },
      SolutionVending: {
        name: "Vending",
        description: "Automatiza cobros de alto volumen y optimiza la gestión de tu red de puntos.",
      },
      SolutionEnergia: {
        name: "Energía",
        description: "Ordena ciclos de cobranza y exporta información para control financiero y operativo.",
      },
      SolutionServiciosHogar: {
        name: "Servicios del Hogar",
        description: "Cobra por servicio o suscripción con seguimiento comercial por cliente.",
      },
      SolutionBancos: {
        name: "Soluciones para Bancos",
        description: "Escala servicios transaccionales con trazabilidad, saldo y payouts nacionales.",
      },
    },
  },
  en: {
    eyebrow: "Solutions",
    title: "Industry solutions to operate with greater control",
    description:
      "Explore specialized pages by industry with a commercial focus, operational flows, and dashboard modules ready for real implementation.",
    cta: "View solution",
    cards: {
      SolutionPymes: {
        name: "SMBs",
        description: "Agile collections, balance control, and customer traceability to grow with structure.",
      },
      SolutionRetail: {
        name: "Retail",
        description: "Unify point-of-sale and digital collections with real-time operational tracking.",
      },
      SolutionTransporte: {
        name: "Transport",
        description: "Manage frequent collections and outgoing funds with full financial visibility.",
      },
      SolutionHosteleriaOcio: {
        name: "Hospitality and Leisure",
        description: "Fast guest checkout and centralized control by customer and operation.",
      },
      SolutionVending: {
        name: "Vending",
        description: "Automate high-volume collections and optimize your network operations.",
      },
      SolutionEnergia: {
        name: "Energy",
        description: "Organize billing cycles and export data for financial and operational control.",
      },
      SolutionServiciosHogar: {
        name: "Home Services",
        description: "Charge per service or subscription with customer-level commercial tracking.",
      },
      SolutionBancos: {
        name: "Solutions for Banks",
        description: "Scale transactional services with traceability, balance, and domestic payouts.",
      },
    },
  },
  "zh-Hans": {
    eyebrow: "解决方案",
    title: "按行业打造，运营更可控",
    description:
      "按行业查看专项页面，聚焦商业目标、运营流程与可落地的仪表盘模块。",
    cta: "查看方案",
    cards: {
      SolutionPymes: {
        name: "中小企业",
        description: "通过高效收款、余额管理和客户追踪，实现有序增长。",
      },
      SolutionRetail: {
        name: "零售",
        description: "打通门店与数字收款，实时追踪运营表现。",
      },
      SolutionTransporte: {
        name: "运输",
        description: "管理高频收款与资金支出，获得完整财务可视化。",
      },
      SolutionHosteleriaOcio: {
        name: "酒店与休闲",
        description: "更快结账体验，按客户与业务集中管理。",
      },
      SolutionVending: {
        name: "自动售货",
        description: "自动化高频收款，优化点位网络运营。",
      },
      SolutionEnergia: {
        name: "能源",
        description: "规范收费周期并导出数据，强化财务与运营控制。",
      },
      SolutionServiciosHogar: {
        name: "家政服务",
        description: "支持按服务或订阅收费，并进行客户级追踪。",
      },
      SolutionBancos: {
        name: "银行方案",
        description: "通过追踪、余额与国内出款，扩展交易服务能力。",
      },
    },
  },
};

export default function Solutions() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const sectorCards = sectorMeta.map((item) => ({
    ...item,
    ...copy.cards[item.key],
  }));

  return (
    <div className="min-h-screen bg-[#f6f8fc] pt-28 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">{copy.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {copy.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            {copy.description}
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {sectorCards.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.article
                key={sector.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sector.color} text-white flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{sector.name}</h2>
                <p className="text-sm text-slate-600 mb-4">{sector.description}</p>
                <Link to={createPageUrl(sector.key)} className="text-sm font-semibold text-[#5b5df0] hover:underline">
                  {copy.cta}
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
