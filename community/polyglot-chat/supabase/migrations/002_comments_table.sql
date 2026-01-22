-- ============================================
-- Comments Table Migration
-- ============================================
-- Run this migration to add comments support.
-- ============================================

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  lang_original TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy: Comments are viewable by everyone
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

-- Policy: Anyone can insert comments
CREATE POLICY "Anyone can insert comments" ON public.comments
  FOR INSERT WITH CHECK (true);

-- Index for faster message queries
CREATE INDEX IF NOT EXISTS idx_comments_message_id ON public.comments(message_id);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
