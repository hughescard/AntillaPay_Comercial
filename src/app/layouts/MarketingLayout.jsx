import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function MarketingLayout({ children }) {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    document.body.setAttribute("lang", language);
  }, [language]);

  useEffect(() => {
    document.title = "AntillaPay";
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
