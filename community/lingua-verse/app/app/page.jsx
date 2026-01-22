"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to workspace
    router.push("/workspace/real-time-chat");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse-glow inline-block px-8 py-4 rounded-2xl glass-effect">
          <h1 className="text-4xl font-bold gradient-text mb-2">LinguaVerse</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
