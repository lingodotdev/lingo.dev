import Image from 'next/image';
import { MessageCircle, Send } from 'lucide-react';
import { comments } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function CommentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <MessageCircle />
          Collaboration & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="Your avatar" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="relative flex-grow">
            <Input placeholder="Leave a comment or ask a question..." />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label="Send comment"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
