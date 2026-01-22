import type { Content } from "../content";

export default function Features({ content }: { content: Content['features'] }) {
  const icons = [
    (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ),
    (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">{content.why}</span>
           <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mt-2 mb-4">{content.title}</h2>
           <p className="text-stone-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {content.items.map((item, index) => (
               <div key={index} className="bg-beige-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group cursor-default">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-stone-900">
                    {icons[index]}
                 </div>
                 <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">{item.title}</h3>
                 <p className="text-stone-600 leading-relaxed">
                   {item.description}
                 </p>
               </div>
             ))}
        </div>
      </div>
    </section>
  );
}
