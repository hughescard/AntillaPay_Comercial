import HeroGradient from '../components/home/HeroGradient';
import ModularProducts from '../components/home/ModularProducts';
import ProductsCarousel from '../components/home/ProductsCarousel';
import PaymentsShowcase from '../components/home/PaymentsShowcase';
import ConnectShowcase from '../components/home/ConnectShowcase';
import BankAccountsShowcase from '../components/home/BankAccountsShowcase';
import IssuingShowcase from '../components/home/IssuingShowcase';
import GlobalScale from '../components/home/GlobalScale';
import UseCasesCarousel from '../components/home/UseCasesCarousel';
import DeveloperAPISection from '../components/home/DeveloperAPISection';
import LowCodeSection from '../components/home/LowCodeSection';
import FinalCTA from '../components/home/FinalCTA';
import { redirectToLogin } from '@/shared/auth/loginRedirect';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200/60 via-blue-200/50 to-cyan-100/60">
      <div className="section-spacing">
        <HeroGradient onLoginClick={redirectToLogin} />
      </div>
      <div className="section-spacing">
        <ModularProducts />
      </div>
      <div className="section-spacing">
        <ProductsCarousel />
      </div>
      <div className="section-spacing">
        <PaymentsShowcase onLoginClick={redirectToLogin} />
      </div>
      <div className="section-spacing">
        <ConnectShowcase onLoginClick={redirectToLogin} />
      </div>
      <div className="section-spacing">
        <BankAccountsShowcase />
      </div>
      <div className="section-spacing">
        <IssuingShowcase onLoginClick={redirectToLogin} />
      </div>
      <div className="section-spacing">
        <GlobalScale />
      </div>
      <div className="section-spacing">
        <UseCasesCarousel />
      </div>
      <div className="section-spacing">
        <DeveloperAPISection />
      </div>
      <div className="section-spacing">
        <LowCodeSection />
      </div>
      <div className="section-spacing">
        <FinalCTA onLoginClick={redirectToLogin} />
      </div>
    </div>
  );
}
