'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Search, LoaderCircle, Lightbulb } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { suggestToolsAction } from '@/lib/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocalization } from '@/i18n/context';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Search">
      {pending ? <LoaderCircle className="animate-spin" /> : <Search />}
    </Button>
  );
}

export function SearchTools() {
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();

  const handleSearch = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    setError(null);
    setSuggestedTools([]);

    const result = await suggestToolsAction(query);
    if (result.success && result.tools) {
      setSuggestedTools(result.tools);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
  };

  return (
    <div className="space-y-4">
      <form action={handleSearch} className="flex w-full items-center gap-2">
        <Input
          name="query"
          type="search"
          placeholder={t('search.placeholder', 'Describe what you want to do...')}
          className="flex-grow"
        />
        <SubmitButton />
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>{t('search.errorTitle', 'Error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestedTools.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle className="font-headline">{t('search.suggestionsTitle', 'Suggested Tools')}</AlertTitle>
          <AlertDescription>
            {t('search.suggestionsDescription', 'Based on your query, we suggest looking at these tools:')}
            <ul className="mt-2 list-disc pl-5">
              {suggestedTools.map((tool, index) => (
                <li key={index} className="font-semibold">{tool}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
