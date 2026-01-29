"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lingo-locale="))
      ?.split("=")[1];

    router.replace(cookieLang ? `/${cookieLang}` : "/en");
  }, [router]);

  return null;
}
