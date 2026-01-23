import { t } from "@/lib/translations";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(lang, "pricing.title")}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">{t(lang, "pricing.starter")}</h2>
          <p className="mt-2 text-white/70">{t(lang, "pricing.starterDesc")}</p>
          <p className="mt-5 text-2xl font-semibold">
            {t(lang, "pricing.free")}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">{t(lang, "pricing.pro")}</h2>
          <p className="mt-2 text-white/70">{t(lang, "pricing.proDesc")}</p>
          <p className="mt-5 text-2xl font-semibold">
            {t(lang, "pricing.proPrice")}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">{t(lang, "pricing.team")}</h2>
          <p className="mt-2 text-white/70">{t(lang, "pricing.teamDesc")}</p>
          <p className="mt-5 text-2xl font-semibold">
            {t(lang, "pricing.teamPrice")}
          </p>
        </div>
      </div>
    </div>
  );
}
