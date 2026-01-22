"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Specs from "@/components/Specs";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { useTranslation } from "@/components/TranslationContext";

export default function Home() {
  const { content } = useTranslation();

  return (
    <main className="min-h-screen">
      <Navbar content={content.navbar} />
      <Hero content={content.hero} />
      <Features content={content.features} />
      
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <Reveal animation="slide-in-right" className="order-2 md:order-1">
                  <div className="relative h-[500px] w-full rounded-3xl overflow-hidden group">
                     <Image 
                       src="/lifestyle.png" 
                       alt="Man listening to music"
                       fill
                       className="object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent"></div>
                  </div>
               </Reveal>
               <Reveal className="order-1 md:order-2">
                  <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">{content.lifestyle.title}</h2>
                  <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                     {content.lifestyle.description}
                  </p>
                  <ul className="space-y-4">
                     {content.lifestyle.items.map((item, index) => (
                       <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                          </div>
                          <span className="font-medium text-stone-200">{item}</span>
                       </li>
                     ))}
                  </ul>
               </Reveal>
            </div>
         </div>
      </section>

      <Reviews content={content.reviews} />
      <Specs content={content.specs} />

      <section className="py-24 bg-beige-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Reveal className="max-w-3xl mx-auto mb-12">
               <h2 className="font-serif text-4xl font-bold text-stone-900 mb-4">{content.detail.title}</h2>
               <p className="text-stone-600">{content.detail.description}</p>
            </Reveal>
            
            <Reveal animation="scale-in" className="relative w-full max-w-4xl mx-auto mt-12">
                <div className="relative h-[400px] md:h-[600px] w-full animate-float">
                  <Image 
                     src="/detail.png" 
                     alt="LingoBuds Charging Case"
                     fill
                     className="object-contain drop-shadow-2xl"
                     sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
            </Reveal>
         </div>
      </section>

       <footer className="bg-stone-900 text-stone-500 py-12 border-t border-stone-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="font-serif text-xl font-bold text-white">LingoBuds</span>
            </div>
            <div className="text-sm">
               {content.footer.rights}
            </div>
            <div className="flex gap-6 text-sm">
               {content.footer.links.map((link, i) => (
                  <a key={i} href="#" className="hover:text-amber-500 transition-colors">{link}</a>
               ))}
            </div>
         </div>
       </footer>
    </main>
  );
}
