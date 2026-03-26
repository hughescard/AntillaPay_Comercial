import 'i18next';
import es from '@/common/i18n/es.json'; 

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof es;
    };
  }
}