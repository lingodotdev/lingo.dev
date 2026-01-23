"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [249 / 255, 115 / 255, 22 / 255], // Orange-500
      glowColor: [1, 1, 1],
      markers: [
        // Landmarks for our 6 locales
        { location: [28.6139, 77.2090], size: 0.1 }, // New Delhi (HI)
        { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo (JA)
        { location: [48.8566, 2.3522], size: 0.08 }, // Paris (FR)
        { location: [40.4168, -3.7038], size: 0.08 }, // Madrid (ES)
        { location: [24.7136, 46.6753], size: 0.08 }, // Riyadh (AR)
        { location: [40.7128, -74.0060], size: 0.08 }, // New York (EN)
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className="opacity-60 pointer-events-none"
    />
  );
}
