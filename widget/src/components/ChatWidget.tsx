import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, Bot, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // Changed to string for serialization
}

const STORAGE_KEY = 'chat_widget_history';

export function ChatWidget({ businessId: _businessId }: { businessId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  // Save history to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    // Auto-scroll to bottom
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Optimistic UI: Detect email for lead capture locally first (UI feedback could be added here)
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      if (emailRegex.test(input)) {
        // Fire lead capture logic silently
      }

    //   const response = await fetch('http://localhost:3000/api/chat', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       message: input,
    //       businessId,
    //     }),
    //   });

      // Simulation for now since backend is not running on same port for widget dev usually
      // In production, this would be a real fetch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMsg: Message = {
         id: (Date.now() + 1).toString(),
         role: 'assistant',
         content: "I'm a simulated AI response for the widget demo. I can help you with your website needs!",
         timestamp: new Date().toISOString(),
      };
       setMessages(prev => [...prev, assistantMsg]);

      // Real fetch implementation (commented out for pure UI dev flow if backend isn't proxying)
      /* 
      if (!response.ok) throw new Error('Failed to chat');
      const reader = response.body?.getReader();
      ... stream handling ...
      */

    } catch (error) {
      console.error(error);
      // Add error message to chat
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans antialiased text-slate-900">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex h-[600px] w-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-slate-200/50 bg-white/50 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                  <Bot className="h-6 w-6" />
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">AI Assistant</h3>
                  <p className="text-[11px] font-medium text-slate-500">Always active</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                         <div className="mb-4 rounded-full bg-blue-50 p-4">
                            <Sparkles className="h-8 w-8 text-blue-500" />
                         </div>
                        <p className="text-sm font-medium text-slate-600">How can I help you today?</p>
                        <p className="text-xs text-slate-400 mt-1">Ask me about services, pricing, or support.</p>
                    </div>
                )}

              {messages.map((m) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {m.role === 'assistant' && (
                        <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white shadow-sm">
                            <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                    )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm shadow-sm transition-all ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-blue-500/20'
                        : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'
                    }`}
                  >
                    {m.content}
                    <p className={`mt-1 text-[9px] opacity-70 flex justify-end ${m.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                >
                   <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white">
                        <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 bg-white/80 p-4 backdrop-blur-md">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-12 text-sm text-slate-800 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-blue-500/30 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:bg-blue-700 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-1.5 opacity-60">
                 <span className="text-[10px] text-slate-400">Powered by</span>
                 <span className="text-[10px] font-semibold text-slate-600">AssistAI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 transition-all hover:bg-blue-700"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-blue-600/30 blur-lg group-hover:bg-blue-600/50 transition-all"></span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
