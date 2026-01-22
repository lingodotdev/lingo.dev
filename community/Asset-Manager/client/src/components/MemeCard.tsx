import { useRef } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MemeCardProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  topPosition?: number;
  bottomPosition?: number;
  topXPosition?: number;
  bottomXPosition?: number;
  topFontSize?: number;
  bottomFontSize?: number;
  language?: string;
  showDownload?: boolean;
}

export function MemeCard({ 
  imageUrl, 
  topText, 
  bottomText, 
  topPosition = 10, 
  bottomPosition = 10,
  topXPosition = 50,
  bottomXPosition = 50,
  topFontSize = 32,
  bottomFontSize = 32,
  language = "Original (EN)", 
  showDownload = false 
}: MemeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true });
        download(dataUrl, `meme-${language}.png`);
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  return (
    <div className="group relative">
      <Card className="overflow-hidden border-2 border-border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-zinc-900">
        <div ref={cardRef} className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Meme template" 
            className="w-full h-full object-contain"
            crossOrigin="anonymous" 
          />
          
          <div className="absolute inset-0 p-4 pointer-events-none">
            <h2 
              className="absolute text-center text-white uppercase break-words leading-tight tracking-tighter text-meme w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4 left-0"
              style={{ 
                top: `${topPosition}%`, 
                transform: `translateX(${topXPosition - 50}%)`,
                fontSize: `${topFontSize}px`
              }}
            >
              {topText}
            </h2>
            <h2 
              className="absolute text-center text-white uppercase break-words leading-tight tracking-tighter text-meme w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4 left-0"
              style={{ 
                bottom: `${bottomPosition}%`, 
                transform: `translateX(${bottomXPosition - 50}%)`,
                fontSize: `${bottomFontSize}px`
              }}
            >
              {bottomText}
            </h2>
          </div>

          <div className="absolute top-2 right-2">
             <Badge variant="secondary" className="shadow-md font-bold uppercase tracking-wider opacity-90 backdrop-blur-sm">
                {language}
             </Badge>
          </div>
        </div>
      </Card>
      
      {showDownload && (
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <Button 
            size="sm" 
            onClick={handleDownload}
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}
