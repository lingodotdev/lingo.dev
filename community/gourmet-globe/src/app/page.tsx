import { AuroraText } from "@/components/magicui/aurora-text";
import { loadDictionary } from "lingo.dev/react/rsc";
import Image from "next/image";
import { ChefHat, Globe as GlobeIcon, Languages, Zap } from "lucide-react";
import Globe from "@/components/magicui/globe";

export default async function Home() {
  const dictionary = await loadDictionary();
  
  const recipes = [
    { id: "pasta" as const, img: "/images/pasta.png", color: "from-orange-500/20", tag: "Italian" },
    { id: "biryani" as const, img: "/images/biryani.png", color: "from-yellow-500/20", tag: "Indian" },
    { id: "sushi" as const, img: "/images/sushi.png", color: "from-red-500/20", tag: "Japanese" },
    { id: "pastry" as const, img: "/images/pastry.png", color: "from-pink-500/20", tag: "French" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-24 py-16 px-4">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full -z-10" />
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-sm font-medium border border-orange-200 dark:border-orange-800/50">
          <ChefHat size={16} />
          <span>{dictionary.features.ai_localized}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
          <AuroraText colors={["#f97316", "#fbbf24", "#ef4444"]}>
            {dictionary.hero.title}
          </AuroraText>
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
          {dictionary.hero.subtitle}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/40 text-lg">
            {dictionary.hero.cta}
          </button>
        </div>
      </section>

      {/* Featured Recipes Grid */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-orange-500/20 pb-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">
              {dictionary.sections.trending}
            </h2>
            <p className="text-muted-foreground italic">
              {dictionary.footer.mission}
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            {["International", "Healthy", "Desserts"].map(cat => (
              <span key={cat} className="px-4 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${recipe.color} to-transparent p-8 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2`}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="relative w-full lg:w-56 h-56 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/5">
                  <Image
                    src={recipe.img}
                    alt={dictionary.recipes[recipe.id].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 space-y-4 flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-[10px] uppercase tracking-widest font-black text-orange-500 border border-orange-500/20">
                      {recipe.tag}
                    </span>
                    <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                      <span>{dictionary.recipes[recipe.id].prep_time}</span>
                      <span>•</span>
                      <span>{dictionary.recipes[recipe.id].difficulty}</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black group-hover:text-orange-500 transition-colors">
                    {dictionary.recipes[recipe.id].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {dictionary.recipes[recipe.id].description}
                  </p>
                  <button className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm pt-2 hover:gap-3 transition-all">
                    {dictionary.features.view_recipe} <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Lingo.dev Section */}
      <section className="rounded-[4rem] bg-zinc-950 border border-white/5 p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full" />
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Globe size={24} />
            </div>
            <h2 className="text-4xl font-black text-white">
              {dictionary.sections.how_it_works}
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {dictionary.sections.how_it_works_desc}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Languages size={18} className="text-orange-500" />
                  <span>6+ Locales</span>
                </div>
                <p className="text-sm text-zinc-500">Culturally aware translations</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap size={18} className="text-orange-500" />
                  <span>Real-time</span>
                </div>
                <p className="text-sm text-zinc-500">Zero-latency localization</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5 space-y-6">
            <h3 className="text-xl font-bold text-orange-400">{dictionary.features.realtime_translation}</h3>
            <div className="flex flex-wrap gap-3">
              {["EN", "HI", "JA", "ES", "FR", "AR"].map(lang => (
                <div key={lang} className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center font-mono text-zinc-400 text-sm hover:text-white hover:border-orange-500/50 transition-all cursor-default">
                  {lang}
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
               <p className="text-sm text-orange-200 font-medium">
                 &quot;Food brings people together, and Lingo.dev brings food together.&quot;
               </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center space-y-4 pb-12 border-t border-white/5 pt-12">
        <p className="text-zinc-500 font-medium">{dictionary.footer.rights}</p>
        <div className="flex justify-center gap-6 text-xs text-zinc-600 uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Open Source</a>
        </div>
      </footer>
    </div>
  );
}
