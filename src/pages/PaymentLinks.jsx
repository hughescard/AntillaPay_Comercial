import { motion } from 'framer-motion';
import { Link2, Share2, CreditCard, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../components/i18n/LanguageContext';

export default function PaymentLinks() {
  const { t, language } = useLanguage();

  const featuresByLanguage = {
    es: [
      { icon: Link2, title: 'Sin código', desc: 'Crea enlaces en segundos' },
      { icon: Share2, title: 'Comparte fácilmente', desc: 'Por email, redes sociales o SMS' },
      { icon: CreditCard, title: 'Todos los métodos', desc: 'Tarjetas, wallets y más' },
      { icon: BarChart, title: 'Seguimiento', desc: 'Analiza conversiones en tiempo real' },
    ],
    en: [
      { icon: Link2, title: 'No code', desc: 'Create links in seconds' },
      { icon: Share2, title: 'Easy sharing', desc: 'By email, social media, or SMS' },
      { icon: CreditCard, title: 'All methods', desc: 'Cards, wallets, and more' },
      { icon: BarChart, title: 'Tracking', desc: 'Analyze conversions in real time' },
    ],
    "zh-Hans": [
      { icon: Link2, title: '无需代码', desc: '几秒内创建链接' },
      { icon: Share2, title: '轻松分享', desc: '通过邮件、社交媒体或短信' },
      { icon: CreditCard, title: '全支付方式', desc: '银行卡、钱包等' },
      { icon: BarChart, title: '数据追踪', desc: '实时分析转化' },
    ],
  };

  const features = featuresByLanguage[language] || featuresByLanguage.en;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('pages.paymentLinks.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pages.paymentLinks.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <p className="text-lg text-gray-700 mb-8">
            {t('pages.paymentLinks.content')}
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
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
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
