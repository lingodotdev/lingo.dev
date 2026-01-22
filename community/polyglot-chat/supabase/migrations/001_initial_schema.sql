-- ============================================
-- Supabase Database Schema
-- ============================================
-- Run this migration to set up the required tables.
-- 
-- Execute via Supabase Dashboard SQL Editor or:
-- supabase db push
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  display_name TEXT NOT NULL,
  preferred_locale TEXT NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all users
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- ============================================
-- Chat Rooms Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Policy: Rooms are viewable by everyone
CREATE POLICY "Rooms are viewable by everyone" ON public.chat_rooms
  FOR SELECT USING (true);

-- Policy: Anyone can create rooms
CREATE POLICY "Anyone can create rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  lang_original TEXT NOT NULL DEFAULT 'en',
  translations JSONB DEFAULT '{}',
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Messages are viewable by everyone (for demo)
CREATE POLICY "Messages are viewable by everyone" ON public.messages
  FOR SELECT USING (true);

-- Policy: Anyone can insert messages
CREATE POLICY "Anyone can insert messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update messages (for translations)
CREATE POLICY "Anyone can update messages" ON public.messages
  FOR UPDATE USING (true);

-- Index for faster room queries
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ============================================
-- Moderation Queue Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  confidence DECIMAL(3,2) DEFAULT 0.5,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Queue is viewable by everyone (for demo, restrict in production)
CREATE POLICY "Queue is viewable by everyone" ON public.moderation_queue
  FOR SELECT USING (true);

-- Policy: Anyone can insert to queue
CREATE POLICY "Anyone can insert to queue" ON public.moderation_queue
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update queue items (for demo)
CREATE POLICY "Anyone can update queue" ON public.moderation_queue
  FOR UPDATE USING (true);

-- Index for faster status queries
CREATE INDEX IF NOT EXISTS idx_moderation_status ON public.moderation_queue(status);

-- ============================================
-- Realtime Subscriptions
-- ============================================
-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- Updated At Trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed Demo Data (Optional)
-- ============================================
-- Insert a default demo room
INSERT INTO public.chat_rooms (name, description)
VALUES ('Demo Room', 'A demo chat room with messages in various languages')
ON CONFLICT DO NOTHING;
