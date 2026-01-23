import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { t } from "@/lib/translations";

export default function Navbar({ lang }: { lang: string }) {
  return (
    <header className="w-full border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href={`/${lang}`} className="text-lg font-semibold tracking-tight">
          Lingo Starter
        </Link>
        <Link className="hover:text-white" href={`/${lang}`}>
        Home
        </Link>
        <Link className="hover:text-white" href={`/${lang}/about`}>
        {t(lang, "nav.about")}
        </Link>

        <Link className="hover:text-white" href={`/${lang}/pricing`}>
        {t(lang, "nav.pricing")}
        </Link>


        <nav className="flex items-center gap-6 text-sm text-white/80">
          <LanguageSwitcher lang={lang} />
        </nav>
      </div>
    </header>
  );
}
