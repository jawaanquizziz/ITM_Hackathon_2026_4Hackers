'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STOCK_DEFS = [
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', volatility: 0.12, basePrice: 420.50 },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Automotive', volatility: 0.45, basePrice: 175.20 },
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'Retail', volatility: 0.22, basePrice: 185.10 },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', volatility: 0.15, basePrice: 195.40 },
  { symbol: 'KO', name: 'Coca-Cola Co', sector: 'Consumer Goods', volatility: 0.08, basePrice: 62.30 },
  { symbol: 'SONY', name: 'Sony Group', sector: 'Entertainment', volatility: 0.25, basePrice: 85.90 },
];

const generateHistory = (basePrice) => {
  const history = [];
  let current = basePrice;
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const change = current * (Math.random() * 0.04 - 0.02);
    current += change;
    history.push({
      timestamp: now - (20 - i) * 60000,
      price: Number(current.toFixed(2))
    });
  }
  return history;
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      stocks: STOCK_DEFS.map(s => ({
        ...s,
        currentPrice: s.basePrice,
        previousPrice: s.basePrice,
        history: generateHistory(s.basePrice)
      })),
      holdings: [],
      transactions: [],
      balance: 10000,
      isLoading: false,

      initialize: () => {
        // Mock update interval
        const interval = setInterval(() => {
          set(state => ({
            stocks: state.stocks.map(stock => {
              const change = stock.currentPrice * (Math.random() * 0.02 - 0.01);
              const newPrice = Number((stock.currentPrice + change).toFixed(2));
              const newHistory = [...stock.history, { timestamp: Date.now(), price: newPrice }].slice(-20);
              return {
                ...stock,
                previousPrice: stock.currentPrice,
                currentPrice: newPrice,
                history: newHistory
              };
            })
          }));
        }, 3000);
        return () => clearInterval(interval);
      },

      buyStock: (symbol, shares) => {
        const state = get();
        const stock = state.stocks.find(s => s.symbol === symbol);
        if (!stock || shares <= 0) return false;

        const cost = shares * stock.currentPrice;
        if (state.balance < cost) return false;

        const existing = state.holdings.find(h => h.symbol === symbol);
        let newHoldings;
        if (existing) {
          const totalShares = existing.shares + shares;
          const avgPrice = (existing.shares * existing.avgPrice + cost) / totalShares;
          newHoldings = state.holdings.map(h => h.symbol === symbol ? { ...h, shares: totalShares, avgPrice } : h);
        } else {
          newHoldings = [...state.holdings, { symbol, shares, avgPrice: stock.currentPrice }];
        }

        set({
          balance: state.balance - cost,
          holdings: newHoldings,
          transactions: [{ id: Date.now(), symbol, type: 'buy', shares, price: stock.currentPrice, timestamp: new Date() }, ...state.transactions].slice(0, 20)
        });
        return true;
      },

      sellStock: (symbol, shares) => {
        const state = get();
        const holding = state.holdings.find(h => h.symbol === symbol);
        if (!holding || shares <= 0 || holding.shares < shares) return false;

        const stock = state.stocks.find(s => s.symbol === symbol);
        const revenue = shares * stock.currentPrice;

        const newHoldings = state.holdings
          .map(h => h.symbol === symbol ? { ...h, shares: h.shares - shares } : h)
          .filter(h => h.shares > 0);

        set({
          balance: state.balance + revenue,
          holdings: newHoldings,
          transactions: [{ id: Date.now(), symbol, type: 'sell', shares, price: stock.currentPrice, timestamp: new Date() }, ...state.transactions].slice(0, 20)
        });
        return true;
      }
    }),
    {
      name: 'pacpay-game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
