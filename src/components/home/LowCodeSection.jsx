import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import antillaLogo from '@/assets/cards/logo.png';

export default function LowCodeSection() {
  const { t } = useLanguage();

  const options = [
    {
      id: 'payment_links',
      title: 'Crea enlaces de pago',
      description: 'Genera links desde el dashboard y compártelos con tus clientes en segundos',
      visual: 'payment-link-builder'
    },
    {
      id: 'catalog',
      title: 'Gestiona tu catálogo',
      description: 'Crea productos, precios y estados listos para reutilizar en cobros',
      visual: 'catalog-dashboard'
    },
    {
      id: 'transfers',
      title: 'Administra transferencias',
      description: 'Programa y da seguimiento a salidas de fondos desde el dashboard',
      visual: 'transfers-dashboard'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Cards Grid */}
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
              {/* Visual Area */}
              <div className="h-40 md:h-48 bg-gradient-to-br from-violet-50 to-purple-50 p-6 md:p-8 flex items-center justify-center">
                {option.visual === 'payment-link-builder' ? (
                  <div className="w-full max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-6 px-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                      <span className="text-[8px] text-slate-500 font-medium">Vista previa</span>
                    </div>

                    <div className="grid grid-cols-[1.15fr_1fr]">
                      <div className="p-2 border-r border-slate-100">
                        <div className="text-[8px] font-semibold text-slate-700 mb-1">Crear enlace de pago</div>
                        <div className="space-y-1">
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                          <div className="h-3 rounded border border-slate-200 bg-white" />
                        </div>
                        <div className="mt-1.5 inline-flex items-center rounded bg-[#F7F1D7] border border-amber-200 px-1.5 py-0.5 text-[7px] text-amber-700">
                          Pendiente de configuración
                        </div>
                      </div>

                      <div className="p-2">
                        <div className="flex items-center justify-center mb-1.5">
                          <img src={antillaLogo} alt="AntillaPay" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="text-[8px] font-semibold text-slate-700 mb-1">Método de pago</div>
                        <div className="rounded border border-slate-200 overflow-hidden mb-1.5">
                          <div className="h-4 px-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-[#5b5df0]" />
                            <span className="text-[7px] text-slate-600">Cuenta Bancaria</span>
                          </div>
                          <div className="h-4 px-1.5 bg-white flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full border border-slate-300" />
                            <span className="text-[7px] text-slate-600">Saldo Antilla</span>
                          </div>
                        </div>
                        <div className="h-3 rounded border border-slate-200 bg-slate-50 mb-1" />
                        <div className="h-4 rounded bg-[#5b5df0] text-white text-[8px] flex items-center justify-center font-semibold">
                          Pagar
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
                        <p className="text-[8px] font-semibold text-slate-800">Catálogo de productos</p>
                        <span className="h-4 px-1.5 rounded bg-[#5b5df0] text-white text-[7px] font-medium flex items-center">Crear producto</span>
                      </div>

                      <div className="h-3.5 rounded border border-slate-200 bg-white mb-1.5 px-1.5 flex items-center text-[7px] text-slate-400">
                        Buscar
                      </div>

                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">Fecha</span>
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">Estado</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded border border-slate-200 text-[7px] text-slate-600">Exportar</span>
                      </div>

                      <div className="rounded border border-slate-200 overflow-hidden">
                        <div className="h-4 bg-slate-50 border-b border-slate-100 grid grid-cols-[1.8fr_1fr_1fr] px-1.5 items-center text-[7px] font-medium text-slate-500">
                          <span>Producto</span>
                          <span>Precio</span>
                          <span>Estado</span>
                        </div>
                        {['Stats Product 24', 'Stats Product 34'].map((name) => (
                          <div key={name} className="h-4 grid grid-cols-[1.8fr_1fr_1fr] px-1.5 items-center border-b border-slate-100 last:border-b-0 text-[7px] text-slate-600">
                            <span className="truncate">{name}</span>
                            <span>1 precio</span>
                            <span className="text-emerald-600">Activo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : option.visual === 'transfers-dashboard' ? (
                  <div className="w-full max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="h-6 px-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <p className="text-[8px] font-semibold text-slate-800">Transferencias</p>
                      <span className="h-4 px-1.5 rounded bg-[#5b5df0] text-white text-[7px] font-medium flex items-center">Crear</span>
                    </div>

                    <div className="p-2">
                      <div className="h-3.5 rounded border border-slate-200 bg-white mb-1.5 px-1.5 flex items-center text-[7px] text-slate-400">
                        Buscar
                      </div>

                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">Fecha</span>
                        <span className="px-1.5 py-0.5 rounded-full border border-slate-200 text-[7px] text-slate-600">Estado</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded border border-slate-200 text-[7px] text-slate-600">Exportar</span>
                      </div>

                      <p className="text-[7px] text-slate-500 mb-1">Mostrando 29 pagos</p>

                      <div className="rounded border border-slate-200 overflow-hidden">
                        <div className="h-4 bg-slate-50 border-b border-slate-100 grid grid-cols-[1.6fr_1fr_1fr_1fr] px-1.5 items-center text-[7px] font-medium text-slate-500">
                          <span>Cliente</span>
                          <span>Fecha</span>
                          <span>Importe</span>
                          <span>Estado</span>
                        </div>
                        {[
                          { client: 'business0@example.com', date: '2025-10-27', amount: '2.20', status: 'Rejected' },
                          { client: 'business0@example.com', date: '2026-02-14', amount: '6.54', status: 'Completed' },
                        ].map((row) => (
                          <div key={`${row.client}-${row.date}`} className="h-4 grid grid-cols-[1.6fr_1fr_1fr_1fr] px-1.5 items-center border-b border-slate-100 last:border-b-0 text-[7px] text-slate-600">
                            <span className="truncate text-[#5b5df0]">{row.client}</span>
                            <span>{row.date}</span>
                            <span>{row.amount}</span>
                            <span className={row.status === 'Completed' ? 'text-emerald-600' : 'text-rose-600'}>{row.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : option.logos ? (
                  <div className="grid grid-cols-2 gap-4">
                    {option.logos.map((logo, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center font-bold text-gray-700 text-xl"
                      >
                        {logo}
                      </div>
                    ))}
                  </div>
                ) : option.icons ? (
                  <div className="flex gap-4">
                    {option.icons.map((icon, idx) => (
                      <div key={idx} className="text-4xl">
                        {icon}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Content Area */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <div className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                  {option.description}
                  {option.links && option.links.map((link, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && ' y '}
                      <span className="text-violet-600 font-medium hover:underline">
                        {link}
                      </span>
                    </Fragment>
                  ))}
                  {option.description && !option.links && '.'}
                  {option.description2 && (
                    <span> {option.description2}</span>
                  )}
                </div>

                {/* Learn More button removed as per request */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
