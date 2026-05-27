import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { gemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Loader2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatAssistant: React.FC = () => {
  const { lang, city } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const fullHistory = [
      ...messages,
      userMsg
    ];

    const response = await gemini.getChatResponse(fullHistory, city.name);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-32 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass w-[320px] md:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden shadow-2xl border-glitch-cyan/30"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-glitch-cyan flex items-center justify-center text-space-black animate-pulse">
                   🌌
                </div>
                <div>
                   <h3 className="font-display font-bold text-sm tracking-tight">SkyPak Assistant</h3>
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] opacity-50 uppercase font-black">Connected to Cosmos</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-full text-moon-white/50"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <p className="text-sm text-moon-white/50 font-urdu italic">
                    {lang === 'ur' ? 'عربوں ستاروں کے درمیان خوش آمدید! میں آپ کی کیا مدد کر سکتا ہوں؟' : 'Welcome among the stars! How can I guide you tonight?'}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      lang === 'ur' ? 'آج رات آسمان میں کیا ہے؟' : 'What is in the sky tonight?',
                      lang === 'ur' ? 'اگلا گرہن کب ہے؟' : 'When is the next eclipse?',
                      lang === 'ur' ? 'لاہور سے بہترین نظارے' : 'Best views from Lahore'
                    ].map((q, i) => (
                      <button 
                        key={i} 
                        onClick={() => setInput(q)}
                        className="text-[10px] uppercase font-black p-2 border border-white/10 rounded hover:bg-white/5 transition-colors"
                      >
                         {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-space-blue text-space-black font-bold rounded-tr-none' 
                    : 'bg-white/10 text-moon-white rounded-tl-none border border-white/10'
                  }`}>
                    <div className="prose prose-invert prose-sm">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10">
                    <Loader2 size={18} className="animate-spin text-space-blue" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={lang === 'ur' ? 'یہاں لکھیں...' : 'Ask about the stars...'}
                  className={`w-full bg-space-black/50 border border-white/10 rounded-full py-3 px-5 pr-12 focus:outline-none focus:border-space-blue/50 transition-colors text-sm ${lang === 'ur' ? 'font-urdu' : ''}`}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 p-1.5 text-space-blue hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group h-14 bg-white/10 backdrop-blur-md p-2 pl-6 border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all flex items-center gap-3"
      >
        <span className="text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pr-2">
           {lang === 'ur' ? 'فلکیاتی مدد' : 'Ask SkyPak AI'}
        </span>
        <div className="w-12 h-12 bg-gradient-to-tr from-space-blue to-indigo-900 rounded-full flex items-center justify-center text-xl shadow-lg ring-2 ring-white/10">
           🤖
        </div>
      </button>
    </div>
  );
};
