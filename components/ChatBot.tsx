
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import { chatWithStore } from '../services/geminiService';
import { Product, ChatMessage } from '../types';

interface ChatBotProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ products, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'bot', text: 'مرحباً بك في سوبر ماركت الشارقة! 🧡\nأنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithStore(input, products);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        suggestedProduct: response.productId 
          ? products.find(p => p.id === response.productId) 
          : undefined
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { id: 'err', sender: 'bot', text: 'عذراً، حدث خطأ في الاتصال.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSimilarProducts = (product: Product) => {
      return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 2);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 bg-[#0C612D] hover:bg-[#084d23] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F68B1F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F68B1F]"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-left border border-gray-100 overflow-hidden flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ maxHeight: '600px', height: '80vh' }}>
        
        {/* Header */}
        <div className="bg-[#0C612D] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-[#F68B1F]" />
            </div>
            <div>
              <h3 className="font-bold">المساعد الذكي</h3>
              <p className="text-xs text-green-200">متصل الآن (Gemini)</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[90%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#0C612D] text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap mb-2">{msg.text}</p>
                
                {msg.suggestedProduct && (
                  <div className="space-y-2">
                      {/* Main Suggested Product */}
                      <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 overflow-hidden">
                        <div className="flex gap-2 items-start">
                            <img src={msg.suggestedProduct.imageUrl} className="w-16 h-16 rounded-lg bg-white object-contain border border-gray-100" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold truncate text-gray-800">{msg.suggestedProduct.name}</p>
                                <p className="text-xs text-gray-500 mb-1">{msg.suggestedProduct.category}</p>
                                <div className="flex items-center gap-2">
                                    {msg.suggestedProduct.discount ? (
                                        <>
                                            <span className="text-[#F68B1F] font-bold text-sm">{(msg.suggestedProduct.price * (1 - msg.suggestedProduct.discount/100)).toFixed(2)} ريال</span>
                                            <span className="text-gray-400 line-through text-xs">{msg.suggestedProduct.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-[#F68B1F] font-bold text-sm">{msg.suggestedProduct.price} ريال</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => onAddToCart(msg.suggestedProduct!)}
                            className="mt-2 w-full bg-[#F68B1F] text-white text-xs py-2 rounded-lg hover:bg-[#d97817] flex items-center justify-center gap-1 font-bold shadow-sm"
                        >
                            <ShoppingBag className="w-3 h-3" /> أضف للسلة
                        </button>
                      </div>

                      {/* Similar Products Suggestion */}
                      <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> مقترحات مشابهة:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                              {getSimilarProducts(msg.suggestedProduct).map(sim => (
                                  <div key={sim.id} className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                      <img src={sim.imageUrl} className="w-10 h-10 mx-auto object-contain mb-1" />
                                      <p className="text-[10px] font-bold text-gray-700 truncate">{sim.name}</p>
                                      <p className="text-[10px] text-[#0C612D]">{sim.price} ريال</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 rounded-tl-none">
                    <Loader2 className="w-5 h-5 text-[#F68B1F] animate-spin" />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#0C612D] focus:ring-1 focus:ring-[#0C612D]"
            placeholder="اكتب استفسارك هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[#F68B1F] text-white p-2 rounded-full hover:bg-[#d97817] disabled:opacity-50 transition"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
};
