import { MarketEvent, Stock } from '../types';

const MARKET_EVENTS: Omit<MarketEvent, 'id' | 'timestamp'>[] = [
  {
    name: 'Tech Boom',
    description: 'A major tech breakthrough sends tech stocks soaring!',
    effect: { TECH: 1.15, GAME: 1.10 },
    duration: 30,
  },
  {
    name: 'Banking Crisis',
    description: 'Financial sector faces uncertainty as regulations tighten.',
    effect: { BANK: 0.85 },
    duration: 45,
  },
  {
    name: 'Energy Revolution',
    description: 'Green energy initiatives boost renewable stocks.',
    effect: { ENRG: 1.20 },
    duration: 60,
  },
  {
    name: 'Healthcare Breakthrough',
    description: 'New drug approval sends healthcare stocks up.',
    effect: { HEAL: 1.25 },
    duration: 30,
  },
  {
    name: 'Retail Slowdown',
    description: 'Consumer spending drops, affecting retail stocks.',
    effect: { RETL: 0.90, FOOD: 0.95 },
    duration: 40,
  },
  {
    name: 'Auto Recall',
    description: 'Major auto recall affects vehicle manufacturers.',
    effect: { AUTO: 0.80 },
    duration: 50,
  },
  {
    name: 'Gaming Craze',
    description: 'New game release breaks records, boosting entertainment.',
    effect: { GAME: 1.30 },
    duration: 25,
  },
  {
    name: 'Market Rally',
    description: 'Optimistic economic outlook lifts all stocks.',
    effect: { TECH: 1.05, BANK: 1.05, FOOD: 1.05, ENRG: 1.05, HEAL: 1.05, GAME: 1.05, RETL: 1.05, AUTO: 1.05 },
    duration: 20,
  },
  {
    name: 'Market Correction',
    description: 'Market adjusts after rapid gains, stocks decline.',
    effect: { TECH: 0.95, BANK: 0.95, FOOD: 0.95, ENRG: 0.95, HEAL: 0.95, GAME: 0.95, RETL: 0.95, AUTO: 0.95 },
    duration: 35,
  },
  {
    name: 'E-commerce Boom',
    description: 'Online shopping surge benefits retail tech.',
    effect: { RETL: 1.18, TECH: 1.08 },
    duration: 30,
  },
];

export const generateRandomMarketEvent = (): MarketEvent => {
  const eventTemplate = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...eventTemplate,
    timestamp: new Date(),
  };
};

export const shouldTriggerMarketEvent = (probability: number = 0.02): boolean => {
  return Math.random() < probability;
};

export const calculatePortfolioValue = (
  balance: number,
  holdings: { shares: number; currentPrice: number }[]
): number => {
  const holdingsValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  return balance + holdingsValue;
};

export const calculateProfitLoss = (
  holdings: { shares: number; avgBuyPrice: number; currentPrice: number }[]
): { total: number; percent: number } => {
  let totalInvested = 0;
  let totalValue = 0;

  holdings.forEach(h => {
    totalInvested += h.shares * h.avgBuyPrice;
    totalValue += h.shares * h.currentPrice;
  });

  return {
    total: totalValue - totalInvested,
    percent: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const getStockColor = (current: number, previous: number): string => {
  if (current > previous) return 'text-green-400';
  if (current < previous) return 'text-red-400';
  return 'text-gray-400';
};

export const getSectorColor = (sector: string): string => {
  const colors: Record<string, string> = {
    Technology: 'bg-blue-500/20 text-blue-400',
    Finance: 'bg-green-500/20 text-green-400',
    'Consumer Goods': 'bg-yellow-500/20 text-yellow-400',
    Energy: 'bg-orange-500/20 text-orange-400',
    Healthcare: 'bg-pink-500/20 text-pink-400',
    Entertainment: 'bg-purple-500/20 text-purple-400',
    Retail: 'bg-cyan-500/20 text-cyan-400',
    Automotive: 'bg-red-500/20 text-red-400',
  };
  return colors[sector] || 'bg-gray-500/20 text-gray-400';
};

export const generateMarketNews = (event: MarketEvent): string => {
  const headlines = [
    `BREAKING: ${event.name} - ${event.description}`,
    `Market Alert: ${event.name} impacting ${Object.keys(event.effect).length} stocks`,
    `Investors react to ${event.name}: ${event.description}`,
    `${event.name}: Major market event unfolds`,
  ];
  return headlines[Math.floor(Math.random() * headlines.length)];
};