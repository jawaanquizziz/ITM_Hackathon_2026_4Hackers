'use client';
import { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, Code, Zap } from 'lucide-react';

const LOG_TEMPLATES = [
  "INITIALIZING_NEURAL_LINK...",
  "SCANNING_MARKET_VECTORS...",
  "NODE_01_CONNECTED_//_STABLE",
  "ANALYZING_WHALE_MOVEMENTS...",
  "SENTIMENT_SCORING_//_POSITIVE",
  "DETECTING_ARBITRAGE_OPPORTUNITIES...",
  "UPDATING_CORE_MATRIX...",
  "PAC_ENGINE_V4.2_LOADED",
  "PROTECTING_VAULT_FLOWS...",
];

export default function AgentTerminal() {
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Add an initial set of logs
    setLogs(LOG_TEMPLATES.slice(0, 5).map(text => ({
      text,
      time: new Date().toLocaleTimeString(),
      id: Math.random()
    })));

    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      setLogs(prev => [...prev.slice(-15), {
        text: template,
        time: new Date().toLocaleTimeString(),
        id: Math.random()
      }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-zinc-800 rounded-3xl p-6 shadow-2xl h-[300px] flex flex-col font-mono">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
         <div className="flex items-center gap-2 text-zinc-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Agent Logs</span>
         </div>
         <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
         </div>
      </div>

      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 text-[9px] group transition-all">
             <span className="text-zinc-700 whitespace-nowrap">[{log.time}]</span>
             <span className="text-emerald-500 group-hover:text-emerald-400">
                <span className="text-zinc-600 mr-1">PAC:</span> {log.text}
             </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[var(--color-pac-blue)]/20 flex items-center justify-center text-[var(--color-pac-blue)]">
               <Shield size={12} />
            </div>
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Vault Shield Active</span>
         </div>
         <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
            NODE // 0xPAC
         </div>
      </div>
    </div>
  );
}
