import { motion } from 'framer-motion';
import { Globe2, DollarSign, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function GlobalPayouts() {
  const { t, language } = useLanguage();

  const featuresByLanguage = {
    es: [
      { icon: Globe2, title: '100+ países', desc: 'Envía pagos a todo el mundo' },
      { icon: DollarSign, title: 'Múltiples monedas', desc: 'Soporte para 135+ divisas' },
      { icon: Clock, title: 'Pagos rápidos', desc: 'Transferencias en 1-3 días hábiles' },
      { icon: Shield, title: 'Seguro y confiable', desc: 'Cumplimiento regulatorio global' },
    ],
    en: [
      { icon: Globe2, title: '100+ countries', desc: 'Send payouts worldwide' },
      { icon: DollarSign, title: 'Multiple currencies', desc: 'Support for 135+ currencies' },
      { icon: Clock, title: 'Fast payouts', desc: 'Transfers in 1-3 business days' },
      { icon: Shield, title: 'Secure and reliable', desc: 'Global regulatory compliance' },
    ],
    "zh-Hans": [
      { icon: Globe2, title: '100+ 国家', desc: '向全球发送付款' },
      { icon: DollarSign, title: '多币种', desc: '支持 135+ 种货币' },
      { icon: Clock, title: '快速到账', desc: '1-3 个工作日转账' },
      { icon: Shield, title: '安全可靠', desc: '符合全球监管要求' },
    ],
  };

  const features = featuresByLanguage[language] || featuresByLanguage.en;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-cyan-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('pages.payouts.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pages.payouts.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <p className="text-lg text-gray-700 mb-8">
            {t('pages.payouts.content')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-lg">
            {t('common.getStarted')}
          </Button>
        </div>
      </div>
    </div>
  );
}
