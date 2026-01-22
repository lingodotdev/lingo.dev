-- ==============================================================================
-- POLYGLOTCHAT FULL SCHEMA MIGRATION
-- Run this entire script in your Supabase Dashboard SQL Editor
-- Link: https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  display_name TEXT NOT NULL,
  preferred_locale TEXT NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  lang_original TEXT NOT NULL DEFAULT 'en',
  translations JSONB DEFAULT '{}',
  moderation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  lang_original TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  confidence DECIMAL(3,2) DEFAULT 0.5,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security) and Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- Allow public access for this demo (Simpler than auth rules for now)
CREATE POLICY "Public Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Public Rooms" ON public.chat_rooms FOR ALL USING (true);
CREATE POLICY "Public Messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Public Comments" ON public.comments FOR ALL USING (true);
CREATE POLICY "Public Queue" ON public.moderation_queue FOR ALL USING (true);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

-- 5. Seed Data
INSERT INTO public.chat_rooms (name, description)
VALUES ('Demo Room', 'Global PolyglotChat Room')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (email, display_name, preferred_locale)
VALUES ('demo@polyglotchat.local', 'DemoUser', 'en')
ON CONFLICT (email) DO NOTHING;
