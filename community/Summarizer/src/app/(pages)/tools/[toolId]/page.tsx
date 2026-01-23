import { notFound } from 'next/navigation';
import { Share2 } from 'lucide-react';
import { tools, type Tool } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommentsSection } from '@/components/comments-section';

function ToolSummary({ tool }: { tool: Tool }) {
  return <CardDescription>{tool.description}</CardDescription>;
}

export default function ToolPage({ params }: { params: { toolId: string } }) {
  const tool = tools.find(t => t.id === params.toolId);

  if (!tool) {
    notFound();
  }

  const Icon = tool.icon;

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-headline flex items-center gap-3 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {Icon && <Icon className="h-10 w-10 text-primary" />}
              {tool.name}
            </h1>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="font-headline text-lg">AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <ToolSummary tool={tool} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="font-headline">About this Tool</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{tool.pageContent}</p>
            </CardContent>
          </Card>
        </div>

        <CommentsSection />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
    return tools
        .filter(tool => tool.id !== 'documentation-generator')
        .map(tool => ({
            toolId: tool.id
        }));
}
