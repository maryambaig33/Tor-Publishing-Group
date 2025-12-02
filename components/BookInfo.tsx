import React from 'react';
import { REVIEWS } from '../constants';
import { Star, Quote } from 'lucide-react';

const BookInfo: React.FC = () => {
  return (
    <section className="py-24 bg-fantasy-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-fantasy-gold/10 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-fantasy-purple/5 rounded-tl-full"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-fantasy-dark mb-6">What People Are Saying</h2>
          <div className="h-1 w-24 bg-fantasy-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-fantasy-paper relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-6 right-6 text-fantasy-gold/30" size={40} />
              <div className="flex text-fantasy-gold mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-fantasy-dark/80 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="mt-auto">
                <p className="font-bold text-fantasy-purple">{review.author}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{review.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookInfo;
