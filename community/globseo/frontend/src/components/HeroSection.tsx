import { useState } from "react";

export function HeroSection() {
  const [activeImage, setActiveImage] = useState<"image" | "jp">("jp");

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1
              className="mb-6 tracking-tight leading-[1.1]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 'clamp(3.75rem, 8vw, 5rem)',
              }}
            >
              <div className="mb-2">Rank.</div>
              <div className="mb-2">Optimize.</div>
              <div className="text-[#a3ff12]">Globalize.</div>
            </h1>
            <br />
            <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Generate SEO metadata and optimize content using AI in
              <i className="text-white"> seconds</i>.
            </p>

            {/* <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
              <Button className="bg-[#a3ff12] hover:bg-[#92e610] text-black h-12 px-8 text-base">
                Get started
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/5 gap-2 h-12 px-6 border border-white/10">
                <Play className="w-4 h-4" />
                Watch demo
              </Button>
            </div> */}

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div>
                <div className="text-2xl text-white/90">60+</div>
                <div className="text-sm text-white/40">Languages</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-2xl text-white/90">AI</div>
                <div className="text-sm text-white/40">Insights</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-2xl text-white/90">&lt;30s</div>
                <div className="text-sm text-white/40">Response</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a3ff12]/20 via-transparent to-transparent blur-3xl"></div>
            <div className="relative">
              {/* Stacked Images Effect - Click to Bring to Front */}
              <div className="relative">
                {/* Back image - jp.png */}
                <div
                  onClick={() => setActiveImage("jp")}
                  className="absolute w-full rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200 cursor-pointer transition-all ease-in-out"
                  style={{
                    top: "300px",
                    left: "-150px",
                    zIndex: activeImage === "jp" ? 30 : 10,
                    transform:
                      activeImage === "jp" ? "scale(1.02)" : "scale(1)",
                    transitionDuration: "500ms",
                    boxShadow:
                      activeImage === "jp"
                        ? "0 0 0 2px #a3ff12, 0 0px 30px rgba(163, 255, 18, 0.4)"
                        : "0 0 0 2px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <img
                    src="/jp.png"
                    alt="Japanese Translation Preview"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                {/* Front image - image.png */}
                <div
                  onClick={() => setActiveImage("image")}
                  className="relative rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 cursor-pointer transition-all ease-in-out"
                  style={{
                    zIndex: activeImage === "image" ? 30 : 20,
                    transform:
                      activeImage === "image" ? "scale(1.02)" : "scale(1)",
                    transitionDuration: "500ms",
                    boxShadow:
                      activeImage === "image"
                        ? "0 0 0 2px #a3ff12, 0 0px 30px rgba(163, 255, 18, 0.4)"
                        : "0 0 0 2px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <img
                    src="/image.png"
                    alt="GlobSEO Platform Preview"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
    </section>
  );
}
