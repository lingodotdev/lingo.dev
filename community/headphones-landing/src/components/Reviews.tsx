import Reveal from "./Reveal";
import type { Content } from "../content";

export default function Reviews({ content }: { content: Content['reviews'] }) {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-white">
       <div className="absolute top-0 right-0 w-1/2 h-full bg-beige-50/50 -skew-x-12 translate-x-1/4 -z-0"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">{content.title}</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">{content.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {content.items.map((review, i) => (
              <Reveal 
                key={i}
                delay={i * 150}
                className="bg-white p-8 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/30">
                      {review.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{review.author}</div>
                      <div className="text-xs text-amber-500 font-semibold uppercase tracking-wide">{review.role}</div>
                    </div>
                 </div>
                 
                 <div className="flex gap-1 mb-4">
                   {[1,2,3,4,5].map(star => (
                     <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                   ))}
                 </div>

                 <p className="text-stone-600 italic leading-relaxed">"{review.text}"</p>
              </Reveal>
             ))}
          </div>
       </div>
    </section>
  );
}
