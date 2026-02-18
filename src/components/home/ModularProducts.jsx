import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowLeftRight,
  CreditCard,
  DollarSign,
  Key,
  Link2,
  Package,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';

const TILE_CONFIG = [
  { id: 'cobros', icon: CreditCard, color: '#635BFF', route: 'payments', left: '45%', top: '50%' },
  { id: 'saldos', icon: DollarSign, color: '#10B981', route: 'financial-accounts', left: '25%', top: '20%' },
  { id: 'clientes', icon: Users, color: '#0EA5E9', route: 'companies', left: '70%', top: '22%' },
  { id: 'catalogo', icon: Package, color: '#F59E0B', route: 'products', left: '20%', top: '60%' },
  { id: 'payment_links', icon: Link2, color: '#8B5CF6', route: 'payment-links', left: '70%', top: '60%' },
  { id: 'transferencias', icon: ArrowLeftRight, color: '#14B8A6', route: 'global-payouts', left: '45%', top: '82%' },
  { id: 'webhooks', icon: Activity, color: '#06B6D4', route: 'developers', left: '85%', top: '45%' },
  { id: 'api_keys', icon: Key, color: '#64748B', route: 'developers', left: '10%', top: '45%' },
];

const CONNECTIONS = [
  { from: 'cobros', to: 'saldos' },
  { from: 'cobros', to: 'clientes' },
  { from: 'cobros', to: 'payment_links' },
  { from: 'payment_links', to: 'catalogo' },
  { from: 'catalogo', to: 'clientes' },
  { from: 'cobros', to: 'transferencias' },
  { from: 'webhooks', to: 'cobros' },
  { from: 'api_keys', to: 'webhooks' },
];

const COLORS = ['#06B6D4', '#0EA5E9', '#3B82F6', '#14B8A6'];

// Función para crear grupos de 3 elementos para el carrusel
const createSlides = (items) => {
  const slides = [];
  for (let i = 0; i < items.length; i += 3) {
    slides.push(items.slice(i, i + 3));
  }
  return slides;
};

export default function ModularProducts() {
  const { t, language } = useLanguage();
  const tileLabelsByLanguage = {
    es: {
      cobros: 'Cobros',
      saldos: 'Saldos',
      clientes: 'Clientes',
      catalogo: 'Catalogo',
      payment_links: 'Payment Links',
      transferencias: 'Transferencias',
      webhooks: 'Webhooks',
      api_keys: 'Claves API',
      prev: 'Anterior',
      next: 'Siguiente',
      goToSlide: 'Ir a slide',
    },
    en: {
      cobros: 'Payments',
      saldos: 'Balances',
      clientes: 'Customers',
      catalogo: 'Catalog',
      payment_links: 'Payment Links',
      transferencias: 'Transfers',
      webhooks: 'Webhooks',
      api_keys: 'API Keys',
      prev: 'Previous',
      next: 'Next',
      goToSlide: 'Go to slide',
    },
  };
  const labels = tileLabelsByLanguage[language] || tileLabelsByLanguage.en;
  const [hoveredTile, setHoveredTile] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [tilePositions, setTilePositions] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const tilesRef = useRef({});
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const location = useLocation();
  
  const slides = createSlides(TILE_CONFIG);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const carouselVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      y: 0, // Aseguramos que no haya movimiento vertical
      opacity: 0,
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      position: 'relative',
      width: '100%'
    },
    exit: (direction) => ({
      x: direction < 0 ? '-100%' : '100%', // Invertimos la dirección de salida
      y: 0, // Aseguramos que no haya movimiento vertical
      opacity: 0,
      position: 'absolute',
      width: '100%',
      top: 0
    })
  };

  useEffect(() => {
    // Set initial slide from URL (e.g. ?section=modular&slide=2)
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    const slideParam = params.get('slide');
    if (section === 'modular' && slideParam) {
      const index = parseInt(slideParam, 10) - 1;
      if (!Number.isNaN(index)) {
        const safeIndex = Math.min(Math.max(index, 0), slides.length - 1);
        setCurrentSlide(safeIndex);
      }
    }
  }, [location.search, slides.length]);

  useEffect(() => {
    const calculatePositions = () => {
      const positions = {};
      TILE_CONFIG.forEach(tile => {
        const el = tilesRef.current[tile.id];
        if (el && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const tileRect = el.getBoundingClientRect();
          
          positions[tile.id] = {
            x: tileRect.left - containerRect.left + tileRect.width / 2,
            y: tileRect.top - containerRect.top + tileRect.height / 2,
            width: tileRect.width,
            height: tileRect.height,
          };
        }
      });
      setTilePositions(positions);
    };

    calculatePositions();
    const handleResize = () => calculatePositions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;
      
      const numToHighlight = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...CONNECTIONS].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, numToHighlight).map((conn, i) => ({
        ...conn,
        color: COLORS[i % COLORS.length]
      }));
      
      setHighlightedConnections(selected);
    };

    animateConnections();
    intervalRef.current = setInterval(animateConnections, 2500 + Math.random() * 1000);
    return () => clearInterval(intervalRef.current);
  }, [hoveredTile]);

  useEffect(() => {
    if (hoveredTile) {
      const relatedConns = CONNECTIONS.filter(
        conn => conn.from === hoveredTile || conn.to === hoveredTile
      ).map(conn => ({
        ...conn,
        color: TILE_CONFIG.find(t => t.id === hoveredTile)?.color || COLORS[0]
      }));
      setHighlightedConnections(relatedConns);
    }
  }, [hoveredTile]);

  const getPath = (from, to) => {
    if (!tilePositions[from] || !tilePositions[to]) return '';
    const f = tilePositions[from];
    const t = tilePositions[to];
    return `M ${f.x},${f.y} L ${t.x},${t.y}`;
  };

  const isHighlighted = (conn) => highlightedConnections.some(
    h => h.from === conn.from && h.to === conn.to
  );

  const getColor = (conn) => {
    const h = highlightedConnections.find(
      c => c.from === conn.from && c.to === conn.to
    );
    return h?.color || '#E5E7EB';
  };

  const isTileActive = (id) => {
    return highlightedConnections.some(c => c.from === id || c.to === id);
  };

  return (
    <section id="soluciones-modulares" className="py-16 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] hidden lg:block" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center lg:text-left lg:grid lg:grid-cols-2 gap-12 lg:gap-20 lg:items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: '#FB923C' }}>
              {t('home.modular.eyebrow')}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight text-gray-900">
              {t('home.modular.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl lg:max-w-lg">
              {t('home.modular.description')}
            </p>
          </motion.div>

          {/* Right - Tiles Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            ref={containerRef}
            className="relative hidden lg:block"
            style={{ height: '420px' }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {CONNECTIONS.map((conn) => {
                const highlighted = isHighlighted(conn);
                const color = getColor(conn);
                
                return (
                  <motion.path
                    key={`${conn.from}-${conn.to}`}
                    d={getPath(conn.from, conn.to)}
                    fill="none"
                    stroke={color}
                    strokeWidth={highlighted ? 2 : 1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ 
                      opacity: highlighted ? 0.8 : 0.25,
                      strokeWidth: highlighted ? 2 : 1
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                );
              })}
            </svg>

            <div className="relative h-full">
              {TILE_CONFIG.map((tile) => {
                const Icon = tile.icon;
                const isHovered = hoveredTile === tile.id;
                const isActive = !hoveredTile && isTileActive(tile.id);
                
                return (
                  <div 
                    key={tile.id}
                    ref={el => tilesRef.current[tile.id] = el}
                    className="absolute"
                    style={{
                      left: tile.left,
                      top: tile.top,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Link
                      to={createPageUrl(tile.route)}
                      className={`
                        rounded-xl flex flex-col items-center justify-center
                        bg-white transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                        ${isHovered || isActive
                          ? 'shadow-lg -translate-y-1 border-2' 
                          : 'shadow-sm hover:shadow-md border border-gray-200'
                        }
                        w-20 h-20 p-1.5
                      `}
                      style={{
                        borderColor: (isHovered || isActive) ? tile.color : undefined,
                        transform: (isHovered || isActive) ? 'translateY(-4px)' : 'none',
                        color: (isHovered || isActive) ? tile.color : '#4B5563',
                        fontWeight: (isHovered || isActive) ? 600 : 500
                      }}
                      onMouseEnter={() => setHoveredTile(tile.id)}
                      onMouseLeave={() => setHoveredTile(null)}
                      aria-label={`${t('home.modular.goTo')} ${labels[tile.id]}`}
                    >
                      <div className="flex-none h-6 flex items-center justify-center">
                        <Icon 
                          className="w-4 h-4 transition-all duration-300"
                          style={{ 
                            color: (isHovered || isActive) ? tile.color : '#9CA3AF',
                            strokeWidth: (isHovered || isActive) ? 2 : 1.5
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-center leading-tight px-1" style={{ lineHeight: '1.1' }}>
                        {labels[tile.id]}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile Carousel */}
          <div className="lg:hidden w-full">
            <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    x: { type: 'tween', ease: 'easeInOut', duration: 0.4 },
                    opacity: { duration: 0.2 }
                  }}
                  className="grid grid-cols-3 gap-3 p-4 w-full"
                  style={{ willChange: 'transform' }}
                >
                  {slides[currentSlide]?.map((tile) => (
                    <Link
                      key={tile.id}
                      to={createPageUrl(tile.route)}
                      className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-28"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${tile.color}10` }}
                      >
                        <tile.icon className="w-5 h-5" style={{ color: tile.color }} />
                      </div>
                      <span className="text-xs font-medium text-gray-900 text-center">{labels[tile.id]}</span>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Controles de navegación */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label={labels.prev}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentSlide ? 1 : -1);
                        setCurrentSlide(index);
                      }}
                      className={`w-2 h-2 rounded-lg transition-colors ${
                        index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                      }`}
                      aria-label={`${labels.goToSlide} ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label={labels.next}
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
