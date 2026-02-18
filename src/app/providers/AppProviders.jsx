import { LanguageProvider } from "@/components/i18n/LanguageContext";

export default function AppProviders({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
