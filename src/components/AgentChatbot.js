'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AgentChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Uplink Established. I'm your AI Agent Manager. Ask me anything about your PacPay stats, market trends, or financial strategy.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Fetch user context from localStorage (standard for this project)
      const userData = JSON.parse(localStorage.getItem('pacpay_user') || '{}');
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: input,
          context: {
            level: userData.level || 1,
            xp: userData.xp || 0,
            pacTokens: userData.balance || 0,
            behaviorScore: 85, 
            monthlyBudget: userData.limit || 2000,
            currentSpending: userData.spent || 0
          },
          conversationHistory: messages
        })
      });

      const data = await res.json();
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "Uplink Error. Please check your data connection.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[100] w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--color-pac-blue)] text-white flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)] border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <ChevronDown size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <Bot size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 md:inset-auto md:bottom-28 md:right-8 md:w-[400px] md:h-[600px] z-[99] bg-[#050505]/95 backdrop-blur-2xl md:rounded-[2rem] border-x border-t md:border border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-zinc-900/50 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white italic tracking-tighter uppercase">AI Agent Manager</h3>
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                       <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM_ONLINE
                    </p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Pane */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-pac-blue)] text-white ml-12 rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-300 mr-12 rounded-tl-none border border-zinc-800'
                  }`}>
                    {msg.content}
                    <div className="mt-2 text-[8px] opacity-40 uppercase tracking-widest font-mono text-right">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isThinking && (
                 <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex gap-2 items-center">
                       <div className="flex gap-1">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span>
                          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                       </div>
                       <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">Analyzing Market Vectors...</span>
                    </div>
                 </div>
              )}
            </div>

            {/* Input System */}
            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
               <div className="flex gap-2 items-center">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your budget..."
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[var(--color-pac-blue)] transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isThinking}
                    className="w-10 h-10 rounded-xl bg-[var(--color-pac-blue)] text-white flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
                  >
                    <Send size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
