"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTranslationStore, Language } from "@/store/useTranslationStore";

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

function LanguageNode({
  language,
  isSource,
  isTarget,
  isActive,
}: {
  language: Language;
  isSource: boolean;
  isTarget: boolean;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(
    language.coordinates.lat,
    language.coordinates.lng,
    2.02
  );

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      );
    }
  });

  const color = isSource ? "#fdcb6e" : isTarget ? "#00d4aa" : "#64748b";
  const size = isSource ? 0.08 : isTarget ? 0.06 : 0.03;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 0.8 : 0.3}
      />
    </mesh>
  );
}

function ConnectionLine({
  from,
  to,
  progress,
}: {
  from: Language;
  to: Language;
  progress: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const curve = useMemo(() => {
    const start = latLngToVector3(from.coordinates.lat, from.coordinates.lng, 2.02);
    const end = latLngToVector3(to.coordinates.lat, to.coordinates.lng, 2.02);

    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.8);

    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [from, to]);

  const points = useMemo(() => {
    const pts = curve.getPoints(50);
    const visiblePoints = Math.floor(pts.length * progress);
    return pts.slice(0, Math.max(2, visiblePoints));
  }, [curve, progress]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00d4aa" transparent opacity={0.6} />
    </line>
  );
}

function GlobeMesh() {
  const globeRef = useRef<THREE.Mesh>(null);
  const { sourceLanguage, selectedTargetLanguages, isTranslating } =
    useTranslationStore();

  useFrame(() => {
    if (globeRef.current && !isTranslating) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a2530"
          transparent
          opacity={0.9}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Language nodes */}
      {sourceLanguage && (
        <LanguageNode
          language={sourceLanguage}
          isSource={true}
          isTarget={false}
          isActive={isTranslating}
        />
      )}

      {selectedTargetLanguages.map((lang) => (
        <LanguageNode
          key={lang.code}
          language={lang}
          isSource={false}
          isTarget={true}
          isActive={isTranslating}
        />
      ))}

      {/* Connection lines during translation */}
      {isTranslating &&
        sourceLanguage &&
        selectedTargetLanguages.map((lang) => (
          <ConnectionLine
            key={lang.code}
            from={sourceLanguage}
            to={lang}
            progress={1}
          />
        ))}
    </group>
  );
}

export function Globe() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4aa" />

        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <GlobeMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
