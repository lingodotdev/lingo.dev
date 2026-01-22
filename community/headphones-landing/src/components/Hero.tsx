import Reveal from "./Reveal";
import Image from "next/image";
import type { Content } from "../content";

export default function Hero({ content }: { content: Content['hero'] }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wide uppercase">
              {content.newArrival}
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-stone-900 leading-[1.1] mb-6">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              {content.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <button className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-white rounded-full font-bold shadow-xl shadow-amber-500/20 hover:bg-amber-600 hover:scale-105 transition-all duration-300">
                {content.cta}
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-full font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 group">
                <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span>{content.watchVideo}</span>
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center md:justify-start gap-6 text-sm text-stone-500 font-medium">
               <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                   {[1,2,3,4].map((i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200"></div>
                   ))}
                 </div>
                 <span>{content.happyEars}</span>
               </div>
               <div className="w-px h-8 bg-stone-300"></div>
               <div>
                 <span className="font-bold text-stone-900 text-lg">4.9/5</span> Rating
               </div>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
            
            <div className="relative w-full h-full animate-float">
               <Image 
                 src="/hero.png" 
                 alt="LingoBuds Pro Wireless Headphones" 
                 fill
                 className="object-contain drop-shadow-2xl"
                 priority
               />
            </div>

             <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg animate-fade-in-up delay-300 hidden md:block">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center">
                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-xs text-stone-500 font-semibold uppercase">{content.voiceClarity}</p>
                     <p className="text-stone-900 font-bold">{content.hdStudio}</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
