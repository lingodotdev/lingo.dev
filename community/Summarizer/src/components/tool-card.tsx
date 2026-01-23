'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/context';
import { getToolUrl } from '@/lib/utils';

export function ToolCard({ tool }: { tool: Tool }) {
  const placeholder = PlaceHolderImages.find(p => p.id === tool.id);
  const { t } = useLocalization();

  const href = getToolUrl(tool.id);

  const getTranslatedLabel = (id: string, defaultLabel: string) => {
    const keyMap: { [key: string]: string } = {
      'documentation-generator': 'sidebar.documentationGenerator',
      'topic-summarizer': 'sidebar.topicSummarizer',
    };
    return t(keyMap[id] || id, defaultLabel);
  };

  const toolName = getTranslatedLabel(tool.id, tool.name);

  return (
    <Card className="flex h-full transform flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          {tool.icon && <tool.icon className="h-6 w-6 text-primary" />}
          {toolName}
        </CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {placeholder && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={placeholder.imageUrl}
              alt={placeholder.description}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" suppressHydrationWarning>
          <Link href={href}>
            {t('toolCard.open', 'Open Tool')} <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
