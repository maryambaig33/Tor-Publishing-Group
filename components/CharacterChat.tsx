import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Mic, User, Loader2 } from 'lucide-react';
import { CHARACTERS } from '../constants';
import { Character, ChatMessage } from '../types';
import { generateCharacterResponse, generateSpeech } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const CharacterChat: React.FC = () => {
  const [activeCharacter, setActiveCharacter] = useState<Character>(Character.BRIGAND);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: CHARACTERS[Character.BRIGAND].systemPrompt.split('.')[0] + "... Hello there traveler!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const aiText = await generateCharacterResponse(activeCharacter, userMsg.text);
    
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: aiText 
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const playAudio = async (text: string, msgId: string) => {
    if (isPlaying === msgId) return; // Already playing this one? (Simplified logic)
    setIsPlaying(msgId);

    const voice = CHARACTERS[activeCharacter].voiceName;
    const buffer = await generateSpeech(text, voice);
    
    if (buffer) {
       if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
       }
       
       const ctx = audioContextRef.current;
       // Resume context if suspended (common browser policy)
       if (ctx.state === 'suspended') {
         await ctx.resume();
       }

       const source = ctx.createBufferSource();
       source.buffer = buffer;
       source.connect(ctx.destination);
       source.onended = () => setIsPlaying(null);
       source.start();
    } else {
      setIsPlaying(null);
    }
  };

  const handleCharacterChange = (char: Character) => {
    setActiveCharacter(char);
    setMessages([{ 
      id: Date.now().toString(), 
      role: 'model', 
      text: `*${CHARACTERS[char].name} steps forward.* "Greetings!"` 
    }]);
  };

  return (
    <div className="bg-fantasy-paper py-20 px-4 md:px-0">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-fantasy-purple mb-4">Chat with the Characters</h2>
          <p className="text-lg text-fantasy-dark/80">Select a character from the book and ask them anything!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-fantasy-gold/20 overflow-hidden flex flex-col md:flex-row h-[600px]">
          {/* Character Selector Sidebar */}
          <div className="w-full md:w-1/3 bg-fantasy-dark p-6 border-r border-fantasy-gold/20 flex flex-col gap-4">
             {Object.keys(CHARACTERS).map((key) => {
               const charKey = key as Character;
               return (
                 <button
                   key={charKey}
                   onClick={() => handleCharacterChange(charKey)}
                   className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${activeCharacter === charKey ? 'bg-fantasy-purple border-fantasy-gold text-white' : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10'}`}
                 >
                   <div className="font-bold font-serif">{CHARACTERS[charKey].name}</div>
                   <div className="text-xs opacity-70 truncate">{CHARACTERS[charKey].description}</div>
                 </button>
               )
             })}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-fantasy-purple text-white rounded-br-none' : 'bg-white text-fantasy-dark border border-fantasy-gold/30 rounded-bl-none'}`}>
                      <div className="flex items-start gap-3">
                        {msg.role === 'model' && (
                          <button 
                            onClick={() => playAudio(msg.text, msg.id)}
                            className={`mt-1 p-2 rounded-full hover:bg-fantasy-gold/20 transition-colors ${isPlaying === msg.id ? 'text-fantasy-gold animate-pulse' : 'text-fantasy-purple/50'}`}
                            title="Read Aloud"
                          >
                            <Volume2 size={16} />
                          </button>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-fantasy-gold/30 flex items-center gap-2">
                     <Loader2 className="animate-spin text-fantasy-gold" size={16} />
                     <span className="text-xs text-fantasy-dark/50 italic">{CHARACTERS[activeCharacter].name} is thinking...</span>
                   </div>
                 </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-fantasy-gold/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask ${CHARACTERS[activeCharacter].name} something...`}
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fantasy-gold/50 bg-fantasy-paper"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                  className="p-3 bg-fantasy-purple text-white rounded-xl hover:bg-fantasy-dark disabled:opacity-50 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterChat;