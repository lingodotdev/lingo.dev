import { AuroraText } from "@/components/magicui/aurora-text";
import { loadDictionary } from "lingo.dev/react/rsc";
import Image from "next/image";

export default async function Home() {
  const dictionary = await loadDictionary();
  
  const recipes = [
    { id: "pasta" as const, img: "/images/pasta.png", color: "from-orange-500/20" },
    { id: "biryani" as const, img: "/images/biryani.png", color: "from-yellow-500/20" },
    { id: "sushi" as const, img: "/images/sushi.png", color: "from-red-500/20" },
    { id: "pastry" as const, img: "/images/pastry.png", color: "from-pink-500/20" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <AuroraText colors={["#FF5733", "#FFC300", "#C70039"]}>
            {dictionary.hero.title}
          </AuroraText>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {dictionary.hero.subtitle}
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20">
            {dictionary.hero.cta}
          </button>
        </div>
      </section>

      {/* Featured Recipes Grid */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold border-l-4 border-orange-500 pl-4">
          {dictionary.sections.trending}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${recipe.color} to-transparent p-6 hover:shadow-2xl transition-all duration-500`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={recipe.img}
                    alt={dictionary.recipes[recipe.id].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-orange-400 border border-orange-500/20">
                    {dictionary.features.ai_localized}
                  </span>
                  <h3 className="text-2xl font-bold group-hover:text-orange-500 transition-colors">
                    {dictionary.recipes[recipe.id].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dictionary.recipes[recipe.id].description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats/Lingo Section */}
      <section className="rounded-[3rem] bg-zinc-900 border border-white/5 p-12 text-center space-y-4">
        <h2 className="text-2xl font-semibold opacity-80 backdrop-blur-sm">
          {dictionary.features.realtime_translation}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-zinc-500">
          <span>EN</span>
          <span>•</span>
          <span>HI</span>
          <span>•</span>
          <span>JA</span>
          <span>•</span>
          <span>ES</span>
          <span>•</span>
          <span>FR</span>
          <span>•</span>
          <span>AR</span>
        </div>
      </section>

      <footer className="text-center text-zinc-600 pt-8 border-t border-white/5">
        <p>{dictionary.footer.rights} </p>
      </footer>
    </div>
  );
}
