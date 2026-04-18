import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIMessage, AIFinancialContext, AIAdvice } from '../types';

interface AIState {
  messages: AIMessage[];
  isTyping: boolean;
  context: AIFinancialContext | null;
  insights: AIAdvice[];
  suggestions: string[];

  // Actions
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  updateContext: (context: AIFinancialContext) => void;
  addInsight: (insight: AIAdvice) => void;
  clearInsights: () => void;
  setSuggestions: (suggestions: string[]) => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,
      context: null,
      insights: [],
      suggestions: [
        'How can I save more money?',
        'What are my spending patterns?',
        'Give me budget advice',
        'How do I start investing?',
      ],

      addMessage: (message) => {
        const newMessage: AIMessage = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      setTyping: (isTyping) => {
        set({ isTyping });
      },

      updateContext: (context) => {
        set({ context });
      },

      addInsight: (insight) => {
        set((state) => ({
          insights: [insight, ...state.insights].slice(0, 10),
        }));
      },

      clearInsights: () => {
        set({ insights: [] });
      },

      setSuggestions: (suggestions) => {
        set({ suggestions });
      },

      clearMessages: () => {
        set({ messages: [] });
      },
    }),
    {
      name: 'pacpay-ai-storage',
    }
  )
);