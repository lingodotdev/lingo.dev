'use client';

import { useState } from 'react';
import { BrainCircuit, FileText, LoaderCircle } from 'lucide-react';
import { SummarizerForm } from '@/components/summarizer-form';
import { summarizeTopicAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SummarizerFormData = {
    textToSummarize: string;
}

export default function TopicSummarizerPage() {
  const [result, setResult] = useState<{
    summary?: string;
    error?: string;
    isPending: boolean;
  }>({ isPending: false });

  const handleFormAction = async (data: SummarizerFormData) => {
    setResult({ isPending: true });
    const response = await summarizeTopicAction(data);
    setResult({ ...response, isPending: false });
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="font-headline flex items-center gap-3 text-3xl font-bold tracking-tighter sm:text-4xl">
              <BrainCircuit className="h-8 w-8 text-primary" />
              Topic Summarizer Tool
            </h1>
            <p className="text-muted-foreground">
              Provide any text, and our AI will generate a concise summary,
              highlighting the key points for you.
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <SummarizerForm onFormAction={handleFormAction} isPending={result.isPending} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
            <h2 className="font-headline flex items-center gap-3 text-3xl font-bold tracking-tighter sm:text-4xl">
                <FileText className="h-8 w-8 text-primary" />
                Generated Summary
            </h2>
            <Card className="min-h-[500px]">
                <CardContent className="p-6">
                    {result.isPending && (
                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-muted-foreground">
                            <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
                            <p className="font-headline text-lg">AI is thinking...</p>
                            <p className="text-sm">Generating your summary now.</p>
                        </div>
                    )}
                    {result.error && (
                        <Alert variant="destructive">
                            <AlertTitle>Generation Failed</AlertTitle>
                            <AlertDescription>
                                {result.error.includes('429')
                                    ? "You've made too many requests. Please wait a moment before trying again."
                                    : result.error
                                }
                            </AlertDescription>
                        </Alert>
                    )}
                    {result.summary && (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap bg-card font-sans">{result.summary}</pre>
                        </div>
                    )}
                    {!result.isPending && !result.summary && !result.error && (
                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                            <FileText className="h-12 w-12" />
                            <p className="font-headline text-lg">Your summary will appear here</p>
                            <p className="max-w-xs text-sm">
                                Fill out the form on the left to get started.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
