import { Link } from 'react-router-dom';
import AntillaPayLogo from '../brand/AntillaPayLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import { getDocumentationUrl } from '@/shared/docs/documentationRedirect';
import { getTerminalPosUrl } from '@/shared/terminal/terminalPosRedirect';

const isExternalUrl = (href) => typeof href === 'string' && /^https?:\/\//i.test(href);

export default function Footer() {
  const { t } = useLanguage();
  const terminalPosUrl = getTerminalPosUrl();

  const footerSections = [
    {
      title: t('footer.products'),
      links: [
        { name: t('menus.products.paymentLinks.name'), href: createPageUrl('Payments') },
        { name: t('menus.products.terminalPos.name'), href: terminalPosUrl },
        { name: t('menus.products.operationsTraceability.name'), href: createPageUrl('OperationsTraceability') },
        { name: t('menus.products.balanceManagement.name'), href: createPageUrl('BalanceManagement') },
        { name: t('menus.products.nationalPayouts.name'), href: createPageUrl('NationalPayouts') },
        { name: t('menus.products.customerTraceability.name'), href: createPageUrl('CustomerTraceability') },
      ]
    },
    {
      title: t('footer.solutions'),
      links: [
        { name: t('menus.solutions.pymes.name'), href: createPageUrl('SolutionPymes') },
        { name: t('menus.solutions.retail.name'), href: createPageUrl('SolutionRetail') },
        { name: t('menus.solutions.transporte.name'), href: createPageUrl('SolutionTransporte') },
        { name: t('menus.solutions.hosteleriaOcio.name'), href: createPageUrl('SolutionHosteleriaOcio') },
        { name: t('menus.solutions.vending.name'), href: createPageUrl('SolutionVending') },
        { name: t('menus.solutions.energia.name'), href: createPageUrl('SolutionEnergia') },
        { name: t('menus.solutions.serviciosHogar.name'), href: createPageUrl('SolutionServiciosHogar') },
        { name: t('menus.solutions.bancos.name'), href: createPageUrl('SolutionBancos') },
      ]
    },
    {
      title: t('footer.developers'),
      links: [
        { name: t('menus.developers.documentationLink'), href: getDocumentationUrl() },
      ]
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: createPageUrl('Company') },
        { name: t('nav.contactSales'), href: createPageUrl('Contact') },
        { name: t('footer.home'), href: createPageUrl('Home') },
      ]
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <div className="mb-2">
              <AntillaPayLogo size="large" showText={false} />
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href ? (
                      isExternalUrl(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                          {link.name}
                        </Link>
                      )
                    ) : (
                      <span className="text-sm text-gray-400">{link.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <span className="text-sm text-gray-400">
                {t('footer.privacy')}
              </span>
              <span className="text-sm text-gray-400">
                {t('footer.terms')}
              </span>
              <span className="text-sm text-gray-400">
                {t('footer.cookies')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
