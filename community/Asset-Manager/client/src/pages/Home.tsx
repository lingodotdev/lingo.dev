import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useCreateMeme } from "@/hooks/use-memes";
import { MemeCard } from "@/components/MemeCard";
import { TemplateSelector } from "@/components/TemplateSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Wand2, Languages, Share2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { value: 'es', label: 'Spanish (ES)' },
  { value: 'fr', label: 'French (FR)' },
  { value: 'de', label: 'German (DE)' },
  { value: 'hi', label: 'Hindi (HI)' },
  { value: 'ja', label: 'Japanese (JA)' },
  { value: 'ar', label: 'Arabic (AR)' },
  { value: 'ko', label: 'Korean (KO)' },
  { value: 'pt', label: 'Portuguese (PT)' },
];

const TONES = [
  { value: 'normal', label: 'Normal' },
  { value: 'genz', label: 'Gen Z / Slang' },
  { value: 'formal', label: 'Formal / Royal' },
  { value: 'pirate', label: 'Pirate' },
];

export default function Home() {
  const { toast } = useToast();
  const { translate, isTranslating } = useTranslation();
  const createMeme = useCreateMeme();

  // State
  const [selectedTemplate, setSelectedTemplate] = useState({
    id: 'two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg'
  });
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topPosition, setTopPosition] = useState(10);
  const [bottomPosition, setBottomPosition] = useState(10);
  const [topXPosition, setTopXPosition] = useState(50);
  const [bottomXPosition, setBottomXPosition] = useState(50);
  const [topFontSize, setTopFontSize] = useState(32);
  const [bottomFontSize, setBottomFontSize] = useState(32);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['es', 'fr']);
  const [tone, setTone] = useState<'normal' | 'genz' | 'formal' | 'pirate'>('normal');
  const [pseudoLocalize, setPseudoLocalize] = useState(false);
  const [translations, setTranslations] = useState<Record<string, { top: string; bottom: string }>>({});
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!topText && !bottomText) {
      toast({
        title: "Empty Meme?",
        description: "Add some text first, otherwise it's just a picture!",
        variant: "destructive",
      });
      return;
    }

    if (selectedLangs.length === 0) {
      toast({
        title: "No Languages Selected",
        description: "Select at least one language to translate to.",
        variant: "destructive",
      });
      return;
    }

    try {
      const results = await translate({
        topText,
        bottomText,
        targetLocales: selectedLangs,
        tone,
        pseudoLocalize
      });

      setTranslations(results);
      setHasGenerated(true);

      // Save to history (fire and forget)
      createMeme.mutate({
        templateId: selectedTemplate.id,
        imageUrl: selectedTemplate.url,
        topText,
        bottomText,
        topPosition,
        bottomPosition,
        topXPosition,
        bottomXPosition,
        topFontSize,
        bottomFontSize,
        translations: results
      });

      toast({
        title: "Success!",
        description: "Your multilingual memes are ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate translations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-border/40">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm border border-accent/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Powered by Lingo.dev AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
            >
              Meme-Lingo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl font-light"
            >
              Create viral memes in 8 languages instantly. Break the language barrier with humor.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <TemplateSelector
                selectedId={selectedTemplate.id}
                onSelect={setSelectedTemplate}
              />

              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    Compose Your Masterpiece
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Top Text</Label>
                      <Input
                        placeholder="WHEN THE CODE WORKS"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value.toUpperCase())}
                        className="font-bold uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bottom Text</Label>
                      <Input
                        placeholder="BUT YOU DON'T KNOW WHY"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                        className="font-bold uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Top Text Y-Position</Label>
                        <span className="text-xs text-muted-foreground">{topPosition}%</span>
                      </div>
                      <Slider
                        value={[topPosition]}
                        onValueChange={([val]) => setTopPosition(val)}
                        max={80}
                        step={1}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Bottom Text Y-Position</Label>
                        <span className="text-xs text-muted-foreground">{bottomPosition}%</span>
                      </div>
                      <Slider
                        value={[bottomPosition]}
                        onValueChange={([val]) => setBottomPosition(val)}
                        max={80}
                        step={1}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Top Text X-Position</Label>
                        <span className="text-xs text-muted-foreground">{topXPosition}%</span>
                      </div>
                      <Slider
                        value={[topXPosition]}
                        onValueChange={([val]) => setTopXPosition(val)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Bottom Text X-Position</Label>
                        <span className="text-xs text-muted-foreground">{bottomXPosition}%</span>
                      </div>
                      <Slider
                        value={[bottomXPosition]}
                        onValueChange={([val]) => setBottomXPosition(val)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Top Font Size</Label>
                        <span className="text-xs text-muted-foreground">{topFontSize}px</span>
                      </div>
                      <Slider
                        value={[topFontSize]}
                        onValueChange={([val]) => setTopFontSize(val)}
                        min={12}
                        max={80}
                        step={1}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Bottom Font Size</Label>
                        <span className="text-xs text-muted-foreground">{bottomFontSize}px</span>
                      </div>
                      <Slider
                        value={[bottomFontSize]}
                        onValueChange={([val]) => setBottomFontSize(val)}
                        min={12}
                        max={80}
                        step={1}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                    <Languages className="w-5 h-5 text-accent" />
                    Localization Settings
                  </h3>

                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Target Languages</Label>
                    <ToggleGroup type="multiple" value={selectedLangs} className="justify-start flex-wrap gap-2">
                      {LANGUAGES.map(lang => (
                        <ToggleGroupItem
                          key={lang.value}
                          value={lang.value}
                          onClick={() => toggleLanguage(lang.value)}
                          className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/50 border border-transparent transition-all"
                          aria-label={`Toggle ${lang.label}`}
                        >
                          {lang.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label>Tone of Voice</Label>
                      <Select value={tone} onValueChange={(val: any) => setTone(val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TONES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-3 bg-secondary/20">
                      <div className="space-y-0.5">
                        <Label className="text-base">Pseudo Localization</Label>
                        <p className="text-xs text-muted-foreground">Test UI expansion & accents</p>
                      </div>
                      <Switch
                        checked={pseudoLocalize}
                        onCheckedChange={setPseudoLocalize}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={handleGenerate}
                  disabled={isTranslating}
                >
                  {isTranslating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Translating Magic...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 fill-current" />
                      Generate Multilingual Memes
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-4">
              <Label className="text-muted-foreground font-medium uppercase tracking-wider text-xs ml-1">Live Preview (English)</Label>
              <MemeCard
                imageUrl={selectedTemplate.url}
                topText={topText || "TOP TEXT"}
                bottomText={bottomText || "BOTTOM TEXT"}
                topPosition={topPosition}
                bottomPosition={bottomPosition}
                topXPosition={topXPosition}
                bottomXPosition={bottomXPosition}
                topFontSize={topFontSize}
                bottomFontSize={bottomFontSize}
                language="Original (EN)"
                showDownload={hasGenerated}
              />

              {!hasGenerated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl text-sm flex gap-3 items-start border border-yellow-200 dark:border-yellow-800/50">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>Select your languages and click generate to see the translated versions appear below!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence>
          {hasGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-3xl font-display font-bold">Generated Results</h2>
                <Badge variant="outline" className="text-base px-4 py-1">
                  {Object.keys(translations).length} Translations
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedLangs.map((lang) => {
                  const translation = translations[lang];
                  if (!translation) return null;

                  return (
                    <motion.div
                      key={lang}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MemeCard
                        imageUrl={selectedTemplate.url}
                        topText={translation.top}
                        bottomText={translation.bottom}
                        topPosition={topPosition}
                        bottomPosition={bottomPosition}
                        topXPosition={topXPosition}
                        bottomXPosition={bottomXPosition}
                        topFontSize={topFontSize}
                        bottomFontSize={bottomFontSize}
                        language={LANGUAGES.find(l => l.value === lang)?.label || lang.toUpperCase()}
                        showDownload={true}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
