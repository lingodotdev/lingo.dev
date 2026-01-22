import { useTranslations } from "next-intl";
import SubspaceTransmitter from "@/components/SubspaceTransmitter";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-12 pb-20">
      
      {/* SECTION 1: Planetary Database (Static/JSON Showcase) */}
      <section>
         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-primary">///</span>
            <span>{t('title')}</span>
         </h2>
         <p className="mb-8 text-blue-200/60 max-w-2xl">
            {t('subtitle')}
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Card 1 */}
             <div className="glass-panel p-6 rounded-xl border-l-4 border-l-purple-500 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded">{t('planets.kepler.type')}</div>
                    <div className="text-4xl">🪐</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('planets.kepler.name')}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">
                   {t('planets.kepler.description')}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-gray-400">
                    <span>{t('planets.kepler.distance')}</span>
                    <span>{t('planets.kepler.habitability')}</span>
                </div>
             </div>

             {/* Card 2 */}
             <div className="glass-panel p-6 rounded-xl border-l-4 border-l-red-500 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-xs font-mono text-red-300 bg-red-500/10 px-2 py-1 rounded">{t('planets.proxima.type')}</div>
                    <div className="text-4xl">🌋</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('planets.proxima.name')}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">
                   {t('planets.proxima.description')}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-gray-400">
                    <span>{t('planets.proxima.distance')}</span>
                    <span>{t('planets.proxima.habitability')}</span>
                </div>
             </div>

             {/* Card 3 */}
             <div className="glass-panel p-6 rounded-xl border-l-4 border-l-cyan-500 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded">{t('planets.gliese.type')}</div>
                    <div className="text-4xl">🌊</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('planets.gliese.name')}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">
                   {t('planets.gliese.description')}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-gray-400">
                    <span>{t('planets.gliese.distance')}</span>
                    <span>{t('planets.gliese.habitability')}</span>
                </div>
             </div>
         </div>
      </section>

      {/* SECTION 2: Subspace Transmitter (Dynamic/SDK Showcase) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-accent">///</span>
            <span>{t('comms.title')}</span>
         </h2>
         <p className="mb-2 text-blue-200/60 max-w-2xl">
            {t('comms.status')}
         </p>
         
         <SubspaceTransmitter />
      </section>

    </div>
  );
}
