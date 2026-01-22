import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MEME_TEMPLATES = [
  { id: 'two-buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'distracted-bf', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'drake', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'one-does-not', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg' },
  { id: 'smart-guy', name: 'Roll Safe Think About It', url: 'https://i.imgflip.com/1h7in3.jpg' },
  { id: 'change-mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { id: 'disaster-girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' },
  { id: 'batman-slapping', name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/9ehk.jpg' },
];

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: typeof MEME_TEMPLATES[0]) => void;
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-display font-semibold mb-3">Choose a Template</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex w-max space-x-4 p-1">
          {MEME_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedId === template.id 
                  ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20 scale-105" 
                  : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <div className="w-32 h-32 relative">
                 <img 
                    src={template.url} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-medium truncate px-2">{template.name}</span>
                 </div>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
