import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, Globe, CreditCard, Users, Wallet, Smartphone, BookOpen, BarChart3, Store, ShoppingCart, Truck, Coffee, Zap, Fuel, Home, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AntillaPayLogo from '../brand/AntillaPayLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import { redirectToLogin } from '@/shared/auth/loginRedirect';
import { getDocumentationUrl } from '@/shared/docs/documentationRedirect';
import { getTerminalPosUrl } from '@/shared/terminal/terminalPosRedirect';
import cubaIslandIcon from '@/assets/icons/cuba_icon.png';

const languageNames = {
  es: 'Español',
  en: 'English',
  'zh-Hans': '简体中文'
};

const CubaIslandIcon = ({ className }) => (
  <img src={cubaIslandIcon} alt="" className={className} aria-hidden="true" />
);

const isExternalUrl = (href) => typeof href === 'string' && /^https?:\/\//i.test(href);
const productIconClass = (item, sizeClass) =>
  `${sizeClass} shrink-0 ${item.icon === CubaIslandIcon ? 'scale-125 origin-center' : ''} ${item.color}`;
const mobileSolutionsIconClass = 'w-4 h-4 shrink-0 mt-0.5';
const desktopSolutionsIconClass = 'w-5 h-5 shrink-0 mt-0.5';
const terminalPosUrl = getTerminalPosUrl();

// Products menu structure like AntillaPay
const productsMenu = {
  sections: [
    {
      titleKey: 'menus.products.sectionInternational',
      items: [
        { nameKey: 'menus.products.paymentLinks.name', descKey: 'menus.products.paymentLinks.desc', icon: CreditCard, href: createPageUrl('Payments'), color: 'text-blue-500' },
        { nameKey: 'menus.products.terminalPos.name', descKey: 'menus.products.terminalPos.desc', icon: Smartphone, href: terminalPosUrl, color: 'text-purple-400' }
      ]
    },
    {
      titleKey: 'menus.products.sectionMoney',
      items: [
        { nameKey: 'menus.products.operationsTraceability.name', descKey: 'menus.products.operationsTraceability.desc', icon: BarChart3, href: createPageUrl('OperationsTraceability'), color: 'text-cyan-500' },
        { nameKey: 'menus.products.balanceManagement.name', descKey: 'menus.products.balanceManagement.desc', icon: Wallet, href: createPageUrl('BalanceManagement'), color: 'text-green-500' },
        { nameKey: 'menus.products.nationalPayouts.name', descKey: 'menus.products.nationalPayouts.desc', icon: CubaIslandIcon, href: createPageUrl('NationalPayouts'), color: 'text-blue-500' },
        { nameKey: 'menus.products.customerTraceability.name', descKey: 'menus.products.customerTraceability.desc', icon: Users, href: createPageUrl('CustomerTraceability'), color: 'text-blue-500' },
      ]
    }
  ]
};

// Solutions menu
const solutionsMenu = {
  sections: [
    {
      titleKey: 'menus.solutions.sectionTitle',
      items: [
        { nameKey: 'menus.solutions.pymes.name', descKey: 'menus.solutions.pymes.desc', icon: Store, href: createPageUrl('SolutionPymes'), color: 'text-blue-500' },
        { nameKey: 'menus.solutions.retail.name', descKey: 'menus.solutions.retail.desc', icon: ShoppingCart, href: createPageUrl('SolutionRetail'), color: 'text-emerald-500' },
        { nameKey: 'menus.solutions.transporte.name', descKey: 'menus.solutions.transporte.desc', icon: Truck, href: createPageUrl('SolutionTransporte'), color: 'text-cyan-500' },
        { nameKey: 'menus.solutions.hosteleriaOcio.name', descKey: 'menus.solutions.hosteleriaOcio.desc', icon: Coffee, href: createPageUrl('SolutionHosteleriaOcio'), color: 'text-purple-500' },
        { nameKey: 'menus.solutions.vending.name', descKey: 'menus.solutions.vending.desc', icon: Zap, href: createPageUrl('SolutionVending'), color: 'text-amber-500' },
        { nameKey: 'menus.solutions.energia.name', descKey: 'menus.solutions.energia.desc', icon: Fuel, href: createPageUrl('SolutionEnergia'), color: 'text-orange-500' },
        { nameKey: 'menus.solutions.serviciosHogar.name', descKey: 'menus.solutions.serviciosHogar.desc', icon: Home, href: createPageUrl('SolutionServiciosHogar'), color: 'text-rose-500' },
        { nameKey: 'menus.solutions.bancos.name', descKey: 'menus.solutions.bancos.desc', icon: Landmark, href: createPageUrl('SolutionBancos'), color: 'text-indigo-500' },
      ]
    }
  ]
};

// Developers menu
const developersMenu = {
  header: {
    titleKey: 'menus.developers.documentationTitle',
    descKey: 'menus.developers.documentationDescription',
    icon: BookOpen,
    href: getDocumentationUrl(),
  }
};

function MobileMenu({ productsMenu, solutionsMenu, developersMenu, language, languageNames, changeLanguage, navigate, t }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    if (href === '#') {
      return;
    }
    if (isExternalUrl(href)) {
      window.location.href = href;
      return;
    }
    setTimeout(() => {
      navigate(href);
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="rounded-lg">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <AntillaPayLogo size="default" />
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Products Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.products')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'products' && (
                <div className="mt-2 pl-4 space-y-2">
                  {productsMenu.sections.map((section) => (
                    <div key={section.titleKey} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t(section.titleKey)}</h4>
                      {section.items.map((item) => (
                        item.href ? (
                          <Link
                            key={item.nameKey}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-violet-600"
                          >
                            {item.icon && (
                              <item.icon
                                className={productIconClass(item, 'w-4 h-4')}
                              />
                            )}
                            <span>{t(item.nameKey)}</span>
                          </Link>
                        ) : (
                          <div key={item.nameKey} className="flex items-center gap-2 py-2 text-sm text-gray-500">
                            {item.icon && (
                              <item.icon
                                className={productIconClass(item, 'w-4 h-4')}
                              />
                            )}
                            <span>{t(item.nameKey)}</span>
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('solutions')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.solutions')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'solutions' && (
                <div className="mt-2 pl-4 space-y-2">
                  {solutionsMenu.sections.map((section) => (
                    <div key={section.titleKey} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t(section.titleKey)}</h4>
                      {section.items.map((item) => (
                        item.href ? (
                          <Link
                            key={item.nameKey}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex items-start gap-2 py-2 text-gray-700 hover:text-violet-600"
                          >
                            {item.icon && <item.icon className={`${mobileSolutionsIconClass} ${item.color}`} />}
                            <div>
                              <p className="text-sm font-medium">{t(item.nameKey)}</p>
                              {item.descKey && <p className="text-xs text-gray-500">{t(item.descKey)}</p>}
                            </div>
                          </Link>
                        ) : (
                          <div key={item.nameKey} className="flex items-start gap-2 py-2 text-gray-500">
                            {item.icon && <item.icon className={`${mobileSolutionsIconClass} ${item.color}`} />}
                            <div>
                              <p className="text-sm font-medium text-gray-700">{t(item.nameKey)}</p>
                              {item.descKey && <p className="text-xs text-gray-500">{t(item.descKey)}</p>}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Developers Section */}
            <div className="mb-3">
              <button
                onClick={() => toggleSection('developers')}
                className="w-full flex items-center justify-between px-3 py-2 text-lg font-medium text-gray-900 hover:text-violet-600 rounded-lg transition-colors"
              >
                <span>{t('nav.developers')}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'developers' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'developers' && (
                <div className="mt-2 pl-4 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    {t('menus.developers.officialDocsLabel')}
                  </h4>
                  <Link
                    to={developersMenu.header.href}
                    onClick={(e) => handleLinkClick(e, developersMenu.header.href)}
                    className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-violet-600"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{t(developersMenu.header.titleKey)}</span>
                  </Link>
                </div>
              )}
            </div>

          </nav>
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-2 justify-center">
              {Object.entries(languageNames).map(([code]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    language === code 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => navigate(createPageUrl('Contact')), 100);
              }}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
            >
              {t('nav.contactSales')}
            </Button>
            <Button 
              onClick={redirectToLogin}
              variant="outline" 
              className="w-full rounded-lg"
            >
              {t('nav.login')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MegaMenu({ isOpen, menuType, onClose, t }) {
  if (!isOpen) return null;

  const renderProductsMenu = () => (
          <div className="p-6">
            {productsMenu.sections.map((section, index) => (
              <div
                key={section.titleKey}
                className={`${index > 0 ? 'pt-4 mt-4 border-t border-gray-100' : ''}`}
              >
                <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {t(section.titleKey)}
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {section.items.map((item) => (
                    <div key={item.nameKey} className="flex items-start gap-3 py-2 rounded">
                      {item.icon && (
                        <item.icon
                          className={`${productIconClass(item, 'w-5 h-5')} mt-0.5`}
                        />
                      )}
                      <div>
                        {item.href ? (
                          isExternalUrl(item.href) ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onClose}
                              className="text-sm font-medium text-gray-900 hover:text-violet-600"
                            >
                              {t(item.nameKey)}
                            </a>
                          ) : (
                            <Link
                              to={item.href}
                              onClick={onClose}
                              className="text-sm font-medium text-gray-900 hover:text-violet-600"
                            >
                              {t(item.nameKey)}
                            </Link>
                          )
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{t(item.nameKey)}</span>
                        )}
                        {item.descKey && <p className="text-xs text-gray-500">{t(item.descKey)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
        );

  const renderSolutionsMenu = () => {
    const items = solutionsMenu.sections[0].items;

    return (
      <div className="p-6">
        <div className="mb-5">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t(solutionsMenu.sections[0].titleKey)}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.nameKey} className="flex items-start gap-3">
                <item.icon className={`${desktopSolutionsIconClass} ${item.color}`} />
                <div>
                  {item.href && item.href !== '#' ? (
                    <Link to={item.href} onClick={onClose} className="text-sm font-semibold text-gray-900 hover:text-violet-600">
                      {t(item.nameKey)}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{t(item.nameKey)}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDevelopersMenu = () => {
    const docsHref = developersMenu.header.href;
    const docsCardClass = 'flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors';
    const docsTitleClass = 'text-sm font-medium text-gray-900 hover:text-violet-600';

    return (
      <div className="p-6">
        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t('menus.developers.officialDocsLabel')}
        </h4>
        {isExternalUrl(docsHref) ? (
          <a href={docsHref} onClick={onClose} className={docsCardClass}>
            <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <span className={docsTitleClass}>{t(developersMenu.header.titleKey)}</span>
              <p className="text-xs text-gray-500">{t(developersMenu.header.descKey)}</p>
            </div>
          </a>
        ) : (
          <Link to={docsHref} onClick={onClose} className={docsCardClass}>
            <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <span className={docsTitleClass}>{t(developersMenu.header.titleKey)}</span>
              <p className="text-xs text-gray-500">{t(developersMenu.header.descKey)}</p>
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 rounded-b-2xl overflow-hidden"
      style={{ 
        maxWidth: menuType === 'products' ? '820px' : menuType === 'solutions' ? '1200px' : '500px', 
        margin: '0 auto',
        maxHeight: menuType === 'products' ? '600px' : 'none'
      }}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />
      
      <div className={menuType === 'products' ? 'overflow-y-auto max-h-[600px]' : ''}>
        {menuType === 'products' && renderProductsMenu()}
        {menuType === 'solutions' && renderSolutionsMenu()}
        {menuType === 'developers' && renderDevelopersMenu()}
      </div>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMenu(null);
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'products', label: t('nav.products'), hasDropdown: true },
    { id: 'solutions', label: t('nav.solutions'), hasDropdown: true },
    { id: 'developers', label: t('nav.developers'), hasDropdown: true },
  ];

  const handleNavClick = (item) => {
    if (item.hasDropdown) {
      setActiveMenu(activeMenu === item.id ? null : item.id);
    } else if (item.href) {
      navigate(item.href);
      setActiveMenu(null);
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || activeMenu
          ? 'bg-white/98 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex-shrink-0" onClick={() => setActiveMenu(null)}>
            <AntillaPayLogo size="default" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200
                  ${activeMenu === item.id 
                    ? 'text-violet-600 bg-violet-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60'
                  }
                  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                  active:scale-[0.98]
                `}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                )}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden xl:inline">{languageNames[language]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px]">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => { changeLanguage(code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === code ? 'text-violet-600 font-medium bg-violet-50' : 'text-gray-700'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={redirectToLogin}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors rounded-lg hover:bg-gray-100/60 focus:outline-none focus:ring-2 focus:ring-violet-500 flex items-center gap-1"
            >
              {t('nav.login')}
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <Button 
              onClick={() => navigate(createPageUrl('Contact'))}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-5 py-2 text-sm font-medium shadow-md shadow-violet-600/20 transition-all hover:shadow-lg hover:shadow-violet-600/30 active:scale-[0.98]"
            >
              {t('nav.contactSales')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            productsMenu={productsMenu}
            solutionsMenu={solutionsMenu}
            developersMenu={developersMenu}
            language={language}
            languageNames={languageNames}
            changeLanguage={changeLanguage}
            navigate={navigate}
            t={t}
          />
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu 
        isOpen={!!activeMenu} 
        menuType={activeMenu} 
        onClose={() => setActiveMenu(null)}
        t={t}
      />

    </header>
  );
}
