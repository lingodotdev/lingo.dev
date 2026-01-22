import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/polyglot_chat',
});

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
};

export interface User {
    id: string;
    email: string | null;
    display_name: string;
    preferred_locale: string;
    avatar_url: string | null;
}

export interface Message {
    id: string;
    content: string;
    lang_original: string;
    user_name: string;
    avatar: string;
    created_at: string;
    user_id: string;
}

export interface Comment {
    id: string;
    content: string;
    message_id: string;
    user_name: string;
    avatar: string;
    created_at: string;
}
