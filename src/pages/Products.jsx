import { motion } from 'framer-motion';
import {
  CreditCard, Receipt, Share2, Calculator,
  Wallet, Building2, TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';

const productIcons = {
  payments: CreditCard,
  billing: Receipt,
  connect: Share2,
  tax: Calculator,
  issuing: Wallet,
  treasury: Building2,
  capital: TrendingUp,
};

const gradients = {
  payments: 'from-blue-500 to-indigo-600',
  billing: 'from-purple-500 to-pink-600',
  connect: 'from-teal-500 to-cyan-600',
  tax: 'from-amber-500 to-orange-600',
  issuing: 'from-emerald-500 to-green-600',
  treasury: 'from-slate-600 to-gray-800',
  capital: 'from-violet-500 to-purple-600',
};

const copyByLanguage = {
  es: {
    title: 'Productos Antilla Pay',
    subtitle: 'Una suite completa de productos financieros y de pagos para impulsar tu negocio',
    products: [
      {
        id: 'payments',
        name: 'AntillaPay Payments',
        desc: 'Acepta pagos en toda Cuba con tarjetas, billeteras digitales y metodos de pago locales.',
        features: ['100+ metodos de pago', 'Pagos internacionales', 'Optimizacion de conversion'],
      },
      {
        id: 'billing',
        name: 'AntillaPay Billing',
        desc: 'Gestiona suscripciones y facturacion recurrente con modelos de precios flexibles.',
        features: ['Suscripciones recurrentes', 'Precios por uso', 'Portal de clientes', 'Recuperacion de pagos'],
      },
      {
        id: 'connect',
        name: 'AntillaPay Connect',
        desc: 'Pagos para plataformas y marketplaces con splits automaticos y onboarding de vendedores.',
        features: ['Pagos multi-parte', 'Onboarding KYC', 'Transferencias instantaneas', 'Reportes consolidados'],
      },
      {
        id: 'tax',
        name: 'AntillaPay Tax',
        desc: 'Automatiza el calculo, recoleccion y reporteo de impuestos en toda Cuba.',
        features: ['Calculo automatico', 'Cumplimiento global', 'Integracion con Billing', 'Reportes fiscales'],
      },
      {
        id: 'issuing',
        name: 'AntillaPay Issuing',
        desc: 'Crea tarjetas clasicas y tropicales para tu negocio o plataforma.',
        features: ['Tarjetas virtuales', 'Tarjetas fisicas', 'Control de gastos'],
      },
      {
        id: 'treasury',
        name: 'AntillaPay Treasury',
        desc: 'Banca como servicio para integrar cuentas y pagos en tu producto.',
        features: ['Cuentas bancarias', 'ACH y transferencias', 'Gestion de fondos', 'API unificada'],
      },
      {
        id: 'capital',
        name: 'AntillaPay Capital',
        desc: 'Acceso a financiamiento flexible basado en tu volumen de ventas.',
        features: ['Pre-aprobacion automatica', 'Pagos flexibles', 'Sin garantias', 'Fondos en 24h'],
      },
    ],
  },
  en: {
    title: 'AntillaPay Products',
    subtitle: 'A complete suite of financial and payment products to scale your business',
    products: [
      {
        id: 'payments',
        name: 'AntillaPay Payments',
        desc: 'Accept payments across Cuba with cards, digital wallets, and local payment methods.',
        features: ['100+ payment methods', 'International payments', 'Conversion optimization'],
      },
      {
        id: 'billing',
        name: 'AntillaPay Billing',
        desc: 'Manage subscriptions and recurring billing with flexible pricing models.',
        features: ['Recurring subscriptions', 'Usage-based pricing', 'Customer portal', 'Payment recovery'],
      },
      {
        id: 'connect',
        name: 'AntillaPay Connect',
        desc: 'Payments for platforms and marketplaces with automatic splits and seller onboarding.',
        features: ['Multi-party payments', 'KYC onboarding', 'Instant transfers', 'Consolidated reports'],
      },
      {
        id: 'tax',
        name: 'AntillaPay Tax',
        desc: 'Automate tax calculation, collection, and reporting across Cuba.',
        features: ['Automatic calculation', 'Global compliance', 'Billing integration', 'Tax reports'],
      },
      {
        id: 'issuing',
        name: 'AntillaPay Issuing',
        desc: 'Create classic and tropical cards for your business or platform.',
        features: ['Virtual cards', 'Physical cards', 'Spend control'],
      },
      {
        id: 'treasury',
        name: 'AntillaPay Treasury',
        desc: 'Banking as a service to integrate accounts and payments into your product.',
        features: ['Bank accounts', 'ACH and transfers', 'Fund management', 'Unified API'],
      },
      {
        id: 'capital',
        name: 'AntillaPay Capital',
        desc: 'Access flexible financing based on your sales volume.',
        features: ['Automatic pre-approval', 'Flexible repayments', 'No collateral', 'Funds in 24h'],
      },
    ],
  },
};

export default function Products() {
  const { language } = useLanguage();
  const copy = copyByLanguage[language] || copyByLanguage.en;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          {copy.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          {copy.subtitle}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {copy.products.map((product, i) => {
            const Icon = productIcons[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[product.id]} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>

                <p className="text-gray-600 mb-4">{product.desc}</p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-lg bg-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
