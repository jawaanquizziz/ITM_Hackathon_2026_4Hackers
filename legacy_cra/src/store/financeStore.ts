import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, Category, Debt } from '../types';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
  monthlyIncome: number;
  savingsGoal: number;

  // Computed
  totalSpent: () => number;
  totalIncome: () => number;
  spendingByCategory: () => Record<Category, number>;
  currentMonthSpending: () => number;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setBudget: (category: Category, limit: number) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  markDebtPaid: (id: string) => void;
  setMonthlyIncome: (amount: number) => void;
  setSavingsGoal: (amount: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_BUDGETS: Budget[] = [
  { id: 'budget_food', category: 'food', limit: 5000, spent: 0, period: 'monthly' },
  { id: 'budget_transport', category: 'transport', limit: 2000, spent: 0, period: 'monthly' },
  { id: 'budget_shopping', category: 'shopping', limit: 3000, spent: 0, period: 'monthly' },
  { id: 'budget_entertainment', category: 'entertainment', limit: 1500, spent: 0, period: 'monthly' },
  { id: 'budget_bills', category: 'bills', limit: 2000, spent: 0, period: 'monthly' },
  { id: 'budget_education', category: 'education', limit: 3000, spent: 0, period: 'monthly' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: DEFAULT_BUDGETS,
      debts: [],
      monthlyIncome: 15000,
      savingsGoal: 5000,

      totalSpent: () => {
        const state = get();
        return state.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      totalIncome: () => {
        const state = get();
        return state.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      spendingByCategory: () => {
        const state = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const spending: Record<Category, number> = {
          food: 0,
          transport: 0,
          shopping: 0,
          entertainment: 0,
          bills: 0,
          education: 0,
          health: 0,
          stationery: 0,
          other: 0,
        };

        state.transactions
          .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' &&
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear;
          })
          .forEach(t => {
            spending[t.category] += t.amount;
          });

        return spending;
      },

      currentMonthSpending: () => {
        const state = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return state.transactions
          .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' &&
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + t.amount, 0);
      },

      addTransaction: (transaction) => {
        const id = generateId();
        const newTransaction = { ...transaction, id, date: new Date(transaction.date) };

        set((state) => {
          // Update budget spent amount
          const updatedBudgets = transaction.type === 'expense'
            ? state.budgets.map(b =>
                b.category === transaction.category
                  ? { ...b, spent: b.spent + transaction.amount }
                  : b
              )
            : state.budgets;

          return {
            transactions: [newTransaction, ...state.transactions],
            budgets: updatedBudgets,
          };
        });
      },

      deleteTransaction: (id) => {
        set((state) => {
          const transaction = state.transactions.find(t => t.id === id);
          if (!transaction) return state;

          const updatedBudgets = transaction.type === 'expense'
            ? state.budgets.map(b =>
                b.category === transaction.category
                  ? { ...b, spent: Math.max(0, b.spent - transaction.amount) }
                  : b
              )
            : state.budgets;

          return {
            transactions: state.transactions.filter(t => t.id !== id),
            budgets: updatedBudgets,
          };
        });
      },

      setBudget: (category, limit) => {
        set((state) => ({
          budgets: state.budgets.map(b =>
            b.category === category ? { ...b, limit } : b
          ),
        }));
      },

      addDebt: (debt) => {
        const id = generateId();
        set((state) => ({
          debts: [...state.debts, { ...debt, id, isPaid: false }],
        }));
      },

      updateDebt: (id, updates) => {
        set((state) => ({
          debts: state.debts.map(d => d.id === id ? { ...d, ...updates } : d),
        }));
      },

      markDebtPaid: (id) => {
        set((state) => ({
          debts: state.debts.map(d =>
            d.id === id ? { ...d, isPaid: true } : d
          ),
        }));
      },

      setMonthlyIncome: (amount) => {
        set({ monthlyIncome: amount });
      },

      setSavingsGoal: (amount) => {
        set({ savingsGoal: amount });
      },

      setTransactions: (transactions) => {
        set({ transactions });
      },
    }),
    {
      name: 'pacpay-finance-storage',
    }
  )
);