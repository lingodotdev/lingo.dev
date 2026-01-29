"use client";

import { useRef, useEffect, useState } from "react";
import Transcript from "../transcript/Transcript";
import style from "./Video.module.css";

const readCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const c = readCookie("lingo-locale");
    if (c) setLocale(c);
  }, []);

  return (
    <div className={style.video_player}>
      <div className={style.video_container}>
        <video
          controls
          preload="metadata"
          ref={videoRef}
          poster="og.png"
          muted={true}
        >
          <source src="emotions.mp4" type="video/mp4" />
          <track
            src="/subtitles/emotions.en.vtt"
            kind="captions"
            srcLang="en"
            label="English"
            default={locale === "en"}
          />
        </video>
        <p className={style.video_note}>
          *Note: Press play to start the cue changes and trigger translations
          with audio. Original audio is muted by default.
        </p>
      </div>
      <Transcript videoRef={videoRef} locale={locale} />
    </div>
  );
}
