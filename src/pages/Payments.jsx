import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowRight, Globe2, Smartphone, Check, ChevronDown, ChevronUp, QrCode,
  Banknote, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { redirectToLogin } from '@/shared/auth/loginRedirect';
import { useLanguage } from '@/components/i18n/LanguageContext';

export default function Payments() {
  const [openFaq, setOpenFaq] = useState(null);
  const { language } = useLanguage();

  const copyByLanguage = {
    es: {
      backAria: 'Volver a la seccion interactiva del inicio',
      heroTitle: 'Varias formas de aceptar pagos en linea',
      heroDescription: 'Acepta pagos en efectivo, QR, tarjetas nacionales e internacionales. Soluciones adaptadas al mercado cubano.',
      methodsTitle: 'Metodos de pago en Cuba',
      methodsDescription: 'En Cuba conviven multiples formas de pago para adaptarse a las necesidades de comercios y clientes',
      internationalTitle: 'Metodos de pago internacionales',
      internationalDescription: 'Acepta pagos de clientes internacionales con las opciones mas populares',
      merchantTitle: 'Que puede ofrecer un comercio?',
      merchantDescription: 'Opciones tipicas que un negocio en Cuba puede implementar',
      faqTitle: 'Preguntas frecuentes',
      ctaTitle: 'Moderniza tu sistema de pagos',
      ctaDescription: 'Acepta todas las formas de pago disponibles en Cuba y expande tu negocio',
      ctaPrimary: 'Comenzar ahora',
      ctaSecondary: 'Contactar ventas',
      paymentMethods: [
        {
          icon: Banknote,
          title: 'Efectivo',
          desc: 'Peso cubano (CUP) y USD en comercios autorizados',
          color: 'bg-green-100 text-green-600',
          details: ['CUP: medio mas comun para compras del dia a dia', 'USD en efectivo en comercios autorizados'],
        },
        {
          icon: QrCode,
          title: 'Pagos QR',
          desc: 'Transfermovil y EnZona para pagos electronicos',
          color: 'bg-blue-100 text-blue-600',
          details: ['Transfermovil: pagos en linea y QR', 'EnZona: escanea, ingresa importe y confirma'],
        },
        {
          icon: CreditCard,
          title: 'Tarjetas Nacionales',
          desc: 'Tarjetas bancarias emitidas en Cuba',
          color: 'bg-purple-100 text-purple-600',
          details: ['BANDEC, BPA, Metropolitano', 'Tarjetas prepagadas FINCIMEX'],
        },
        {
          icon: Globe2,
          title: 'Tarjetas Internacionales',
          desc: 'MIR, UnionPay, Visa/Mastercard',
          color: 'bg-orange-100 text-orange-600',
          details: ['MIR (Rusia): cajeros y POS', 'UnionPay (China): red local RED S.A.', 'Visa/Mastercard: segun comercio'],
        },
      ],
      features: [
        {
          icon: QrCode,
          title: 'Enlaces de pagos',
          subtitle: 'Acepta tu primer pago en minutos, sin necesidad de programacion',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50',
          features: [
            'Comparte enlaces por correo electronico, SMS o cualquier otro canal',
            'Acepta pagos unicos, recurrentes o de importe personalizado',
            'Convierte tu enlace en un codigo QR o en un boton de compra incrustable',
          ],
        },
        {
          icon: Smartphone,
          title: 'Checkout',
          subtitle: 'Formulario de pago predisenado',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          features: [
            'Insertalo en tu sitio web o redirige a tus clientes a una pagina alojada en AntillaPay',
            'Personaliza los colores y el tipo de fuente para que se ajuste a tu marca',
            'Empieza a aceptar pagos recurrentes y activa AntillaPay Tax sin trabajo adicional de integracion',
          ],
        },
      ],
      internationalCards: [
        { desc: 'Acepta el metodo de pago predominante en todo el mundo con una de las mayores redes de tarjetas.', badge: 'Tarjetas', color: 'bg-blue-600', logo: 'VISA' },
        { desc: 'Acepta el metodo de pago predominante en todo el mundo con una de las mayores redes de tarjetas.', badge: 'Tarjetas', color: 'bg-orange-500', logo: 'mastercard' },
        { desc: 'PayPal es una opcion de pago de confianza usada por millones de clientes en mas de 200 paises.', badge: 'Carteras digitales', color: 'bg-blue-600', logo: 'PayPal' },
        { desc: 'Ofrece Google Pay listo para usar para clientes que ya lo tienen configurado.', badge: 'Carteras digitales', color: 'bg-blue-500', logo: 'G Pay' },
        { desc: 'Permite pagar con la experiencia de checkout que millones de usuarios de Amazon ya conocen.', badge: 'Carteras digitales', color: 'bg-orange-500', logo: 'amazon pay' },
        { desc: 'Permite a clientes de China y viajeros chinos pagar con Alipay en multiples monedas.', badge: 'Carteras digitales', color: 'bg-blue-500', logo: 'Alipay' },
        { desc: 'Ofrece opciones de pago flexibles para que tus clientes elijan cuando y como pagar.', badge: 'Compra ahora, paga despues', color: 'bg-pink-400', logo: 'Klarna.' },
        { desc: 'Ofrece una experiencia de pago fluida con Link para autocompletar datos de pago y envio.', badge: 'Carteras digitales', color: 'bg-green-600', logo: 'link' },
        { desc: 'Llega a mas clientes globales con monedas estables como metodo de pago en checkout.', badge: 'Criptomoneda', color: 'bg-indigo-600', logo: '₡', subtitle: '(Version preliminar)' },
        { desc: 'Las transferencias bancarias son ideales para transacciones puntuales de importes elevados.', badge: 'Transferencia bancaria', color: 'bg-purple-600', logo: 'USD' },
        { desc: 'Acepta pagos de UnionPay con presencia en Cuba mediante cooperacion con RED S.A.', badge: 'Tarjetas', color: 'bg-red-600', logo: 'UnionPay' },
        { desc: 'Sistema de pago ruso oficializado en Cuba para cajeros y terminales POS.', badge: 'Tarjetas', color: 'bg-green-700', logo: 'MIR' },
      ],
      merchantOptions: [
        { icon: QrCode, title: 'Pagos QR', desc: 'Transfermovil y EnZona para pagos locales rapidos y seguros', color: 'bg-blue-100', iconColor: 'text-blue-600' },
        { icon: CreditCard, title: 'Terminales POS', desc: 'Tarjetas nacionales e internacionales donde aplique', color: 'bg-purple-100', iconColor: 'text-purple-600' },
        { icon: Banknote, title: 'Efectivo', desc: 'CUP y USD en circuitos autorizados', color: 'bg-green-100', iconColor: 'text-green-600' },
      ],
      faqs: [
        { q: 'Que metodos de pago estan disponibles en Cuba?', a: 'En Cuba conviven efectivo (CUP y USD), pagos electronicos nacionales (Transfermovil y EnZona), tarjetas bancarias cubanas e internacionales segun comercio.' },
        { q: 'Como funcionan los pagos con QR en Cuba?', a: 'Se realizan principalmente con Transfermovil y EnZona: el cliente escanea, confirma importe y autoriza con su tarjeta asociada.' },
        { q: 'Que tarjetas internacionales se aceptan?', a: 'Se aceptan MIR, UnionPay y en algunos comercios Visa/Mastercard, segun restricciones y red de adquirencia.' },
        { q: 'Que puede ofrecer un comercio en Cuba?', a: 'Un comercio puede combinar pagos QR, terminales POS para tarjetas y efectivo en circuitos autorizados.' },
      ],
    },
    en: {
      backAria: 'Back to interactive homepage section',
      heroTitle: 'Multiple ways to accept online payments',
      heroDescription: 'Accept cash, QR, domestic cards, and international cards. Solutions adapted to the Cuban market.',
      methodsTitle: 'Payment methods in Cuba',
      methodsDescription: 'Cuba combines multiple payment methods to adapt to merchant and customer needs.',
      internationalTitle: 'International payment methods',
      internationalDescription: 'Accept international customer payments with the most popular options.',
      merchantTitle: 'What can a merchant offer?',
      merchantDescription: 'Typical options a business in Cuba can implement.',
      faqTitle: 'Frequently asked questions',
      ctaTitle: 'Modernize your payment stack',
      ctaDescription: 'Accept all payment methods available in Cuba and expand your business.',
      ctaPrimary: 'Start now',
      ctaSecondary: 'Contact sales',
      paymentMethods: [
        { icon: Banknote, title: 'Cash', desc: 'Cuban peso (CUP) and USD in authorized stores', color: 'bg-green-100 text-green-600', details: ['CUP: most common for daily purchases', 'USD cash in authorized stores'] },
        { icon: QrCode, title: 'QR payments', desc: 'Transfermovil and EnZona for electronic payments', color: 'bg-blue-100 text-blue-600', details: ['Transfermovil: online and QR payments', 'EnZona: scan, enter amount, and confirm'] },
        { icon: CreditCard, title: 'Domestic cards', desc: 'Bank cards issued in Cuba', color: 'bg-purple-100 text-purple-600', details: ['BANDEC, BPA, Metropolitano', 'FINCIMEX prepaid cards'] },
        { icon: Globe2, title: 'International cards', desc: 'MIR, UnionPay, Visa/Mastercard', color: 'bg-orange-100 text-orange-600', details: ['MIR (Russia): ATMs and POS', 'UnionPay (China): local RED S.A. network', 'Visa/Mastercard: depends on merchant'] },
      ],
      features: [
        { icon: QrCode, title: 'Payment links', subtitle: 'Accept your first payment in minutes without coding', color: 'text-cyan-600', bgColor: 'bg-cyan-50', features: ['Share links by email, SMS, or any channel', 'Accept one-time, recurring, or custom-amount payments', 'Convert links into QR codes or embedded buy buttons'] },
        { icon: Smartphone, title: 'Checkout', subtitle: 'Prebuilt payment form', color: 'text-purple-600', bgColor: 'bg-purple-50', features: ['Embed on your site or redirect to an AntillaPay hosted page', 'Customize colors and typography to match your brand', 'Start recurring payments and enable AntillaPay Tax with no extra integration'] },
      ],
      internationalCards: [
        { desc: 'Accept the most common global payment method with one of the largest card networks.', badge: 'Cards', color: 'bg-blue-600', logo: 'VISA' },
        { desc: 'Accept the most common global payment method with one of the largest card networks.', badge: 'Cards', color: 'bg-orange-500', logo: 'mastercard' },
        { desc: 'PayPal is a trusted payment option used by hundreds of millions of customers in 200+ countries.', badge: 'Digital wallets', color: 'bg-blue-600', logo: 'PayPal' },
        { desc: 'Offer Google Pay to customers who already have it set up on device or browser.', badge: 'Digital wallets', color: 'bg-blue-500', logo: 'G Pay' },
        { desc: 'Let customers pay with the familiar Amazon checkout experience.', badge: 'Digital wallets', color: 'bg-orange-500', logo: 'amazon pay' },
        { desc: 'Allow customers from China and Chinese travelers to pay with Alipay.', badge: 'Digital wallets', color: 'bg-blue-500', logo: 'Alipay' },
        { desc: 'Offer flexible buy-now-pay-later options to give customers more freedom.', badge: 'Buy now, pay later', color: 'bg-pink-400', logo: 'Klarna.' },
        { desc: 'Offer a frictionless payment experience with Link and autofilled payment details.', badge: 'Digital wallets', color: 'bg-green-600', logo: 'link' },
        { desc: 'Reach more global customers by offering stablecoins directly in checkout.', badge: 'Cryptocurrency', color: 'bg-indigo-600', logo: '₡', subtitle: '(Preview)' },
        { desc: 'Bank transfers are ideal for large one-time transactions such as B2B payments.', badge: 'Bank transfer', color: 'bg-purple-600', logo: 'USD' },
        { desc: 'Accept UnionPay, China largest card network, with local coverage in Cuba.', badge: 'Cards', color: 'bg-red-600', logo: 'UnionPay' },
        { desc: 'Russian payment system enabled in Cuba for ATMs and POS terminals.', badge: 'Cards', color: 'bg-green-700', logo: 'MIR' },
      ],
      merchantOptions: [
        { icon: QrCode, title: 'QR payments', desc: 'Transfermovil and EnZona for fast local payments', color: 'bg-blue-100', iconColor: 'text-blue-600' },
        { icon: CreditCard, title: 'POS terminals', desc: 'Domestic and international cards where applicable', color: 'bg-purple-100', iconColor: 'text-purple-600' },
        { icon: Banknote, title: 'Cash', desc: 'CUP and USD in authorized circuits', color: 'bg-green-100', iconColor: 'text-green-600' },
      ],
      faqs: [
        { q: 'What payment methods are available in Cuba?', a: 'Cuba combines cash (CUP and USD), domestic electronic payments (Transfermovil and EnZona), local bank cards, and some international cards.' },
        { q: 'How do QR payments work in Cuba?', a: 'Customers pay mostly through Transfermovil and EnZona by scanning the QR, entering amount, and confirming with their linked card.' },
        { q: 'Which international cards are accepted?', a: 'MIR and UnionPay are accepted, and Visa/Mastercard in some merchants depending on acquiring network and restrictions.' },
        { q: 'What can a merchant in Cuba offer?', a: 'A merchant can combine QR payments, POS card acceptance, and cash in authorized operating circuits.' },
      ],
    },
  };

  const copy = copyByLanguage[language] || copyByLanguage.en;
  const { paymentMethods, features, internationalCards, merchantOptions, faqs } = copy;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {/* Flecha móvil */}
            <div className="flex justify-end sm:hidden mb-4">
              <Link
                to="/?section=modular&slide=2#soluciones-modulares"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors"
                aria-label={copy.backAria}
              >
                <ArrowLeft className="w-6 h-6 text-blue-900" />
              </Link>
            </div>

            <div className="relative flex items-center justify-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 mb-0 text-center">
                {copy.heroTitle}
              </h1>
              <Link
                to="/?section=modular&slide=2#soluciones-modulares"
                className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 bg-white text-blue-900 shadow-sm hover:bg-gray-50 hover:text-blue-900 transition-colors absolute right-0 top-1/2 -translate-y-1/2"
                aria-label={copy.backAria}
              >
                <ArrowLeft className="w-6 h-6 text-blue-900" />
              </Link>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-6 mb-8">
              {copy.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods in Cuba */}
      <section className="pt-0 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.methodsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {copy.methodsDescription}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paymentMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {method.desc}
                  </p>
                  <ul className="space-y-2">
                    {method.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Features - Similar to images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border-t-4 border-violet-600"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-700 mb-4 font-medium">
                    {feature.subtitle}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <Check className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* International Payment Methods - Cards style from images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.internationalTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {copy.internationalDescription}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {internationalCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Thin colored top bar */}
                <div className={`${card.color} h-2 w-full`}></div>
                
                {/* Logo section */}
                <div className="flex items-center justify-center py-8 border-b border-gray-100">
                  <span className="text-gray-900 text-2xl font-bold tracking-tight">
                    {card.logo}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {card.name}
                  </h3>
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 mb-3">{card.subtitle}</p>
                  )}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {card.desc}
                  </p>
                  
                  {/* Footer with badge */}
                  <div className="mt-4">
                    <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                      {card.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Merchants Can Offer */}
      <section className="py-20 bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.merchantTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {copy.merchantDescription}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {merchantOptions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="p-6 text-center">
                    <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.faqTitle}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-violet-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              {copy.ctaTitle}
            </h2>
            <p className="text-xl mb-8 text-violet-100">
              {copy.ctaDescription}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-gray-100 rounded-lg px-6 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
                onClick={redirectToLogin}
              >
                {copy.ctaPrimary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-violet-600 hover:bg-gray-100 rounded-lg px-6 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
                onClick={() => window.location.href = '/contact'}
              >
                {copy.ctaSecondary}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
