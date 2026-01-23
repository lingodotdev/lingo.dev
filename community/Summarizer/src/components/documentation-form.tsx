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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters.'),
  toolDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  toolFeatures: z.string().min(5, 'Features must be at least 5 characters.'),
  exampleUsage: z.string().min(10, 'Example usage must be at least 10 characters.'),
});

export function DocumentationForm({
  onFormAction,
  isPending,
}: {
  onFormAction: (data: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolName: '',
      toolDescription: '',
      toolFeatures: '',
      exampleUsage: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormAction)} className="space-y-8">
        <FormField
          control={form.control}
          name="toolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Super Scraper" {...field} />
              </FormControl>
              <FormDescription>The official name of your Lingo tool.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toolDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what your tool does, its purpose, and who it's for."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toolFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Features</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web scraping, data parsing, JSON export" {...field} />
              </FormControl>
              <FormDescription>A comma-separated list of the main features.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exampleUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example Usage</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a clear example of how to use the tool. Code snippets are great!"
                  className="font-code"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Show a simple, practical example to help users get started.
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
            'Generate Documentation'
          )}
        </Button>
      </form>
    </Form>
  );
}
