import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function UseCasesCarousel() {
  const { t, language } = useLanguage();
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

  const copyByLanguage = {
    es: {
      useCases: [
        { id: 'cobros', title: 'Cobros diarios', description: 'Revisa pagos, estados y detalles en un solo lugar.', companies: ['Cobros', 'Estados', 'Filtros'], route: 'payments' },
        { id: 'saldos', title: 'Saldos y reportes', description: 'Consulta balance disponible y movimientos recientes.', companies: ['Saldos', 'Resumen', 'Reportes'], route: 'financial-accounts' },
        { id: 'clientes', title: 'Gestion de clientes', description: 'Accede al historial de cada cliente y su actividad.', companies: ['Clientes', 'Historial', 'Detalle'], route: 'companies' },
        { id: 'catalogo', title: 'Catalogo de productos', description: 'Organiza productos y precios para crear Payment Links.', companies: ['Productos', 'Precios', 'Estado'], route: 'products' },
        { id: 'links', title: 'Payment Links', description: 'Genera enlaces y comparte cobros sin codigo.', companies: ['Enlaces', 'Compartir', 'Cobro'], route: 'payment-links' },
        { id: 'transferencias', title: 'Transferencias', description: 'Administra salidas de fondos y su seguimiento.', companies: ['Transferencias', 'Estatus', 'Detalle'], route: 'global-payouts' },
        { id: 'dev', title: 'Webhooks y logs', description: 'Monitorea eventos y registros para integraciones.', companies: ['Webhooks', 'Registros', 'API'], route: 'developers' },
      ],
      preview: {
        bankAccount: 'Cuenta Bancaria',
        antillaBalance: 'Saldo Antilla',
        searchPaymentOrClient: 'Buscar pago o cliente',
        client: 'Cliente',
        amount: 'Importe',
        status: 'Estado',
        completed: 'Completado',
        pending: 'Pendiente',
        availableBalance: 'Saldo disponible',
        incoming: 'Entrante',
        withdrawals: 'Extracciones',
        oneRejected: '1 rechazada',
        searchClient: 'Buscar cliente',
        date: 'Fecha',
        type: 'Tipo',
        customersCount: '26 clientes',
        name: 'Nombre',
        email: 'Correo',
        customer: 'Cliente',
        productCatalog: 'Catalogo de productos',
        create: 'Crear',
        searchProduct: 'Buscar producto',
        product: 'Producto',
        price: 'Precio',
        active: 'Activo',
        onePrice: '1 precio',
        title: 'Titulo',
        paymentMethod: 'Metodo de pago',
        pay: 'Pagar',
        transfers: 'Transferencias',
        search: 'Buscar',
        rejected: 'Rejected',
        devWebhooks: 'Webhooks',
        devApiKeys: 'API Keys',
        devUptime: 'Uptime',
      },
    },
    en: {
      useCases: [
        { id: 'cobros', title: 'Daily payments', description: 'Review payments, statuses, and details in one place.', companies: ['Payments', 'Statuses', 'Filters'], route: 'payments' },
        { id: 'saldos', title: 'Balances and reports', description: 'Check available balance and recent movements.', companies: ['Balances', 'Summary', 'Reports'], route: 'financial-accounts' },
        { id: 'clientes', title: 'Customer management', description: 'Access each customer history and activity.', companies: ['Customers', 'History', 'Detail'], route: 'companies' },
        { id: 'catalogo', title: 'Product catalog', description: 'Organize products and prices to create Payment Links.', companies: ['Products', 'Prices', 'Status'], route: 'products' },
        { id: 'links', title: 'Payment Links', description: 'Generate links and share collections without code.', companies: ['Links', 'Share', 'Charge'], route: 'payment-links' },
        { id: 'transferencias', title: 'Transfers', description: 'Manage fund outflows and tracking.', companies: ['Transfers', 'Status', 'Detail'], route: 'global-payouts' },
        { id: 'dev', title: 'Webhooks and logs', description: 'Monitor events and logs for integrations.', companies: ['Webhooks', 'Logs', 'API'], route: 'developers' },
      ],
      preview: {
        bankAccount: 'Bank account',
        antillaBalance: 'Antilla balance',
        searchPaymentOrClient: 'Search payment or client',
        client: 'Client',
        amount: 'Amount',
        status: 'Status',
        completed: 'Completed',
        pending: 'Pending',
        availableBalance: 'Available balance',
        incoming: 'Incoming',
        withdrawals: 'Withdrawals',
        oneRejected: '1 rejected',
        searchClient: 'Search client',
        date: 'Date',
        type: 'Type',
        customersCount: '26 customers',
        name: 'Name',
        email: 'Email',
        customer: 'Customer',
        productCatalog: 'Product catalog',
        create: 'Create',
        searchProduct: 'Search product',
        product: 'Product',
        price: 'Price',
        active: 'Active',
        onePrice: '1 price',
        title: 'Title',
        paymentMethod: 'Payment method',
        pay: 'Pay',
        transfers: 'Transfers',
        search: 'Search',
        rejected: 'Rejected',
        devWebhooks: 'Webhooks',
        devApiKeys: 'API keys',
        devUptime: 'Uptime',
      },
    },
  };

  const copy = copyByLanguage[language] || copyByLanguage.en;
  const p = copy.preview;
  const useCases = copy.useCases;

  const visibleCards = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, useCases.length - visibleCards);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const renderPreview = (useCase) => {
    switch (useCase.id) {
      case 'cobros':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{p.bankAccount}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{p.antillaBalance}</span>
            </div>
            <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">{p.searchPaymentOrClient}</div>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <div className="h-6 bg-slate-50 grid grid-cols-[1.5fr_0.8fr_0.9fr] px-2 items-center text-[9px] font-medium text-slate-500 border-b border-slate-200">
                <span>{p.client}</span>
                <span>{p.amount}</span>
                <span>{p.status}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.5fr_0.8fr_0.9fr] px-2 items-center text-[9px] text-slate-600 border-b border-slate-100">
                <span className="truncate">stats-customer-29</span>
                <span>4.64</span>
                <span className="text-emerald-600">{p.completed}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.5fr_0.8fr_0.9fr] px-2 items-center text-[9px] text-slate-600">
                <span className="truncate">stats-customer-32</span>
                <span>0.85</span>
                <span className="text-amber-600">{p.pending}</span>
              </div>
            </div>
          </div>
        );
      case 'saldos':
        return (
          <div className="space-y-2.5">
            <div className="rounded-md border border-slate-200 bg-white p-2">
              <p className="text-[9px] text-slate-500 mb-0.5">{p.availableBalance}</p>
              <p className="text-sm font-bold text-slate-900">1,000.00 USD</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[82%] bg-[#5b5df0]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="text-[9px] text-slate-500">{p.incoming}</p>
                <p className="text-[10px] font-semibold text-slate-800">0.00 USD</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2">
                <p className="text-[9px] text-slate-500">{p.withdrawals}</p>
                <p className="text-[10px] font-semibold text-rose-600">{p.oneRejected}</p>
              </div>
            </div>
          </div>
        );
      case 'clientes':
        return (
          <div className="space-y-2">
            <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">{p.searchClient}</div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[9px] text-slate-600">{p.date}</span>
              <span className="px-2 py-0.5 rounded-full border border-slate-200 text-[9px] text-slate-600">{p.type}</span>
              <span className="ml-auto text-[9px] text-slate-500">{p.customersCount}</span>
            </div>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <div className="h-6 bg-slate-50 grid grid-cols-[1.2fr_1fr_0.8fr] px-2 items-center text-[9px] font-medium text-slate-500 border-b border-slate-200">
                <span>{p.name}</span>
                <span>{p.email}</span>
                <span>{p.type}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.2fr_1fr_0.8fr] px-2 items-center text-[9px] text-slate-600 border-b border-slate-100">
                <span className="truncate">Stats Customer 29</span>
                <span className="truncate">stats-customer</span>
                <span>{p.customer}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.2fr_1fr_0.8fr] px-2 items-center text-[9px] text-slate-600">
                <span className="truncate">Customer 2</span>
                <span className="truncate">customer2</span>
                <span>{p.customer}</span>
              </div>
            </div>
          </div>
        );
      case 'catalogo':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-slate-700">{p.productCatalog}</p>
              <span className="px-2 py-0.5 rounded bg-[#5b5df0] text-white text-[9px]">{p.create}</span>
            </div>
            <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">{p.searchProduct}</div>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <div className="h-6 bg-slate-50 grid grid-cols-[1.4fr_1fr_0.9fr] px-2 items-center text-[9px] font-medium text-slate-500 border-b border-slate-200">
                <span>{p.product}</span>
                <span>{p.price}</span>
                <span>{p.status}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.4fr_1fr_0.9fr] px-2 items-center text-[9px] text-slate-600 border-b border-slate-100">
                <span>Stats Product 24</span>
                <span>{p.onePrice}</span>
                <span className="text-emerald-600">{p.active}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.4fr_1fr_0.9fr] px-2 items-center text-[9px] text-slate-600">
                <span>Product 4</span>
                <span>{p.onePrice}</span>
                <span className="text-emerald-600">{p.active}</span>
              </div>
            </div>
          </div>
        );
      case 'links':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">{p.title}</div>
              <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">USD</div>
            </div>
            <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">
              {p.amount}: 0.00 $
            </div>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <div className="h-6 px-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[9px]">
                <span className="text-slate-600">{p.paymentMethod}</span>
                <span className="text-[#5b5df0]">{p.bankAccount}</span>
              </div>
              <div className="h-6 px-2 bg-white flex items-center justify-center text-[9px] font-semibold text-white">
                <span className="px-4 py-0.5 rounded bg-[#5b5df0]">{p.pay}</span>
              </div>
            </div>
          </div>
        );
      case 'transferencias':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-slate-700">{p.transfers}</p>
              <span className="px-2 py-0.5 rounded bg-[#5b5df0] text-white text-[9px]">{p.create}</span>
            </div>
            <div className="h-6 rounded-md border border-slate-200 bg-white px-2 flex items-center text-[10px] text-slate-400">{p.search}</div>
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <div className="h-6 bg-slate-50 grid grid-cols-[1.3fr_0.8fr_0.9fr] px-2 items-center text-[9px] font-medium text-slate-500 border-b border-slate-200">
                <span>{p.client}</span>
                <span>{p.amount}</span>
                <span>{p.status}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.3fr_0.8fr_0.9fr] px-2 items-center text-[9px] text-slate-600 border-b border-slate-100">
                <span className="truncate">business0@example.com</span>
                <span>2.20</span>
                <span className="text-rose-600">{p.rejected}</span>
              </div>
              <div className="h-6 grid grid-cols-[1.3fr_0.8fr_0.9fr] px-2 items-center text-[9px] text-slate-600">
                <span className="truncate">business9@example.com</span>
                <span>3.58</span>
                <span className="text-emerald-600">{p.completed}</span>
              </div>
            </div>
          </div>
        );
      case 'dev':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              <div className="rounded-md border border-slate-200 bg-white p-2 text-center">
                <p className="text-[10px] font-semibold text-slate-800">12</p>
                <p className="text-[8px] text-slate-500">{p.devWebhooks}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2 text-center">
                <p className="text-[10px] font-semibold text-slate-800">3</p>
                <p className="text-[8px] text-slate-500">{p.devApiKeys}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-2 text-center">
                <p className="text-[10px] font-semibold text-slate-800">98%</p>
                <p className="text-[8px] text-slate-500">{p.devUptime}</p>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-500">payment.succeeded</span>
                <span className="text-emerald-600">200</span>
              </div>
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-500">payout.updated</span>
                <span className="text-emerald-600">200</span>
              </div>
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-slate-500">customer.created</span>
                <span className="text-amber-600">202</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t('home.useCases.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.useCases.subtitle')}</p>
          </motion.div>

          <div className="flex gap-2 mt-8 justify-center">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-violet-600" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-lg bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-all"
              aria-label="Next slide"
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
              {useCases.map((useCase, i) => (
                <motion.div
                  key={useCase.id}
                  className="flex-shrink-0 px-2 md:px-0"
                  style={{ width: `calc(100% / ${visibleCards})` }}
                >
                  <div
                    className={`
                      relative h-full bg-white rounded-2xl border border-gray-200 shadow-lg
                      transition-all duration-300 overflow-hidden flex flex-col transform-gpu
                      hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] mx-3
                    `}
                    style={{ minHeight: '400px' }}
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl"
                      style={{ backgroundColor: `rgb(${i % 2 === 0 ? '139, 92, 246' : '59, 130, 246'})` }}
                    />
                    <div className="p-5 flex flex-col h-full text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>

                      <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 text-left">
                        {renderPreview(useCase)}
                      </div>

                      <div className="flex flex-wrap justify-center gap-4 pt-4 mt-auto border-t border-gray-100">
                        {useCase.companies.map((company) => (
                          <div key={company} className="text-gray-400 font-semibold text-sm">
                            {company}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-lg transition-all ${i === currentIndex ? 'w-8 bg-violet-600' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
