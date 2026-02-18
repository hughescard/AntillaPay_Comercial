import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import antillaLogo from '@/assets/cards/logo.png';

export default function LowCodeSection() {
  const { t, language } = useLanguage();

  const copyByLanguage = {
    es: {
      options: [
        {
          id: 'payment_links',
          title: 'Crea enlaces de pago',
          description: 'Genera links desde el dashboard y compartelos con tus clientes en segundos',
          visual: 'payment-link-builder',
        },
        {
          id: 'catalog',
          title: 'Gestiona tu catalogo',
          description: 'Crea productos, precios y estados listos para reutilizar en cobros',
          visual: 'catalog-dashboard',
        },
        {
          id: 'transfers',
          title: 'Administra transferencias',
          description: 'Programa y da seguimiento a salidas de fondos desde el dashboard',
          visual: 'transfers-dashboard',
        },
      ],
      preview: {
        preview: 'Vista previa',
        createPaymentLink: 'Crear enlace de pago',
        pendingConfig: 'Pendiente de configuracion',
        paymentMethod: 'Metodo de pago',
        bankAccount: 'Cuenta Bancaria',
        antillaBalance: 'Saldo Antilla',
        pay: 'Pagar',
        productCatalog: 'Catalogo de productos',
        createProduct: 'Crear producto',
        search: 'Buscar',
        date: 'Fecha',
        status: 'Estado',
        export: 'Exportar',
        product: 'Producto',
        price: 'Precio',
        active: 'Activo',
        onePrice: '1 precio',
        transfers: 'Transferencias',
        create: 'Crear',
        showing29: 'Mostrando 29 pagos',
        client: 'Cliente',
        amount: 'Importe',
      },
      tableStatus: {
        rejected: 'Rejected',
        completed: 'Completed',
      },
    },
    en: {
      options: [
        {
          id: 'payment_links',
          title: 'Create payment links',
          description: 'Generate links from the dashboard and share them with customers in seconds',
          visual: 'payment-link-builder',
        },
        {
          id: 'catalog',
          title: 'Manage your catalog',
          description: 'Create products, prices, and statuses ready to reuse in collections',
          visual: 'catalog-dashboard',
        },
        {
          id: 'transfers',
          title: 'Manage transfers',
          description: 'Schedule and track fund outflows from the dashboard',
          visual: 'transfers-dashboard',
        },
      ],
      preview: {
        preview: 'Preview',
        createPaymentLink: 'Create payment link',
        pendingConfig: 'Pending configuration',
        paymentMethod: 'Payment method',
        bankAccount: 'Bank account',
        antillaBalance: 'Antilla balance',
        pay: 'Pay',
        productCatalog: 'Product catalog',
        createProduct: 'Create product',
        search: 'Search',
        date: 'Date',
        status: 'Status',
        export: 'Export',
        product: 'Product',
        price: 'Price',
        active: 'Active',
        onePrice: '1 price',
        transfers: 'Transfers',
        create: 'Create',
        showing29: 'Showing 29 payments',
        client: 'Client',
        amount: 'Amount',
      },
      tableStatus: {
        rejected: 'Rejected',
        completed: 'Completed',
      },
    },
  };

  const copy = copyByLanguage[language] || copyByLanguage.en;
  const options = copy.options;
  const p = copy.preview;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-violet-600 font-semibold mb-4 text-sm tracking-wide uppercase">
            {t('home.lowCode.eyebrow')}
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home.lowCode.title')}
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.lowCode.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-2xl shadow-lg transition-all overflow-hidden group border border-gray-100"
            >
              <div className="h-40 md:h-48 bg-gradient-to-br from-violet-50 to-purple-50 p-6 md:p-8 flex items-center justify-center">
                {option.visual === 'payment-link-builder' ? (
                  <div className="w-full max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-6 px-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                      <span className="text-[8px] text-slate-500 font-medium">{p.preview}</span>
                    </div>

                    <div className="grid grid-cols-[1.15fr_1fr]">
                      <div className="p-2 border-r border-slate-100">
                        <div className="text-[8px] font-semibold text-slate-700 mb-1">{p.createPaymentLink}</div>
                        <div className="space-y-1">
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                        </div>
                        <div className="mt-1.5 inline-flex items-center rounded bg-[#F7F1D7] border border-amber-200 px-1.5 py-0.5 text-[7px] text-amber-700">
                          {p.pendingConfig}
                        </div>
                      </div>

                      <div className="p-2">
                        <div className="flex items-center justify-center mb-1.5">
                          <img src={antillaLogo} alt="AntillaPay" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="text-[8px] font-semibold text-slate-700 mb-1">{p.paymentMethod}</div>
                        <div className="rounded border border-slate-200 overflow-hidden mb-1.5">
                          <div className="h-4 px-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-[#5b5df0]" />
                            <span className="text-[7px] text-slate-600">{p.bankAccount}</span>
                          </div>
                          <div className="h-4 px-1.5 bg-white flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-slate-300" />
                            <span className="text-[7px] text-slate-600">{p.antillaBalance}</span>
                          </div>
                        </div>
                        <div className="h-3 rounded border border-slate-200 bg-slate-50 mb-1" />
                        <div className="h-4 rounded bg-[#5b5df0] text-white text-[8px] flex items-center justify-center font-semibold">
                          {p.pay}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : option.visual === 'catalog-dashboard' ? (
                  <div className="w-full max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-6 px-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-1.5">
                        <img src={antillaLogo} alt="AntillaPay" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[8px] font-semibold text-slate-700">AntillaPay</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded border border-slate-200 bg-white text-[8px] text-[#5b5df0] flex items-center justify-center font-semibold">+</span>
                        <span className="w-4 h-4 rounded-full border border-slate-200 bg-white text-[8px] text-slate-500 flex items-center justify-center">i</span>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[8px] font-semibold text-slate-800">{p.productCatalog}</p>
                        <span className="h-4 px-1.5 rounded bg-[#5b5df0] text-white text-[7px] font-medium flex items-center">{p.createProduct}</span>
                      </div>

                      <div className="h-3.5 rounded border border-slate-200 bg-white mb-1.5 px-1.5 flex items-center text-[7px] text-slate-400">{p.search}</div>

                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">{p.date}</span>
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">{p.status}</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded border border-slate-200 text-[7px] text-slate-600">{p.export}</span>
                      </div>

                      <div className="rounded border border-slate-200 overflow-hidden">
                        <div className="h-4 bg-slate-50 border-b border-slate-100 grid grid-cols-[1.8fr_1fr_1fr] px-1.5 items-center text-[7px] font-medium text-slate-500">
                          <span>{p.product}</span>
                          <span>{p.price}</span>
                          <span>{p.status}</span>
                        </div>
                        {['Stats Product 24', 'Stats Product 34'].map((name) => (
                          <div key={name} className="h-4 grid grid-cols-[1.8fr_1fr_1fr] px-1.5 items-center border-b border-slate-100 last:border-b-0 text-[7px] text-slate-600">
                            <span className="truncate">{name}</span>
                            <span>{p.onePrice}</span>
                            <span className="text-emerald-600">{p.active}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : option.visual === 'transfers-dashboard' ? (
                  <div className="w-full max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-6 px-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <p className="text-[8px] font-semibold text-slate-800">{p.transfers}</p>
                      <span className="h-4 px-1.5 rounded bg-[#5b5df0] text-white text-[7px] font-medium flex items-center">{p.create}</span>
                    </div>

                    <div className="p-2">
                      <div className="h-3.5 rounded border border-slate-200 bg-white mb-1.5 px-1.5 flex items-center text-[7px] text-slate-400">{p.search}</div>

                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">{p.date}</span>
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">{p.status}</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded border border-slate-200 text-[7px] text-slate-600">{p.export}</span>
                      </div>

                      <p className="text-[7px] text-slate-500 mb-1">{p.showing29}</p>

                      <div className="rounded border border-slate-200 overflow-hidden">
                        <div className="h-4 bg-slate-50 border-b border-slate-100 grid grid-cols-[1.6fr_1fr_1fr_1fr] px-1.5 items-center text-[7px] font-medium text-slate-500">
                          <span>{p.client}</span>
                          <span>{p.date}</span>
                          <span>{p.amount}</span>
                          <span>{p.status}</span>
                        </div>
                        {[
                          { client: 'business0@example.com', date: '2025-10-27', amount: '2.20', status: copy.tableStatus.rejected },
                          { client: 'business0@example.com', date: '2026-02-14', amount: '6.54', status: copy.tableStatus.completed },
                        ].map((row) => (
                          <div key={`${row.client}-${row.date}`} className="h-4 grid grid-cols-[1.6fr_1fr_1fr_1fr] px-1.5 items-center border-b border-slate-100 last:border-b-0 text-[7px] text-slate-600">
                            <span className="truncate text-[#5b5df0]">{row.client}</span>
                            <span>{row.date}</span>
                            <span>{row.amount}</span>
                            <span className={row.status === copy.tableStatus.completed ? 'text-emerald-600' : 'text-rose-600'}>{row.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{option.title}</h3>
                <div className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                  {option.description}
                  {option.links && option.links.map((link, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && ' y '}
                      <span className="text-violet-600 font-medium hover:underline">{link}</span>
                    </Fragment>
                  ))}
                  {option.description && !option.links && '.'}
                  {option.description2 && <span> {option.description2}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
