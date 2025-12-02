import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';
import { AUTHORS, BOOK_TITLE, SERIES_TITLE } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-fantasy-dark text-fantasy-paper">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fantasy-purple via-fantasy-dark to-black opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 animate-pulse"></div>

      <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-1 border border-fantasy-gold/50 rounded-full text-fantasy-gold text-sm tracking-widest uppercase">
            {SERIES_TITLE}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-fantasy-gold drop-shadow-lg">
            {BOOK_TITLE}
          </h1>
          <p className="text-xl md:text-2xl text-fantasy-cream font-light">
            By {AUTHORS.join(' & ')}
          </p>
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
            The kingdom of Pell is back in this hilarious fantasy adventure. 
            Prepared to be charmed, amused, and possibly turned into a goat.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-fantasy-gold text-fantasy-dark px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <BookOpen size={20} />
              Read Preview
            </button>
            <button className="border border-fantasy-gold text-fantasy-gold px-8 py-3 rounded-lg font-bold hover:bg-fantasy-gold/10 transition-colors duration-300">
              Buy Now
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center"
        >
          {/* Placeholder for Book Cover - Using a thematic placeholder */}
          <div className="relative w-80 md:w-96 aspect-[2/3] bg-fantasy-purple rounded-r-2xl rounded-l-md shadow-2xl flex items-center justify-center border-l-8 border-fantasy-gold overflow-hidden group hover:scale-105 transition-transform duration-500">
             <img 
               src="https://picsum.photos/seed/brigands1/600/900" 
               alt="Book Cover" 
               className="object-cover w-full h-full opacity-80 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
               <span className="text-fantasy-gold font-serif text-3xl font-bold text-center border-b-2 border-fantasy-gold pb-2 mb-2">Pell</span>
               <div className="flex justify-center text-fantasy-accent">
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
               </div>
             </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce text-fantasy-gold/50">
        Scroll to Explore
      </div>
    </div>
  );
};

export default Hero;
