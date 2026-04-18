import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, Holding, Portfolio, StockTransaction, MarketEvent } from '../types';

interface StockState {
  stocks: Stock[];
  portfolio: Portfolio;
  marketEvents: MarketEvent[];
  watchlist: string[];
  isLoading: boolean;
  lastUpdate: number;

  // Actions
  buyStock: (symbol: string, shares: number, price: number) => boolean;
  sellStock: (symbol: string, shares: number, price: number) => boolean;
  updatePrices: () => void;
  addStock: (stock: Stock) => void;
  removeStock: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  resetPortfolio: () => void;
  applyMarketEvent: (event: MarketEvent) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'TECH',
    name: 'TechCorp Inc.',
    sector: 'Technology',
    description: 'Leading technology company specializing in AI and cloud solutions.',
    basePrice: 150.00,
    currentPrice: 150.00,
    previousPrice: 150.00,
    volatility: 0.3,
    dayHigh: 150.00,
    dayLow: 150.00,
    marketCap: 5000000000,
    history: [{ timestamp: Date.now(), price: 150.00, volume: 100000 }],
  },
  {
    symbol: 'BANK',
    name: 'Global Bank',
    sector: 'Finance',
    description: 'International banking and financial services corporation.',
    basePrice: 85.00,
    currentPrice: 85.00,
    previousPrice: 85.00,
    volatility: 0.2,
    dayHigh: 85.00,
    dayLow: 85.00,
    marketCap: 8000000000,
    history: [{ timestamp: Date.now(), price: 85.00, volume: 200000 }],
  },
  {
    symbol: 'FOOD',
    name: 'FoodChain Global',
    sector: 'Consumer Goods',
    description: 'Worldwide food and beverage company with diverse product portfolio.',
    basePrice: 45.00,
    currentPrice: 45.00,
    previousPrice: 45.00,
    volatility: 0.15,
    dayHigh: 45.00,
    dayLow: 45.00,
    marketCap: 3000000000,
    history: [{ timestamp: Date.now(), price: 45.00, volume: 150000 }],
  },
  {
    symbol: 'ENRG',
    name: 'Energy Solutions',
    sector: 'Energy',
    description: 'Renewable energy provider focusing on solar and wind power.',
    basePrice: 120.00,
    currentPrice: 120.00,
    previousPrice: 120.00,
    volatility: 0.35,
    dayHigh: 120.00,
    dayLow: 120.00,
    marketCap: 4000000000,
    history: [{ timestamp: Date.now(), price: 120.00, volume: 80000 }],
  },
  {
    symbol: 'HEAL',
    name: 'HealthTech Labs',
    sector: 'Healthcare',
    description: 'Biotechnology and healthcare innovation company.',
    basePrice: 200.00,
    currentPrice: 200.00,
    previousPrice: 200.00,
    volatility: 0.4,
    dayHigh: 200.00,
    dayLow: 200.00,
    marketCap: 6000000000,
    history: [{ timestamp: Date.now(), price: 200.00, volume: 120000 }],
  },
  {
    symbol: 'GAME',
    name: 'GameWorld Entertainment',
    sector: 'Entertainment',
    description: 'Gaming and entertainment company with popular titles.',
    basePrice: 75.00,
    currentPrice: 75.00,
    previousPrice: 75.00,
    volatility: 0.45,
    dayHigh: 75.00,
    dayLow: 75.00,
    marketCap: 2000000000,
    history: [{ timestamp: Date.now(), price: 75.00, volume: 180000 }],
  },
  {
    symbol: 'RETL',
    name: 'RetailMax',
    sector: 'Retail',
    description: 'E-commerce and retail giant with global presence.',
    basePrice: 180.00,
    currentPrice: 180.00,
    previousPrice: 180.00,
    volatility: 0.25,
    dayHigh: 180.00,
    dayLow: 180.00,
    marketCap: 7000000000,
    history: [{ timestamp: Date.now(), price: 180.00, volume: 250000 }],
  },
  {
    symbol: 'AUTO',
    name: 'AutoDrive Motors',
    sector: 'Automotive',
    description: 'Electric vehicle manufacturer and autonomous driving technology.',
    basePrice: 250.00,
    currentPrice: 250.00,
    previousPrice: 250.00,
    volatility: 0.5,
    dayHigh: 250.00,
    dayLow: 250.00,
    marketCap: 10000000000,
    history: [{ timestamp: Date.now(), price: 250.00, volume: 300000 }],
  },
];

const INITIAL_PORTFOLIO: Portfolio = {
  balance: 10000, // Starting PacTokens
  holdings: [],
  totalValue: 10000,
  totalProfitLoss: 0,
  totalProfitLossPercent: 0,
  transactions: [],
};

const simulatePriceChange = (stock: Stock): number => {
  const volatility = stock.volatility;
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = stock.currentPrice * (1 + change);
  return Math.max(0.01, Math.round(newPrice * 100) / 100);
};

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      stocks: INITIAL_STOCKS,
      portfolio: INITIAL_PORTFOLIO,
      marketEvents: [],
      watchlist: ['TECH', 'BANK', 'GAME'],
      isLoading: false,
      lastUpdate: Date.now(),

      buyStock: (symbol, shares, price) => {
        const state = get();
        const totalCost = shares * price;

        if (state.portfolio.balance < totalCost) {
          return false;
        }

        const transaction: StockTransaction = {
          id: generateId(),
          symbol,
          type: 'buy',
          shares,
          price,
          total: totalCost,
          timestamp: new Date(),
        };

        set((state) => {
          const existingHolding = state.portfolio.holdings.find(h => h.symbol === symbol);
          let newHoldings: Holding[];

          if (existingHolding) {
            const newShares = existingHolding.shares + shares;
            const newAvgPrice = (existingHolding.avgBuyPrice * existingHolding.shares + price * shares) / newShares;
            newHoldings = state.portfolio.holdings.map(h =>
              h.symbol === symbol
                ? {
                    ...h,
                    shares: newShares,
                    avgBuyPrice: newAvgPrice,
                    totalValue: newShares * h.currentPrice,
                    profitLoss: (h.currentPrice - newAvgPrice) * newShares,
                    profitLossPercent: ((h.currentPrice - newAvgPrice) / newAvgPrice) * 100,
                  }
                : h
            );
          } else {
            const stock = state.stocks.find(s => s.symbol === symbol);
            if (!stock) return state;

            newHoldings = [
              ...state.portfolio.holdings,
              {
                symbol,
                shares,
                avgBuyPrice: price,
                currentPrice: stock.currentPrice,
                totalValue: shares * stock.currentPrice,
                profitLoss: 0,
                profitLossPercent: 0,
              },
            ];
          }

          const totalValue = state.portfolio.balance - totalCost + newHoldings.reduce((sum, h) => sum + h.totalValue, 0);
          const totalProfitLoss = newHoldings.reduce((sum, h) => sum + h.profitLoss, 0);
          const investedValue = newHoldings.reduce((sum, h) => sum + h.avgBuyPrice * h.shares, 0);
          const totalProfitLossPercent = investedValue > 0 ? (totalProfitLoss / investedValue) * 100 : 0;

          return {
            portfolio: {
              ...state.portfolio,
              balance: state.portfolio.balance - totalCost,
              holdings: newHoldings,
              totalValue: state.portfolio.balance - totalCost + newHoldings.reduce((sum, h) => sum + h.totalValue, 0),
              totalProfitLoss,
              totalProfitLossPercent,
              transactions: [transaction, ...state.portfolio.transactions],
            },
          };
        });

        return true;
      },

      sellStock: (symbol, shares, price) => {
        const state = get();
        const holding = state.portfolio.holdings.find(h => h.symbol === symbol);

        if (!holding || holding.shares < shares) {
          return false;
        }

        const totalValue = shares * price;
        const transaction: StockTransaction = {
          id: generateId(),
          symbol,
          type: 'sell',
          shares,
          price,
          total: totalValue,
          timestamp: new Date(),
        };

        set((state) => {
          const holding = state.portfolio.holdings.find(h => h.symbol === symbol);
          if (!holding) return state;

          let newHoldings: Holding[];
          if (holding.shares === shares) {
            newHoldings = state.portfolio.holdings.filter(h => h.symbol !== symbol);
          } else {
            newHoldings = state.portfolio.holdings.map(h =>
              h.symbol === symbol
                ? {
                    ...h,
                    shares: h.shares - shares,
                    totalValue: (h.shares - shares) * h.currentPrice,
                    profitLoss: (h.currentPrice - h.avgBuyPrice) * (h.shares - shares),
                    profitLossPercent: ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100,
                  }
                : h
            );
          }

          const totalProfitLoss = newHoldings.reduce((sum, h) => sum + h.profitLoss, 0);
          const investedValue = newHoldings.reduce((sum, h) => sum + h.avgBuyPrice * h.shares, 0);
          const totalProfitLossPercent = investedValue > 0 ? (totalProfitLoss / investedValue) * 100 : 0;

          return {
            portfolio: {
              ...state.portfolio,
              balance: state.portfolio.balance + totalValue,
              holdings: newHoldings,
              totalValue: state.portfolio.balance + totalValue + newHoldings.reduce((sum, h) => sum + h.totalValue, 0),
              totalProfitLoss,
              totalProfitLossPercent,
              transactions: [transaction, ...state.portfolio.transactions],
            },
          };
        });

        return true;
      },

      updatePrices: () => {
        set((state) => {
          const updatedStocks = state.stocks.map(stock => {
            const newPrice = simulatePriceChange(stock);
            return {
              ...stock,
              previousPrice: stock.currentPrice,
              currentPrice: newPrice,
              dayHigh: Math.max(stock.dayHigh, newPrice),
              dayLow: Math.min(stock.dayLow, newPrice),
              history: [
                ...stock.history.slice(-99),
                { timestamp: Date.now(), price: newPrice, volume: Math.floor(Math.random() * 100000) },
              ],
            };
          });

          const updatedHoldings = state.portfolio.holdings.map(holding => {
            const stock = updatedStocks.find(s => s.symbol === holding.symbol);
            if (!stock) return holding;

            return {
              ...holding,
              currentPrice: stock.currentPrice,
              totalValue: holding.shares * stock.currentPrice,
              profitLoss: (stock.currentPrice - holding.avgBuyPrice) * holding.shares,
              profitLossPercent: ((stock.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100,
            };
          });

          const totalProfitLoss = updatedHoldings.reduce((sum, h) => sum + h.profitLoss, 0);
          const investedValue = updatedHoldings.reduce((sum, h) => sum + h.avgBuyPrice * h.shares, 0);
          const totalProfitLossPercent = investedValue > 0 ? (totalProfitLoss / investedValue) * 100 : 0;

          return {
            stocks: updatedStocks,
            portfolio: {
              ...state.portfolio,
              holdings: updatedHoldings,
              totalValue: state.portfolio.balance + updatedHoldings.reduce((sum, h) => sum + h.totalValue, 0),
              totalProfitLoss,
              totalProfitLossPercent,
            },
            lastUpdate: Date.now(),
          };
        });
      },

      addStock: (stock) => {
        set((state) => ({
          stocks: [...state.stocks, stock],
        }));
      },

      removeStock: (symbol) => {
        set((state) => ({
          stocks: state.stocks.filter(s => s.symbol !== symbol),
          watchlist: state.watchlist.filter(w => w !== symbol),
        }));
      },

      addToWatchlist: (symbol) => {
        set((state) => ({
          watchlist: state.watchlist.includes(symbol) ? state.watchlist : [...state.watchlist, symbol],
        }));
      },

      removeFromWatchlist: (symbol) => {
        set((state) => ({
          watchlist: state.watchlist.filter(w => w !== symbol),
        }));
      },

      resetPortfolio: () => {
        set({
          portfolio: INITIAL_PORTFOLIO,
          stocks: INITIAL_STOCKS.map(s => ({ ...s, currentPrice: s.basePrice, previousPrice: s.basePrice })),
        });
      },

      applyMarketEvent: (event) => {
        set((state) => {
          const updatedStocks = state.stocks.map(stock => {
            const multiplier = event.effect[stock.symbol] || 1;
            const newPrice = Math.max(0.01, stock.currentPrice * multiplier);
            return {
              ...stock,
              previousPrice: stock.currentPrice,
              currentPrice: newPrice,
              dayHigh: Math.max(stock.dayHigh, newPrice),
              dayLow: Math.min(stock.dayLow, newPrice),
              history: [
                ...stock.history.slice(-99),
                { timestamp: Date.now(), price: newPrice, volume: Math.floor(Math.random() * 100000) },
              ],
            };
          });

          return {
            stocks: updatedStocks,
            marketEvents: [event, ...state.marketEvents].slice(0, 10),
          };
        });
      },
    }),
    {
      name: 'pacpay-stock-storage',
      onRehydrateStorage: (state) => {
        return (rehydratedState) => {
          if (rehydratedState && (!rehydratedState.stocks || rehydratedState.stocks.length === 0)) {
            rehydratedState.stocks = INITIAL_STOCKS;
            rehydratedState.portfolio = INITIAL_PORTFOLIO;
            rehydratedState.watchlist = ['TECH', 'BANK', 'GAME'];
          }
        };
      },
    }
  )
);