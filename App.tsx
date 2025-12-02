import React from 'react';
import Hero from './components/Hero';
import BookInfo from './components/BookInfo';
import CharacterChat from './components/CharacterChat';
import FanArtGen from './components/FanArtGen';
import { Scroll, Info } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-fantasy-dark/90 backdrop-blur-md border-b border-white/10 text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-serif font-bold text-xl text-fantasy-gold">
            <Scroll className="text-fantasy-gold" />
            <span>Pell Chronicles</span>
          </div>
          <div className="flex gap-6 text-sm font-bold tracking-wide">
            <a href="#hero" className="hover:text-fantasy-gold transition-colors">Home</a>
            <a href="#chat" className="hover:text-fantasy-gold transition-colors">Chat</a>
            <a href="#create" className="hover:text-fantasy-gold transition-colors">Create</a>
            <a href="#reviews" className="hover:text-fantasy-gold transition-colors">Reviews</a>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>

        <section id="chat">
          <CharacterChat />
        </section>

        <section id="create">
          <FanArtGen />
        </section>
        
        <section id="reviews">
          <BookInfo />
        </section>
      </main>

      <footer className="bg-fantasy-dark text-gray-400 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-fantasy-gold mb-4">
             <Info size={16} />
             <span className="text-sm">Powered by Google Gemini 2.5 Flash & Imagen</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Tor Publishing Group. All rights reserved.</p>
          <p className="text-xs max-w-2xl mx-auto opacity-50">
            This is a demo application. 'Brigands & Breadknives' and 'The Tales of Pell' characters are property of Kevin Hearne & Delilah S. Dawson. AI responses are generated dynamically and may not reflect actual book canon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
