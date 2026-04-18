import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Lightbulb } from 'lucide-react';
import { AIChat } from '../components/ai/AIChat';
import { AIInsights } from '../components/ai/AIInsights';

export const AIAgent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Financial Advisor
            </h1>
            <p className="text-gray-400 text-sm">Your personal finance companion</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-white'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'insights'
              ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-white'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Insights</span>
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="h-[calc(100vh-200px)]"
      >
        {activeTab === 'chat' ? (
          <div className="h-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <AIChat />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <AIInsights />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};