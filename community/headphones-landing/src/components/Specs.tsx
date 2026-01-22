import Reveal from "./Reveal";
import type { Content } from "../content";

export default function Specs({ content }: { content: Content['specs'] }) {
  return (
    <section id="specs" className="py-24 bg-stone-900 text-stone-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
           <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">{content.title}</h2>
        </Reveal>

        <Reveal className="bg-stone-800/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-stone-700/50" delay={200}>
           <div className="space-y-0">
               {content.items.map((spec, i) => (
                 <div key={i} className="flex flex-col md:flex-row md:items-center py-4 border-b border-stone-700/50 last:border-0 hover:bg-stone-800/50 transition-colors rounded-lg px-4">
                    <dt className="w-full md:w-1/3 font-bold text-white text-lg">{spec.label}</dt>
                    <dd className="w-full md:w-2/3 text-stone-400 mt-1 md:mt-0">{spec.value}</dd>
                 </div>
               ))}
           </div>
        </Reveal>
        
        <Reveal className="mt-12 text-center" delay={400}>
           <p className="text-sm text-stone-500 mb-6">
             {content.disclaimer}
           </p>
           <button className="px-8 py-3 rounded-full border border-stone-600 text-white font-medium hover:bg-white hover:text-stone-900 transition-all duration-300">
             {content.viewDataSheet}
           </button>
        </Reveal>
      </div>
    </section>
  );
}
