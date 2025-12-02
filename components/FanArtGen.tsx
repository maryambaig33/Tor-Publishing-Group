import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { generateFanArt } from '../services/geminiService';
import { motion } from 'framer-motion';

const FanArtGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const base64Image = await generateFanArt(prompt);
      if (base64Image) {
        setGeneratedImage(base64Image);
      } else {
        setError("Failed to conjure image. Try a different spell (prompt).");
      }
    } catch (err) {
      setError("The magic fizzled. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-fantasy-dark text-fantasy-paper py-20 px-4">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-fantasy-gold mb-2">
            <Sparkles className="animate-pulse" />
            <span className="uppercase tracking-widest text-sm font-bold">AI Visualizer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            Visualize the <span className="text-fantasy-gold">Magic</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Describe a scene, a character, or a fantastical bread loaf, and our magical engine will paint it for you in the style of the book.
          </p>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            <label className="block text-sm text-gray-400 mb-2">Your Vision</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A goblin holding a baguette sword standing on a hill..."
              className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-fantasy-gold focus:ring-1 focus:ring-fantasy-gold h-32 resize-none mb-4"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-fantasy-gold to-orange-500 text-fantasy-dark font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" /> Conjuring...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Generate Fan Art
                </>
              )}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm text-center">{error}</p>}
          </div>
        </div>

        <div className="relative aspect-square bg-black/40 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
          {generatedImage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full group"
            >
              <img src={generatedImage} alt="Generated Fan Art" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={generatedImage} 
                  download={`pell-art-${Date.now()}.png`}
                  className="bg-white text-fantasy-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-fantasy-gold transition-colors"
                >
                  <Download size={20} /> Save Masterpiece
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-white/30 p-8">
              {isGenerating ? (
                 <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 border-4 border-fantasy-gold border-t-transparent rounded-full animate-spin"></div>
                   <p>Weaving pixels...</p>
                 </div>
              ) : (
                <>
                  <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Your creation will appear here.</p>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FanArtGen;
