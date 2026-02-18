import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Users, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import cardBanes from '@/assets/cards/bandes-prepaid-tropical.png';
import cardClasicaEmpresarial from '@/assets/cards/clasica-empresariales.png';
import cardMetropolitana from '@/assets/cards/metropolitana.png';

const TILES = [
  {
    id: 'balances',
    icon: Wallet,
    color: '#4F46E5',
    route: 'BalanceManagement',
    position: { top: '18%', left: '-9%' },
  },
  {
    id: 'payouts',
    icon: Landmark,
    color: '#0EA5E9',
    route: 'NationalPayouts',
    position: { bottom: '22%', left: '-7%' },
  },
  {
    id: 'clients',
    icon: Users,
    color: '#10B981',
    route: 'CustomerTraceability',
    position: { top: '36%', right: '-9%' },
  },
];

const BANK_CARDS = [
  {
    id: 'clasica-empresarial',
    name: 'Clásica Empresarial',
    bank: 'BANDEC',
    currency: 'USD',
    image: cardClasicaEmpresarial,
  },
  {
    id: 'metropolitana',
    name: 'Metropolitana',
    bank: 'Banco Metropolitano',
    currency: 'CUP',
    image: cardMetropolitana,
  },
  {
    id: 'bandes-tropical',
    name: 'Bandes Tropical',
    bank: 'BANDEC',
    currency: 'USD',
    image: cardBanes,
  },
];

const CARD_STEP_DESKTOP = 360;

export default function BankAccountsShowcase() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const mockupRef = useRef(null);
  const tilesRef = useRef({});
  const [connections, setConnections] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % BANK_CARDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateConnections = () => {
      if (hoveredTile) return;

      const colors = ['#4F46E5', '#0EA5E9', '#10B981'];
      const tileIds = TILES.map((tile) => tile.id);
      const randomIndex = Math.floor(Math.random() * tileIds.length);
      setHighlightedConnections([{ id: tileIds[randomIndex], color: colors[randomIndex] }]);
    };

    animateConnections();
    intervalRef.current = setInterval(animateConnections, 2400);
    return () => clearInterval(intervalRef.current);
  }, [hoveredTile]);

  useEffect(() => {
    if (!hoveredTile) return;
    const tile = TILES.find((item) => item.id === hoveredTile);
    setHighlightedConnections([{ id: hoveredTile, color: tile?.color || '#4F46E5' }]);
  }, [hoveredTile]);

  useEffect(() => {
    const calculateConnections = () => {
      if (!mockupRef.current) return;

      const mockupRect = mockupRef.current.getBoundingClientRect();
      const centerX = mockupRect.width / 2;
      const centerY = mockupRect.height / 2;

      const newConnections = TILES.map((tile) => {
        const tileEl = tilesRef.current[tile.id];
        if (!tileEl) return null;

        const tileRect = tileEl.getBoundingClientRect();
        const mockupPos = mockupRef.current.getBoundingClientRect();

        const tileCenterX = tileRect.left - mockupPos.left + tileRect.width / 2;
        const tileCenterY = tileRect.top - mockupPos.top + tileRect.height / 2;

        const isLeft = tileCenterX < centerX;
        const controlX = isLeft ? tileCenterX + 70 : tileCenterX - 70;
        const controlY = (tileCenterY + centerY) / 2;

        return {
          id: tile.id,
          path: `M ${tileCenterX},${tileCenterY} Q ${controlX},${controlY} ${centerX},${centerY}`,
          color: tile.color,
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
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold mb-4 w-full lg:w-auto text-indigo-600">
              Gestión bancaria
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight lg:leading-[1.08] tracking-tight">
              Gestiona tus cuentas bancarias con claridad
            </h2>
            <p className="text-base md:text-xl text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Conecta cuentas nacionales, valida titulares, consulta saldos y mueve fondos desde un flujo unificado dentro del dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
            style={{ minHeight: '580px' }}
          >
            <div ref={mockupRef} className="relative h-full flex items-center justify-center py-12">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                {connections.map((conn) => {
                  const highlighted = highlightedConnections.find((item) => item.id === conn.id);
                  const isHighlighted = !!highlighted;

                  return (
                    <motion.path
                      key={conn.id}
                      d={conn.path}
                      fill="none"
                      stroke={isHighlighted ? highlighted.color : '#E5E7EB'}
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                      strokeLinecap="round"
                      animate={{
                        opacity: isHighlighted ? 0.85 : 0.35,
                        strokeWidth: isHighlighted ? 2.5 : 1.5,
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  );
                })}
              </svg>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative w-full max-w-lg z-10"
                style={{ height: '380px', perspective: '1200px' }}
              >
                <div className="relative w-full h-full">
                  {BANK_CARDS.map((card, index) => (
                    <motion.div
                      key={card.id}
                      animate={{
                        y: (index - currentCard) * CARD_STEP_DESKTOP,
                        opacity: currentCard === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-3xl border border-slate-200 bg-white shadow-2xl p-5"
                      style={{ boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.18)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Cuenta vinculada</p>
                          <p className="text-base font-semibold text-slate-900">{card.name}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          Activa
                        </span>
                      </div>

                      <div className="h-[190px] rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 p-2 flex items-center justify-center">
                        <img src={card.image} alt={card.name} className="max-h-full w-full object-contain" loading="lazy" decoding="async" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-2">
                          <p className="text-[10px] text-slate-500">Banco</p>
                          <p className="text-xs font-semibold text-slate-800 truncate">{card.bank}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-2">
                          <p className="text-[10px] text-slate-500">Moneda</p>
                          <p className="text-xs font-semibold text-slate-800">{card.currency}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-2">
                          <p className="text-[10px] text-slate-500">Titular</p>
                          <p className="text-xs font-semibold text-slate-800">Verificado</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {BANK_CARDS.map((card, i) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setCurrentCard(i)}
                      className={`h-1.5 rounded-full transition-all ${i === currentCard ? 'w-7 bg-indigo-600' : 'w-1.5 bg-slate-300'}`}
                      aria-label={`Mostrar tarjeta ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>

              {TILES.map((tile, i) => {
                const Icon = tile.icon;
                const isHighlighted = highlightedConnections.some((item) => item.id === tile.id);
                const isHovered = hoveredTile === tile.id;

                return (
                  <Link
                    key={tile.id}
                    to={createPageUrl(tile.route)}
                    ref={(el) => {
                      tilesRef.current[tile.id] = el;
                    }}
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
                        ${(isHighlighted || isHovered) ? 'bg-white shadow-lg border-2' : 'bg-white shadow-sm border border-gray-200'}
                      `}
                      style={{ borderColor: (isHighlighted || isHovered) ? tile.color : undefined }}
                    >
                      <Icon
                        className="w-6 h-6 transition-all duration-500"
                        style={{
                          color: (isHighlighted || isHovered) ? tile.color : '#9CA3AF',
                          strokeWidth: (isHighlighted || isHovered) ? 2 : 1.5,
                        }}
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <div className="lg:hidden mt-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-white rounded-3xl shadow-xl border border-slate-200 p-4 w-full max-w-sm mx-auto"
            >
              <div className="h-[180px] rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 p-2 flex items-center justify-center mb-3">
                <img src={BANK_CARDS[currentCard].image} alt={BANK_CARDS[currentCard].name} className="max-h-full w-full object-contain" loading="lazy" decoding="async" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{BANK_CARDS[currentCard].name}</p>
              <p className="text-xs text-slate-500">{BANK_CARDS[currentCard].bank} · {BANK_CARDS[currentCard].currency}</p>
              <div className="mt-3 flex items-center gap-2 justify-center">
                {BANK_CARDS.map((card, i) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setCurrentCard(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentCard ? 'w-7 bg-indigo-600' : 'w-1.5 bg-slate-300'}`}
                    aria-label={`Mostrar tarjeta ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
