"use client";

import { useState, useEffect, type RefObject, useRef } from "react";
import LangPicker from "../common/LangPicker";
import styles from "./Transcript.module.css";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  locale: string;
}

function isVTTCue(cue: TextTrackCue | null | undefined): cue is VTTCue {
  return !!cue && "text" in cue;
}

export default function Transcript({ videoRef, locale }: Props) {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [status, setStatus] = useState("idle");
  const [wsLocale, setWsLocale] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const translateDebounce = useRef<any>(null);

  const resolveLocale = wsLocale || locale;

  // playback scheduling state
  const playbackTimeRef = useRef<number | null>(null);
  // const bufferAhead = 0.12;
  const minStartDelay = 0.05;

  // ensure audio context exists and is resumed on user gesture
  function getAudioContext(): AudioContext {
    if (!window.audioCtx) {
      window.audioCtx = new AudioContext();
    }
    return window.audioCtx;
  }

  // Convert base64 -> Int16Array (PCM16 little-endian)
  function base64ToInt16Array(base64: string) {
    const binary = atob(base64);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
    // Interpret as little-endian 16-bit signed values
    const view = new DataView(u8.buffer);
    const out = new Int16Array(Math.floor(u8.byteLength / 2));
    for (let i = 0; i < out.length; i++) {
      out[i] = view.getInt16(i * 2, true);
    }
    return out;
  }

  // Convert Int16 -> Float32 [-1..1]
  function int16ToFloat32(int16: Int16Array) {
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }
    return float32;
  }

  // Schedule a PCM base64 chunk for playback
  async function schedulePCMChunk(
    base64: string,
    sampleRate = 24000,
    channels = 1,
  ) {
    // Ensure AudioContext resumed
    const audioCtx = getAudioContext();
    if (audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed, user gesture required:", e);
      }
    }

    const int16 = base64ToInt16Array(base64);
    const float32 = int16ToFloat32(int16);

    const frameCount = float32.length / channels;
    const audioBuffer = audioCtx.createBuffer(channels, frameCount, sampleRate);

    if (channels === 1) {
      audioBuffer.getChannelData(0).set(float32);
    } else {
      for (let ch = 0; ch < channels; ch++) {
        const chData = audioBuffer.getChannelData(ch);
        let idx = 0;
        for (let i = ch; i < float32.length; i += channels) {
          chData[idx++] = float32[i];
        }
      }
    }

    if (playbackTimeRef.current === null) {
      playbackTimeRef.current = audioCtx.currentTime + minStartDelay;
    }
    const startTime = Math.max(
      playbackTimeRef.current,
      audioCtx.currentTime + 0.01,
    );

    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(audioCtx.destination);
    src.start(startTime);

    playbackTimeRef.current = startTime + audioBuffer.duration;
    const maxQueueAhead = 10;
    if (playbackTimeRef.current - audioCtx.currentTime > maxQueueAhead) {
      playbackTimeRef.current = audioCtx.currentTime + maxQueueAhead;
    }
  }

  useEffect(() => {
    function connect() {
      const socket = new WebSocket(
        process.env.NODE_ENV === "development"
          ? "ws://localhost:3001/ws"
          : "wss://lingo-video-ws.onrender.com/ws",
      );

      ws.current = socket;

      socket.onopen = () => {
        console.log(`WS connected: ${socket.url}`);
        setStatus("ws-connected");
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          // TEXT TRANSLATION RESPONSE
          if (data.translated) {
            setTranslatedText(data.translated);
          }

          // AUDIO CHUNK FROM SERVER (raw PCM base64)
          if (data.type === "audio-chunk" && data.data) {
            // mimeType might look like "audio/pcm;rate=24000"
            const sampleRate =
              data.sampleRate || parseRateFromMime(data.mimeType) || 24000;
            const channels = data.channels || 1;
            // schedule chunk
            await schedulePCMChunk(data.data, sampleRate, channels);
          }
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      socket.onerror = (err) => {
        console.error("WS error", err);
      };

      socket.onclose = () => {
        console.warn("WS closed — reconnecting in 1s...");
        setTimeout(connect, 1000);
      };
    }

    connect();
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = Array.from(video.textTracks);
    const englishTrack = tracks.find((t) => t.language.toLowerCase() === "en");
    if (!englishTrack) return;

    englishTrack.mode = "hidden";

    englishTrack.oncuechange = () => {
      const cue = englishTrack.activeCues?.[0];
      if (!isVTTCue(cue)) return;

      const cueText = cue.text;
      setText(cueText);

      clearTimeout(translateDebounce.current);
      translateDebounce.current = setTimeout(() => {
        ws.current?.send(
          JSON.stringify({
            text: cueText,
            sourceLocale: "en",
            targetLocale: resolveLocale,
          }),
        );
      }, 0);
    };
  }, [locale, wsLocale, videoRef]);

  return (
    <div className={styles.transcriptCard}>
      <h3 className={styles.cardTitle}>
        <svg
          className={styles.cardIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Real-Time Transcript
      </h3>

      <div className={styles.spaceY}>
        <div className={styles.originalBox}>
          <p className={styles.labelOriginal}>
            Original (<span>en</span>):
          </p>
          <p className={styles.textContent}>
            {text || "Waiting for video playback..."}
          </p>
        </div>

        <div className={styles.translatedBox}>
          <div className={styles.labelTranslated}>
            <span>
              Translated to (<span>{resolveLocale}</span>) using Lingo Engine
            </span>
            <LangPicker
              currentLocale={resolveLocale}
              callback={(code) => setWsLocale(code)}
            />
          </div>
          <p className={styles.textContent}>
            {translatedText || "Awaiting translation..."}
          </p>
        </div>
      </div>

      <div className={styles.statusFooter}>
        <p>
          *Note: Change the language in the Lingo engine to receive real-time
          translated audio. Due to streaming and decoding, audio may start a few
          seconds later.
        </p>
        <p>
          WS Status: <span className={styles.statusOk}>{status}</span>
        </p>
      </div>
    </div>
  );
}

function parseRateFromMime(mime?: string) {
  if (!mime) return undefined;
  const parts = mime.split(";").map((s) => s.trim());
  for (const p of parts) {
    if (p.startsWith("rate=")) {
      const v = parseInt(p.split("=")[1], 10);
      if (!isNaN(v)) return v;
    }
  }
  return undefined;
}
