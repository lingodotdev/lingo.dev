import { t } from "@/lib/translations";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-white/60">{t(lang, "hero.kicker")}</p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {t(lang, "hero.title")}
        </h1>

        <p className="max-w-2xl text-base text-white/70">
          {t(lang, "hero.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">{t(lang, "card1.title")}</h2>
          <p className="mt-2 text-sm text-white/70">{t(lang, "card1.desc")}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">{t(lang, "card2.title")}</h2>
          <p className="mt-2 text-sm text-white/70">{t(lang, "card2.desc")}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">{t(lang, "card3.title")}</h2>
          <p className="mt-2 text-sm text-white/70">{t(lang, "card3.desc")}</p>
        </div>
      </div>
    </div>
  );
}
