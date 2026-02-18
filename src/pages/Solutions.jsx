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

const sectorCards = [
  {
    key: "SolutionPymes",
    name: "Pymes",
    description: "Cobros ágiles, control de saldo y trazabilidad por cliente para crecer con orden.",
    icon: Store,
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "SolutionRetail",
    name: "Retail",
    description: "Unifica punto de venta y cobros digitales con seguimiento operativo en tiempo real.",
    icon: ShoppingCart,
    color: "from-cyan-500 to-blue-600",
  },
  {
    key: "SolutionTransporte",
    name: "Transporte",
    description: "Gestiona cobros frecuentes y salidas de fondos con visibilidad financiera completa.",
    icon: Truck,
    color: "from-sky-500 to-cyan-600",
  },
  {
    key: "SolutionHosteleriaOcio",
    name: "Hostelería y Ocio",
    description: "Checkout rápido para huéspedes y control centralizado por cliente y operación.",
    icon: Coffee,
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    key: "SolutionVending",
    name: "Vending",
    description: "Automatiza cobros de alto volumen y optimiza la gestión de tu red de puntos.",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
  },
  {
    key: "SolutionEnergia",
    name: "Energía",
    description: "Ordena ciclos de cobranza y exporta información para control financiero y operativo.",
    icon: Fuel,
    color: "from-lime-500 to-green-600",
  },
  {
    key: "SolutionServiciosHogar",
    name: "Servicios del Hogar",
    description: "Cobra por servicio o suscripción con seguimiento comercial por cliente.",
    icon: Home,
    color: "from-amber-500 to-orange-600",
  },
  {
    key: "SolutionBancos",
    name: "Soluciones para Bancos",
    description: "Escala servicios transaccionales con trazabilidad, saldo y payouts nacionales.",
    icon: Landmark,
    color: "from-indigo-600 to-blue-700",
  },
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] pt-28 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Soluciones</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Soluciones por sector para operar con más control
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Explora páginas especializadas por industria con enfoque comercial, flujos operativos y módulos del dashboard
            vinculados para implementación real.
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
                  Ver solución
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

