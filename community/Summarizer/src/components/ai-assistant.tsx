'use client';

import { useState } from 'react';
import { Bot, LoaderCircle, Send, X } from 'lucide-react';

import { answerQueryAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  role: 'user' | 'model';
  content: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // The current Genkit flow doesn't use history, but we pass it for future compatibility
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const result = await answerQueryAction(input, history);

    setIsLoading(false);

    if (result.success && result.answer) {
      const modelMessage: Message = { id: Date.now() + 1, role: 'model', content: result.answer };
      setMessages(prev => [...prev, modelMessage]);
    } else {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'model',
        content: result.error || 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-transform duration-300", isOpen && "translate-x-[200%]")}>
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </div>

      <div className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%_+_2rem)]"
      )}>
        <Card className="flex h-[600px] flex-col shadow-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
              </div>
              <div className='space-y-1'>
                <CardTitle className="font-headline">AI Assistant</CardTitle>
                <CardDescription>Ask me about Lingo tools.</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={cn(
                  "flex items-end gap-2",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <p className={cn(
                    "max-w-xs rounded-lg px-3 py-2 text-sm",
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    {message.content}
                  </p>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  <p className="flex items-center gap-2 max-w-xs rounded-lg bg-muted px-3 py-2 text-sm">
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Thinking...
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardFooter className="p-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
