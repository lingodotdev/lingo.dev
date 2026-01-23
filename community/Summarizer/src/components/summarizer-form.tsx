'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  textToSummarize: z.string().min(20, 'Text must be at least 20 characters.'),
});

export function SummarizerForm({
  onFormAction,
  isPending,
}: {
  onFormAction: (data: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textToSummarize: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormAction)} className="space-y-8">
        <FormField
          control={form.control}
          name="textToSummarize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text to Summarize</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the text you want to summarize here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The AI will generate a concise summary of the provided text.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" /> Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </form>
    </Form>
  );
}
