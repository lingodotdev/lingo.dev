"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTranslationStore, Language } from "@/store/useTranslationStore";
import { useThemeStore } from "@/store/useThemeStore";

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Arrival burst effect when translation completes
function ArrivalBurst({
  position,
  theme,
  onComplete,
}: {
  position: THREE.Vector3;
  theme: "dark" | "light";
  onComplete: () => void;
}) {
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);
  const color = theme === "dark" ? "#00d4aa" : "#0d9488";

  useFrame((_, delta) => {
    setScale((prev) => prev + delta * 2);
    setOpacity((prev) => Math.max(0, prev - delta * 2));
    
    if (opacity <= 0) {
      onComplete();
    }
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[scale * 0.3, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
    </mesh>
  );
}

function LanguageNode({
  language,
  isSource,
  isTarget,
  isActive,
  isCompleted,
  theme,
  showLabel,
}: {
  language: Language;
  isSource: boolean;
  isTarget: boolean;
  isActive: boolean;
  isCompleted?: boolean;
  theme: "dark" | "light";
  showLabel?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(
    language.coordinates.lat,
    language.coordinates.lng,
    2.02
  );

  useFrame((state) => {
    if (meshRef.current) {
      if (isActive) {
        meshRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 3) * 0.3
        );
      }
      if (isCompleted && glowRef.current) {
        // Pulsing glow for completed translations
        glowRef.current.scale.setScalar(
          2 + Math.sin(state.clock.elapsedTime * 2) * 0.5
        );
      }
    }
  });

  const sourceColor = theme === "dark" ? "#fdcb6e" : "#f59e0b";
  const targetColor = theme === "dark" ? "#00d4aa" : "#0d9488";
  const completedColor = theme === "dark" ? "#00ff88" : "#10b981";
  const inactiveColor = theme === "dark" ? "#64748b" : "#94a3b8";
  
  let color = inactiveColor;
  if (isSource) color = sourceColor;
  else if (isCompleted) color = completedColor;
  else if (isTarget) color = targetColor;
  
  const size = isSource ? 0.1 : isTarget ? 0.08 : 0.03;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive || isCompleted ? 1 : 0.4}
        />
      </mesh>
      
      {/* Glow effect for active/completed nodes */}
      {(isActive || isCompleted) && (isSource || isTarget) && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 2, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isCompleted ? 0.4 : 0.2}
          />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (isSource || isTarget) && (
        <Html
          position={[0, size + 0.15, 0]}
          center
          style={{
            color: theme === "dark" ? "#f0f4f8" : "#0f172a",
            fontSize: "10px",
            fontWeight: "bold",
            textShadow: theme === "dark" 
              ? "0 0 10px rgba(0,0,0,0.8)" 
              : "0 0 10px rgba(255,255,255,0.8)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {language.name} {isCompleted && "✓"}
        </Html>
      )}
    </group>
  );
}

// Continuous flying particle with looping
function ContinuousFlightParticle({
  from,
  to,
  theme,
  isTranslating,
  isComplete,
  particleIndex,
}: {
  from: Language;
  to: Language;
  theme: "dark" | "light";
  isTranslating: boolean;
  isComplete: boolean;
  particleIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(particleIndex * 0.33); // Stagger start positions
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const curve = useMemo(() => {
    const start = latLngToVector3(from.coordinates.lat, from.coordinates.lng, 2.05);
    const end = latLngToVector3(to.coordinates.lat, to.coordinates.lng, 2.05);
    
    const distance = start.distanceTo(end);
    const arcHeight = Math.min(distance * 0.5, 1.5);
    
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.05 + arcHeight);

    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [from, to]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // If translation complete, start fade out
    if (isComplete && !fadeOut) {
      setFadeOut(true);
    }

    if (fadeOut) {
      setOpacity((prev) => Math.max(0, prev - delta * 2));
      if (opacity <= 0) return;
    }

    // Only animate if translating or fading out
    if (!isTranslating && !fadeOut) return;

    const speed = 0.5 + particleIndex * 0.1; // Slightly different speeds
    let newProgress = progress + delta * speed;
    
    // Loop back to start if still translating
    if (newProgress >= 1) {
      if (isTranslating && !isComplete) {
        newProgress = 0;
        setTrailPositions([]); // Clear trail on loop
      } else {
        newProgress = 1;
      }
    }

    setProgress(newProgress);
    
    const position = curve.getPoint(newProgress);
    meshRef.current.position.copy(position);

    // Update trail
    setTrailPositions((prev) => {
      const newTrail = [...prev, position.clone()];
      return newTrail.slice(-20);
    });
  });

  const particleColor = theme === "dark" ? "#00d4aa" : "#0d9488";
  const particleSize = 0.03 + particleIndex * 0.01;

  if (opacity <= 0) return null;

  return (
    <group>
      {/* Main particle */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[particleSize, 8, 8]} />
        <meshBasicMaterial color={particleColor} transparent opacity={opacity} />
      </mesh>
      
      {/* Inner glow */}
      {meshRef.current && (
        <mesh position={meshRef.current.position}>
          <sphereGeometry args={[particleSize * 2, 8, 8]} />
          <meshBasicMaterial color={particleColor} transparent opacity={opacity * 0.3} />
        </mesh>
      )}

      {/* Trail effect */}
      {trailPositions.length > 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trailPositions.length}
              array={new Float32Array(trailPositions.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={particleColor} transparent opacity={opacity * 0.4} />
        </line>
      )}
    </group>
  );
}

// Static arc path
function FlightPath({
  from,
  to,
  theme,
  isComplete,
}: {
  from: Language;
  to: Language;
  theme: "dark" | "light";
  isComplete: boolean;
}) {
  const curve = useMemo(() => {
    const start = latLngToVector3(from.coordinates.lat, from.coordinates.lng, 2.03);
    const end = latLngToVector3(to.coordinates.lat, to.coordinates.lng, 2.03);
    
    const distance = start.distanceTo(end);
    const arcHeight = Math.min(distance * 0.5, 1.5);
    
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.03 + arcHeight);

    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  const lineColor = isComplete 
    ? (theme === "dark" ? "#00ff88" : "#10b981")
    : (theme === "dark" ? "#00d4aa" : "#0d9488");

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={lineColor} 
        transparent 
        opacity={isComplete ? 0.6 : 0.3}
      />
    </line>
  );
}

function GlobeMesh({ theme }: { theme: "dark" | "light" }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const { sourceLanguage, selectedTargetLanguages, isTranslating, translations } =
    useTranslationStore();
  
  const [showFlights, setShowFlights] = useState(false);
  const [arrivalBursts, setArrivalBursts] = useState<string[]>([]);

  // Track completed translations
  const completedLangs = useMemo(() => {
    return new Set(
      translations
        .filter((t) => !t.isLoading && t.text)
        .map((t) => t.language.code)
    );
  }, [translations]);

  // Start flights when translation starts
  useEffect(() => {
    if (isTranslating) {
      setShowFlights(true);
      setArrivalBursts([]);
    }
  }, [isTranslating]);

  // Trigger arrival bursts when translations complete
  useEffect(() => {
    translations.forEach((t) => {
      if (!t.isLoading && t.text && !arrivalBursts.includes(t.language.code)) {
        setArrivalBursts((prev) => [...prev, t.language.code]);
      }
    });
  }, [translations, arrivalBursts]);

  useFrame(() => {
    if (globeRef.current && !isTranslating && !showFlights) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const isDark = theme === "dark";
  const globeColor = isDark ? "#1a2530" : "#ffffff";
  const wireframeColor = isDark ? "#00d4aa" : "#0d9488";

  // Hide flights after all translations complete and fade out
  useEffect(() => {
    if (!isTranslating && translations.length > 0) {
      const allComplete = translations.every((t) => !t.isLoading);
      if (allComplete) {
        // Keep showing for a bit after completion
        const timer = setTimeout(() => {
          setShowFlights(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isTranslating, translations]);

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          key={`globe-material-${theme}`}
          color={globeColor}
          transparent
          opacity={isDark ? 0.9 : 0.95}
          roughness={isDark ? 0.8 : 0.3}
          metalness={isDark ? 0.2 : 0.1}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          key={`wireframe-material-${theme}`}
          color={wireframeColor}
          transparent
          opacity={isDark ? 0.15 : 0.4}
          wireframe
        />
      </Sphere>

      {/* Language nodes */}
      {sourceLanguage && (
        <LanguageNode
          language={sourceLanguage}
          isSource={true}
          isTarget={false}
          isActive={isTranslating || showFlights}
          theme={theme}
          showLabel={showFlights}
        />
      )}

      {selectedTargetLanguages.map((lang) => (
        <LanguageNode
          key={lang.code}
          language={lang}
          isSource={false}
          isTarget={true}
          isActive={isTranslating}
          isCompleted={completedLangs.has(lang.code)}
          theme={theme}
          showLabel={showFlights}
        />
      ))}

      {/* Flight paths and continuous particles */}
      {showFlights && sourceLanguage && selectedTargetLanguages.map((lang) => {
        const isComplete = completedLangs.has(lang.code);
        return (
          <group key={lang.code}>
            {/* Static path */}
            <FlightPath
              from={sourceLanguage}
              to={lang}
              theme={theme}
              isComplete={isComplete}
            />
            
            {/* Multiple particles per route for richer effect */}
            {[0, 1, 2].map((i) => (
              <ContinuousFlightParticle
                key={`${lang.code}-particle-${i}`}
                from={sourceLanguage}
                to={lang}
                theme={theme}
                isTranslating={isTranslating}
                isComplete={isComplete}
                particleIndex={i}
              />
            ))}

            {/* Arrival burst effect */}
            {isComplete && arrivalBursts.includes(lang.code) && (
              <ArrivalBurst
                position={latLngToVector3(lang.coordinates.lat, lang.coordinates.lng, 2.02)}
                theme={theme}
                onComplete={() => {
                  // Burst complete - could trigger additional effects here
                }}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

function Scene() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const accentColor = isDark ? "#00d4aa" : "#14b8a6";
  
  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 1.2} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={isDark ? 0.8 : 1.5} 
        color={isDark ? "#ffffff" : "#ffffff"}
      />
      <pointLight 
        position={[-5, -5, -5]} 
        intensity={isDark ? 0.3 : 0.5} 
        color={accentColor} 
      />

      {isDark && (
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}

      <GlobeMesh key={`globe-${theme}`} theme={theme} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
        autoRotate={false}
      />
    </>
  );
}

export function Globe() {
  const { theme } = useThemeStore();
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas 
        key={`canvas-${theme}`} 
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
