import { t } from "@/lib/translations";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t(lang, "about.title")}
      </h1>
      <p className="max-w-2xl text-white/75">{t(lang, "about.desc")}</p>
    </div>
  );
}
