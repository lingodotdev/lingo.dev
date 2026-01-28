import styles from "./page.module.css";
import type { Metadata } from "next";
import VideoPlayer from "@/components/video/Video";
import UiLangPicker from "@/components/uiLangPicker/UiLangPicker";
import ImpactGrid from "@/components/cards/ImpactGrid";
import Footer from "@/components/footer/Footer";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "es", "hi", "ja", "fr", "de"];
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: locale } = await params;
  const dictionary = (await import(`../../public/meta-og/${locale}.json`))
    .default;
  // fetch meta content from your dictionary
  const title = dictionary.meta?.title;
  const description = dictionary.meta?.description;
  // TODO: Generate og images by locale. Now use hindi image as default
  return {
    title,
    description,
    twitter: {
      title: title,
      description: description,
      images: "https://lingo-video.vercel.app/desktop.png",
      creator: "dev Shubham oulkar",
      creatorId: "@shubhuoulkar",
    },
    openGraph: {
      type: "website",
      url: `https://lingo-video.vercel.app/${locale}`,
      title: title,
      description: description,
      siteName: "Lingo.video",
      images: [{ url: "https://lingo-video.vercel.app/og.png" }],
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang: locale } = await params;

  return (
    <div className={styles.page}>
      <nav className={styles.header}>
        <span className={styles.logo}>Lingo.video</span>
        <UiLangPicker paramLocale={locale} />
      </nav>
      <main className={styles.main}>
        <h1>Real time video subtitle translations</h1>
        <VideoPlayer />
        <ImpactGrid />
      </main>
      <Footer />
    </div>
  );
}
