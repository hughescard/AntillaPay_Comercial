import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link2, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';

const TILES = [
  { 
    id: 'catalogo', 
    icon: Package, 
    color: '#8B5CF6', 
    route: 'products',
    position: { top: '35%', left: '-5%' }
  },
  { 
    id: 'payment_links', 
    icon: Link2, 
    color: '#0EA5E9', 
    route: 'payment-links',
    position: { bottom: '15%', left: '0%' }
  },
  { 
    id: 'clientes', 
    icon: Users, 
    color: '#10B981', 
    route: 'companies',
    position: { top: '50%', right: '-3%' }
  }
];

const PRODUCT_CARDS = [
  {
    name: 'Servicio esencial',
    price: 'US$25.00',
    status: 'Activo',
    sku: 'PRD-001'
  },
  {
    name: 'Paquete profesional',
    price: 'US$120.00',
    status: 'Activo',
    sku: 'PRD-002'
  },
  {
    name: 'Implementación inicial',
    price: 'US$200.00',
    status: 'Inactivo',
    sku: 'PRD-003'
  },
  {
    name: 'Soporte mensual',
    price: 'US$50.00',
    status: 'Activo',
    sku: 'PRD-004'
  }
];

const STATUS_STYLES = {
  Activo: 'bg-emerald-100 text-emerald-700',
  Inactivo: 'bg-slate-100 text-slate-700'
};

const CARD_STEP_DESKTOP = 340;
const CARD_STEP_MOBILE = 240;

const ProductCard = ({ product }) => (
  <div className="h-full w-full rounded-2xl bg-white border border-gray-200 p-6 flex flex-col justify-between">
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400">Producto</div>
      <div className="text-xl font-semibold text-gray-900 mt-1">{product.name}</div>
      <div className="text-sm text-gray-500 mt-2">SKU {product.sku}</div>
    </div>
    <div className="flex items-center justify-between mt-6">
      <div>
        <div className="text-xs text-gray-500">Precio</div>
        <div className="text-lg font-bold text-gray-900">{product.price}</div>
      </div>
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[product.status] || 'bg-slate-100 text-slate-700'}`}>
        {product.status}
      </span>
    </div>
  </div>
);

export default function IssuingShowcase() {
  const { t } = useLanguage();
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const mockupRef = useRef(null);
  const tilesRef = useRef({});
  const [connections, setConnections] = useState([]);
  const intervalRef = useRef(null);

  // Auto-carousel for cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % PRODUCT_CARDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic connection animation
  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;
      
      const colors = ['#8B5CF6', '#0EA5E9', '#10B981'];
      const tileIds = TILES.map(t => t.id);
      const randomIndex = Math.floor(Math.random() * tileIds.length);
      const selected = [{
        id: tileIds[randomIndex],
        color: colors[randomIndex]
      }];
      
      setHighlightedConnections(selected);
    };

    animateConnections();
    intervalRef.current = setInterval(animateConnections, 2500);
    return () => clearInterval(intervalRef.current);
  }, [hoveredTile]);

  useEffect(() => {
    if (hoveredTile) {
      const tile = TILES.find(t => t.id === hoveredTile);
      setHighlightedConnections([{ id: hoveredTile, color: tile?.color || '#8B5CF6' }]);
    }
  }, [hoveredTile]);

  useEffect(() => {
    const calculateConnections = () => {
      if (!mockupRef.current) return;

      const mockupRect = mockupRef.current.getBoundingClientRect();
      const mockupCenterX = mockupRect.width / 2;
      const mockupCenterY = mockupRect.height / 2;

      const newConnections = TILES.map(tile => {
        const tileEl = tilesRef.current[tile.id];
        if (!tileEl) return null;

        const tileRect = tileEl.getBoundingClientRect();
        const mockupPos = mockupRef.current.getBoundingClientRect();
        
        const tileCenterX = tileRect.left - mockupPos.left + tileRect.width / 2;
        const tileCenterY = tileRect.top - mockupPos.top + tileRect.height / 2;

        // Calculate control points for curved path
        const isLeft = tileCenterX < mockupCenterX;
        const controlX = isLeft ? tileCenterX + 80 : tileCenterX - 80;
        const controlY = (tileCenterY + mockupCenterY) / 2;

        return {
          id: tile.id,
          path: `M ${tileCenterX},${tileCenterY} Q ${controlX},${controlY} ${mockupCenterX},${mockupCenterY}`,
          color: tile.color
        };
      }).filter(Boolean);

      setConnections(newConnections);
    };

    calculateConnections();
    window.addEventListener('resize', calculateConnections);
    const timer = setTimeout(calculateConnections, 100);

    return () => {
      window.removeEventListener('resize', calculateConnections);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-20 items-start">
          {/* Left - Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 lg:pt-4 px-6 lg:px-8 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-slate-600 mb-4 w-full lg:w-auto">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-indigo-500 rounded" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
              {t('home.catalog.label')}
            </div>
            
            {/* Title */}
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight lg:leading-[1.08] tracking-tight">
              {t('home.catalog.title')}
            </h2>
            
            {/* Subtitle */}
            <p className="text-base md:text-xl text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('home.catalog.description')}
            </p>

            {/* CTA Button - Commented out as per request
            <Button 
              onClick={onLoginClick}
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 rounded-lg px-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t('common.getStarted')} Catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            */}
          </motion.div>

          {/* Right - Cards Mockup with Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block lg:col-span-3"
            style={{ minHeight: '550px' }}
          >
            <div ref={mockupRef} className="relative h-full flex items-center justify-center">
              {/* SVG Connections */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ zIndex: 5 }}
              >
                {connections.map((conn) => {
                  const highlighted = highlightedConnections.find(h => h.id === conn.id);
                  const isHighlighted = !!highlighted;
                  
                  return (
                    <g key={conn.id}>
                      {/* Base line - always visible */}
                      <motion.path
                        d={conn.path}
                        fill="none"
                        stroke={isHighlighted ? highlighted.color : '#E5E7EB'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ 
                          opacity: isHighlighted ? 0.8 : 0.3,
                          strokeWidth: isHighlighted ? 2 : 1
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Cards Stack Mockup */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative w-full max-w-lg z-10"
                style={{ 
                  height: '320px',
                  perspective: '1000px'
                }}
              >
                <div className="relative w-full h-full">
                  {PRODUCT_CARDS.map((product, index) => (
                    <motion.div
                      key={product.sku}
                      animate={{ 
                        y: (index - currentCard) * CARD_STEP_DESKTOP,
                        opacity: currentCard === index ? 1 : 0
                      }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
                      style={{
                        boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tiles */}
              {TILES.map((tile, i) => {
                const Icon = tile.icon;
                const isHighlighted = highlightedConnections.some(h => h.id === tile.id);
                const isHovered = hoveredTile === tile.id;
                
                return (
                  <Link
                    key={tile.id}
                    to={createPageUrl(tile.route)}
                    ref={el => tilesRef.current[tile.id] = el}
                    className="absolute z-20"
                    style={tile.position}
                    onMouseEnter={() => setHoveredTile(tile.id)}
                    onMouseLeave={() => setHoveredTile(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      whileHover={{ y: -2, scale: 1.05 }}
                      className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer
                        transition-all duration-500
                        ${isHighlighted || isHovered
                          ? 'bg-white shadow-lg border-2' 
                          : 'bg-white shadow-sm border border-gray-200'
                        }
                      `}
                      style={{
                        borderColor: (isHighlighted || isHovered) ? tile.color : undefined
                      }}
                    >
                      <Icon 
                        className="w-6 h-6 transition-all duration-500"
                        style={{ 
                          color: (isHighlighted || isHovered) ? tile.color : '#9CA3AF',
                          strokeWidth: (isHighlighted || isHovered) ? 2 : 1.5
                        }}
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile - Cards visible */}
          <div className="lg:hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm mx-auto mb-6"
              style={{ 
                height: '220px',
                perspective: '1000px'
              }}
            >
              <div className="relative w-full h-full">
                {PRODUCT_CARDS.map((product, index) => (
                  <motion.div
                    key={product.sku}
                    animate={{ 
                      y: (index - currentCard) * CARD_STEP_MOBILE,
                      opacity: currentCard === index ? 1 : 0
                    }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="h-full w-full rounded-xl bg-white border border-gray-200 p-4 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-gray-400">Producto</div>
                        <div className="text-base font-semibold text-gray-900 mt-1">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-2">SKU {product.sku}</div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <div className="text-[10px] text-gray-500">Precio</div>
                          <div className="text-sm font-bold text-gray-900">{product.price}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATUS_STYLES[product.status] || 'bg-slate-100 text-slate-700'}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
