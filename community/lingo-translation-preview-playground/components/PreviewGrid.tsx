import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface PreviewGridProps {
  originalText: string;
  translations: Record<string, string>;
  isLoading: boolean;
  selectedLanguages: string[];
}

export function PreviewGrid({
  originalText,
  translations,
  isLoading,
  selectedLanguages,
}: PreviewGridProps) {
  const locales = Object.keys(translations);

  if (!isLoading && locales.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <SourceCard text={originalText} />

      {isLoading &&
        locales.length === 0 &&
        selectedLanguages.map((lang) => <LoadingCard key={lang} />)}

      {locales.map((locale) => (
        <TranslationCard
          key={locale}
          locale={locale}
          text={translations[locale]}
          sourceLength={originalText.length}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground">
      Enter text and click Generate Previews to see the magic
    </div>
  );
}

function SourceCard({ text }: { text: string }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between px-4 py-3 border-b bg-muted/50">
        <span className="text-sm font-semibold">English (Source)</span>
        <Badge variant="outline">{text.length} chars</Badge>
      </CardHeader>

      <CardContent className="p-4 flex-grow text-sm whitespace-pre-wrap">
        {text || <i className="text-muted-foreground">Empty…</i>}
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="px-4 py-3 border-b bg-muted/50">
        <Skeleton className="h-4 w-24" />
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

function TranslationCard({
  locale,
  text,
  sourceLength,
}: {
  locale: string;
  text: string;
  sourceLength: number;
}) {
  const lang =
    SUPPORTED_LANGUAGES.find((l) => l.code === locale)?.name ?? locale;

  const diff = text.length - sourceLength;
  const percent =
    sourceLength > 0 ? Math.round((diff / sourceLength) * 100) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between px-4 py-3 border-b bg-muted/30">
        <span className="text-sm font-semibold">
          {lang} ({locale})
        </span>

        <div className="flex gap-2">
          <Badge variant="secondary">{text.length} chars</Badge>
          <Badge
            variant="outline"
            className={
              diff > 0
                ? "text-amber-600 border-amber-200"
                : "text-green-600 border-green-200"
            }
          >
            {diff > 0 && "+"}
            {percent}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 text-sm whitespace-pre-wrap">
        {text}
      </CardContent>
    </Card>
  );
}
