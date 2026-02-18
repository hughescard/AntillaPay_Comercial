import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Code,
  CreditCard,
  DollarSign,
  Link2,
  Package,
  Users,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const productIcons = {
  cobros: CreditCard,
  saldos: DollarSign,
  clientes: Users,
  catalogo: Package,
  payment_links: Link2,
  transferencias: ArrowLeftRight,
  dev: Code,
};

const productGradients = {
  cobros: 'from-blue-500 to-indigo-600',
  saldos: 'from-emerald-500 to-teal-600',
  clientes: 'from-cyan-500 to-sky-600',
  catalogo: 'from-amber-500 to-orange-600',
  payment_links: 'from-violet-500 to-purple-600',
  transferencias: 'from-teal-500 to-emerald-600',
  dev: 'from-slate-600 to-gray-800',
};

const copyByLanguage = {
  es: {
    title: 'Funcionalidades del dashboard',
    subtitle: 'Todo lo que necesitas para operar cobros y clientes desde un solo lugar',
    prevLabel: 'Anterior',
    nextLabel: 'Siguiente',
    products: [
      { id: 'cobros', name: 'Cobros', desc: 'Monitorea cada pago, su estado y su historial desde el dashboard.', features: ['Estados claros', 'Filtros por fecha', 'Detalle por transaccion'] },
      { id: 'saldos', name: 'Saldos', desc: 'Consulta saldo disponible y movimientos con un resumen claro.', features: ['Balance disponible', 'Resumen diario', 'Acceso rapido a reportes'] },
      { id: 'clientes', name: 'Clientes', desc: 'Organiza tu base de clientes y su historial de pagos.', features: ['Ficha completa', 'Historial de pagos', 'Busqueda rapida'] },
      { id: 'catalogo', name: 'Catalogo', desc: 'Crea productos y precios listos para usar en Payment Links.', features: ['Precios y monedas', 'Estados activo/inactivo', 'Catalogo ordenado'] },
      { id: 'payment_links', name: 'Payment Links', desc: 'Genera enlaces de pago y compartelos en segundos.', features: ['Enlaces compartibles', 'Cobros sin codigo', 'Seguimiento del estado'] },
      { id: 'transferencias', name: 'Transferencias', desc: 'Administra salidas de fondos y seguimiento de transferencias.', features: ['Estatus en tiempo real', 'Historial completo', 'Detalle por destinatario'] },
      { id: 'dev', name: 'Desarrolladores', desc: 'Gestiona webhooks, logs y claves API desde el dashboard.', features: ['Webhooks activos', 'Registros de eventos', 'Claves API seguras'] },
    ],
  },
  en: {
    title: 'Dashboard capabilities',
    subtitle: 'Everything you need to run collections and customers from one place',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    products: [
      { id: 'cobros', name: 'Payments', desc: 'Monitor every payment, status, and history from the dashboard.', features: ['Clear statuses', 'Date filters', 'Transaction detail'] },
      { id: 'saldos', name: 'Balances', desc: 'Check available balance and movements with a clear summary.', features: ['Available balance', 'Daily summary', 'Fast access to reports'] },
      { id: 'clientes', name: 'Customers', desc: 'Organize your customer base and payment history.', features: ['Complete profile', 'Payment history', 'Fast search'] },
      { id: 'catalogo', name: 'Catalog', desc: 'Create products and prices ready to use in Payment Links.', features: ['Prices and currencies', 'Active/inactive status', 'Organized catalog'] },
      { id: 'payment_links', name: 'Payment Links', desc: 'Generate payment links and share them in seconds.', features: ['Shareable links', 'No-code collections', 'Status tracking'] },
      { id: 'transferencias', name: 'Transfers', desc: 'Manage fund outflows and transfer tracking.', features: ['Real-time status', 'Full history', 'Recipient-level detail'] },
      { id: 'dev', name: 'Developers', desc: 'Manage webhooks, logs, and API keys from the dashboard.', features: ['Active webhooks', 'Event logs', 'Secure API keys'] },
    ],
  },
};

export default function ProductsCarousel() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleCards = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, copy.products.length - visibleCards);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center w-full max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{copy.title}</h2>
            <p className="text-xl text-gray-600">{copy.subtitle}</p>
          </motion.div>

          <div className="flex gap-2 mt-8 justify-center">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label={copy.prevLabel}
            >
              <ChevronLeft className="w-4 h-4 text-violet-600" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label={copy.nextLabel}
            >
              <ChevronRight className="w-4 h-4 text-violet-600" />
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <div className="w-full overflow-hidden pt-2">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / (isMobile ? 1 : visibleCards))}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex w-full"
            >
              {copy.products.map((product) => {
                const Icon = productIcons[product.id];

                const gradientColors = {
                  'from-blue-500 to-indigo-600': 'rgb(99, 102, 241)',
                  'from-amber-500 to-orange-600': 'rgb(245, 158, 11)',
                  'from-emerald-500 to-green-600': 'rgb(16, 185, 129)',
                  'from-emerald-500 to-teal-600': 'rgb(20, 184, 166)',
                  'from-cyan-500 to-sky-600': 'rgb(6, 182, 212)',
                  'from-purple-500 to-pink-600': 'rgb(168, 85, 247)',
                  'from-teal-500 to-cyan-600': 'rgb(20, 184, 166)',
                  'from-teal-500 to-emerald-600': 'rgb(16, 185, 129)',
                  'from-slate-600 to-gray-800': 'rgb(71, 85, 105)',
                  'from-violet-500 to-purple-600': 'rgb(139, 92, 246)',
                };

                const gradient = productGradients[product.id];
                const borderColor = gradientColors[gradient] || 'rgb(139, 92, 246)';

                return (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 px-2 md:px-0"
                    style={{ width: `calc(100% / ${visibleCards})` }}
                  >
                    <div
                      className={`
                        relative h-full bg-white rounded-2xl border border-gray-200 shadow-lg
                        transition-all duration-300 overflow-hidden flex flex-col transform-gpu
                        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] mx-3
                      `}
                      style={{ minHeight: '320px' }}
                    >
                      <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl" style={{ backgroundColor: borderColor }} />
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{product.name}</h3>

                        <p className="text-gray-600 text-sm leading-relaxed flex-1 text-center">{product.desc}</p>

                        <ul className="space-y-2 mt-4">
                          {product.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-lg bg-gray-300 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-lg transition-all ${
                  i === currentIndex ? 'w-8 bg-violet-600' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
