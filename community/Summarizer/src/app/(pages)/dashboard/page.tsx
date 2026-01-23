'use client';

import { tools } from '@/lib/data';
import { ToolCard } from '@/components/tool-card';
import { SearchTools } from '@/components/search-tools';
import { useLocalization } from '@/i18n/context';

export default function DashboardPage() {
  const { t } = useLocalization();
  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t('dashboard.title', 'Welcome to the LingoForge Toolkit')}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              {t('dashboard.description', 'Discover, use, and create powerful AI-driven tools. Start by exploring our toolkit or ask our AI for suggestions.')}
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
             <SearchTools />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
