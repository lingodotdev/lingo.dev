import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DBMessage {
    id: string;
    room_id: string;
    user_id: string;
    content: string;
    lang_original: string;
    translations: Record<string, string>;
    moderation_status: string;
    created_at: string;
    updated_at: string;
    users?: {
        display_name: string;
        avatar_url: string;
    };
}

export interface DBComment {
    id: string;
    message_id: string;
    user_id: string;
    content: string;
    lang_original: string;
    created_at: string;
    users?: {
        display_name: string;
        avatar_url: string;
    };
}

export interface DBUser {
    id: string;
    email: string;
    display_name: string;
    preferred_locale: string;
    avatar_url: string;
    created_at: string;
}

// Get messages for a room
export async function getMessages(roomId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*, users(display_name, avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data as DBMessage[];
}

// Create a new message
export async function createMessage(
    roomId: string,
    userId: string,
    content: string,
    langOriginal: string
) {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            room_id: roomId,
            user_id: userId,
            content,
            lang_original: langOriginal,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating message:', error);
        return null;
    }
    return data;
}

// Get comments for a message
export async function getComments(messageId: string) {
    const { data, error } = await supabase
        .from('comments')
        .select('*, users(display_name, avatar_url)')
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    return data as DBComment[];
}

// Create a new comment
export async function createComment(
    messageId: string,
    userId: string,
    content: string,
    langOriginal: string
) {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            message_id: messageId,
            user_id: userId,
            content,
            lang_original: langOriginal,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating comment:', error);
        return null;
    }
    return data;
}

// Get or create a demo user
export async function getOrCreateDemoUser() {
    const demoEmail = 'demo@polyglotchat.local';

    const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', demoEmail)
        .single();

    if (existing) return existing;

    const { data, error } = await supabase
        .from('users')
        .insert({
            email: demoEmail,
            display_name: 'DemoUser',
            preferred_locale: 'en',
            avatar_url: null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating demo user:', error);
        return null;
    }
    return data;
}

// Get demo room
export async function getDemoRoom() {
    const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('name', 'Demo Room')
        .single();

    if (error) {
        console.error('Error fetching demo room:', error);
        return null;
    }
    return data;
}
