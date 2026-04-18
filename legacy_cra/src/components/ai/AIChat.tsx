import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { useUserStore } from '../../store/userStore';
import { useFinanceStore } from '../../store/financeStore';
import { generateAIResponse } from '../../services/aiService';

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isTyping, addMessage, setTyping } = useAIStore();
  const { user, missions } = useUserStore();
  const { transactions, monthlyIncome, currentMonthSpending, savingsGoal } = useFinanceStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIContext = () => ({
    level: user.level,
    xp: user.xp,
    behaviorScore: user.behaviorScore,
    pacTokens: user.pacTokens,
    monthlyBudget: monthlyIncome,
    currentSpending: currentMonthSpending(),
    savingsRate: savingsGoal > 0 ? (monthlyIncome - currentMonthSpending()) / monthlyIncome : 0,
    activeMissions: missions.filter(m => !m.completed),
    recentTransactions: transactions.slice(0, 10),
    streakDays: user.streakDays,
  });

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');

    addMessage({ role: 'user', content: userMessage });
    setTyping(true);

    try {
      const response = await generateAIResponse(
        userMessage,
        getAIContext(),
        messages
      );

      addMessage({ role: 'assistant', content: response });
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setTyping(false);
    }
  };

  const handleQuickReply = (message: string) => {
    setInput(message);
    inputRef.current?.focus();
  };

  const quickReplies = [
    { label: '💰 Budget', message: 'How can I improve my budget?' },
    { label: '📊 Spending', message: 'What are my spending patterns?' },
    { label: '💡 Save', message: 'How can I save more money?' },
    { label: '📈 Invest', message: 'How do I start investing?' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* @ts-ignore */}
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Hi {user.name}! I'm PacPay AI
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">
                Your personal financial advisor. Ask me anything about budgeting, saving, or investing!
              </p>

              {/* Quick Reply Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => handleQuickReply(reply.message)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                  : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};