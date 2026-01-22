'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { supabase, DBMessage, getMessages, createMessage, getComments, createComment, getDemoRoom, getOrCreateDemoUser } from '@/lib/supabase';

interface Comment {
    id: string;
    user_name: string;
    avatar: string;
    content: string;
    created_at: string;
    translation?: string;
    isTranslating?: boolean;
}

interface Message {
    id: string;
    content: string;
    lang_original: string;
    user_name: string;
    avatar: string;
    created_at: string;
    translation?: string;
    translationSource?: string;
    isTranslating?: boolean;
    votes: number;
    userVote: 0 | 1 | -1;
    comments: Comment[];
    showComments: boolean;
}

const LOCALES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const AVATARS = ['🧙‍♂️', '🚀', '⚡', '🎌', '🦊', '🐼', '🦄', '🎨', '🎯', '🌟'];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [userLocale, setUserLocale] = useState('en');
    const [provider, setProvider] = useState('...');
    const [autoTranslate, setAutoTranslate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Supabase session
    const [roomId, setRoomId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
    const feedRef = useRef<HTMLDivElement>(null);
    const newPostRef = useRef<string | null>(null);

    // Initialize: Load room, user, and messages
    useEffect(() => {
        const init = async () => {
            try {
                // Get provider info
                const providerRes = await fetch('/api/translate');
                const providerData = await providerRes.json();
                setProvider(providerData.provider);

                // Get demo room
                const room = await getDemoRoom();
                if (room) {
                    setRoomId(room.id);

                    // Get or create demo user
                    const user = await getOrCreateDemoUser();
                    if (user) setUserId(user.id);

                    // Load messages
                    const dbMessages = await getMessages(room.id);
                    const formattedMessages: Message[] = dbMessages.map(m => ({
                        id: m.id,
                        content: m.content,
                        lang_original: m.lang_original,
                        user_name: m.users?.display_name || 'Anonymous',
                        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
                        created_at: m.created_at,
                        votes: Math.floor(Math.random() * 100),
                        userVote: 0,
                        comments: [],
                        showComments: false,
                    }));
                    setMessages(formattedMessages);
                } else {
                    // Fallback if room doesn't exist (DB clean state)
                    console.warn("Demo room not found. Database might be empty.");
                }
            } catch (e) {
                console.error('Init error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!roomId) return;

        const channel = supabase
            .channel('messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
                (payload) => {
                    const newMsg = payload.new as DBMessage;
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [{
                            id: newMsg.id,
                            content: newMsg.content,
                            lang_original: newMsg.lang_original,
                            user_name: 'NewUser', // Realtime doesn't join user yet, simple fallback
                            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
                            created_at: newMsg.created_at,
                            votes: 1,
                            userVote: 0,
                            comments: [],
                            showComments: false,
                        }, ...prev];
                    });
                })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [roomId]);

    // Load comments for a specific message
    const loadComments = async (messageId: string) => {
        const dbComments = await getComments(messageId);
        const formattedComments: Comment[] = dbComments.map(c => ({
            id: c.id,
            user_name: c.users?.display_name || 'Anonymous',
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
            content: c.content,
            created_at: c.created_at,
        }));
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, comments: formattedComments } : m));
    };

    // Translate function
    const translateText = async (text: string, srcLang: string, msgId: string, commentId?: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            if (commentId) {
                return { ...m, comments: m.comments.map(c => c.id === commentId ? { ...c, isTranslating: true } : c) };
            }
            return { ...m, isTranslating: true };
        }));

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, sourceLang: srcLang, targetLang: userLocale }),
            });
            const data = await res.json();

            if (data.success) {
                setMessages(prev => prev.map(m => {
                    if (m.id !== msgId) return m;
                    if (commentId) {
                        return { ...m, comments: m.comments.map(c => c.id === commentId ? { ...c, translation: data.translation, isTranslating: false } : c) };
                    }
                    return { ...m, translation: data.translation, translationSource: data.provider, isTranslating: false };
                }));
            }
        } catch (e) {
            setMessages(prev => prev.map(m => {
                if (m.id !== msgId) return m;
                if (commentId) {
                    return { ...m, comments: m.comments.map(c => c.id === commentId ? { ...c, isTranslating: false } : c) };
                }
                return { ...m, isTranslating: false };
            }));
        }
    };

    // Auto-translate
    useEffect(() => {
        if (!autoTranslate) return;
        messages.forEach(m => {
            if (m.lang_original !== userLocale && !m.translation && !m.isTranslating) {
                translateText(m.content, m.lang_original, m.id);
            }
        });
    }, [userLocale, messages, autoTranslate]);

    const handleVote = (id: string, dir: 1 | -1) => {
        setMessages(prev => prev.map(m => {
            if (m.id !== id) return m;
            const newVote = m.userVote === dir ? 0 : dir;
            return { ...m, userVote: newVote as 0 | 1 | -1, votes: m.votes + (newVote - m.userVote) };
        }));
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !userId) return;

        if (!roomId) {
            console.error("No room ID available");
            return;
        }

        // Direct Supabase call via Lib
        const result = await createMessage(roomId, userId, inputText, userLocale);

        if (result) {
            const newMsg: Message = {
                id: result.id,
                content: result.content,
                lang_original: result.lang_original,
                user_name: 'You',
                avatar: '👤',
                created_at: result.created_at,
                votes: 1,
                userVote: 1,
                comments: [],
                showComments: false,
            };
            setMessages(prev => [newMsg, ...prev]);
            setInputText('');
            newPostRef.current = result.id;
        } else {
            alert("Failed to create post. Database might not be migrated.");
        }
    };

    useEffect(() => {
        if (newPostRef.current) {
            const el = document.getElementById(`post-${newPostRef.current}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newPostRef.current = null;
        }
    }, [messages]);

    const toggleComments = async (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (msg && !msg.showComments && msg.comments.length === 0) {
            await loadComments(id);
        }
        setMessages(prev => prev.map(m => m.id === id ? { ...m, showComments: !m.showComments } : m));
    };

    const submitComment = async (msgId: string) => {
        const text = newCommentText[msgId];
        if (!text?.trim() || !userId) return;

        const result = await createComment(msgId, userId, text, userLocale);
        if (result) {
            const newComment: Comment = {
                id: result.id,
                user_name: 'You',
                avatar: '👤',
                content: result.content,
                created_at: result.created_at,
            };
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, comments: [...m.comments, newComment] } : m));
            setNewCommentText(prev => ({ ...prev, [msgId]: '' }));
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--c-bg)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
                    <p style={{ color: 'var(--c-text-dim)' }}>Loading Community...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-bg)' }}>
            <nav className="nav">
                <Link href="/" className="nav-brand"><span>r/</span>PolyglotChat</Link>
                <div className="nav-search">Search Feed...</div>
                <div className="nav-actions">
                    <label className="toggle-switch">
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-text-dim)', marginRight: '8px' }}>
                            {autoTranslate ? 'Auto-Translate: ON' : 'Auto-Translate: OFF'}
                        </span>
                        <input type="checkbox" checked={autoTranslate} onChange={e => setAutoTranslate(e.target.checked)} />
                        <span className="slider"></span>
                    </label>
                    <select className="locale-select" value={userLocale} onChange={(e) => {
                        setUserLocale(e.target.value);
                        setMessages(messages.map(m => ({ ...m, translation: undefined })));
                    }}>
                        {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                    </select>
                    <div className="badge badge-primary">{provider.toUpperCase()}</div>
                </div>
            </nav>

            <main className="app-container">
                <div className="feed" ref={feedRef}>
                    <div className="create-post-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
                        <div className="create-post-avatar">👤</div>
                        <form onSubmit={handleCreatePost} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                            <input type="text" className="create-post-input" placeholder="Create Post..." value={inputText} onChange={e => setInputText(e.target.value)} />
                            <button type="submit" className="btn-reddit btn-reddit-primary" disabled={!inputText.trim()}>Post</button>
                        </form>
                    </div>

                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--c-text-dim)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                            <p>No posts visible. (Check DB connection or seed data)</p>
                        </div>
                    )}

                    {messages.map(m => (
                        <div key={m.id} id={`post-${m.id}`} className="post-card">
                            <div className="vote-column">
                                <button className={`vote-btn ${m.userVote === 1 ? 'up-active' : ''}`} onClick={() => handleVote(m.id, 1)}>▲</button>
                                <div className="vote-count" style={{ color: m.userVote === 1 ? 'var(--c-primary)' : m.userVote === -1 ? '#7193ff' : undefined }}>{m.votes}</div>
                                <button className={`vote-btn ${m.userVote === -1 ? 'down-active' : ''}`} onClick={() => handleVote(m.id, -1)}>▼</button>
                            </div>

                            <div className="post-main">
                                <div className="post-header">
                                    <span style={{ fontSize: '18px' }}>{m.avatar}</span>
                                    <strong className="post-author">u/{m.user_name}</strong>
                                    <span>• {new Date(m.created_at).toLocaleTimeString()}</span>
                                    <span className="badge">{m.lang_original.toUpperCase()}</span>
                                    {m.lang_original !== userLocale && (
                                        <button className="action-icon-btn" title="Translate" onClick={() => translateText(m.content, m.lang_original, m.id)} disabled={m.isTranslating} style={{ marginLeft: 'auto' }}>
                                            {m.isTranslating ? '⏳' : '🌐'}
                                        </button>
                                    )}
                                </div>

                                <div className="post-title">{m.content}</div>

                                {m.translation && m.lang_original !== userLocale && (
                                    <div className="translation-box">
                                        <div className="translation-label">AI TRANSLATED ({m.translationSource?.toUpperCase()})</div>
                                        <div>{m.translation}</div>
                                    </div>
                                )}

                                <div className="post-footer">
                                    <button className="footer-btn" onClick={() => toggleComments(m.id)}>💬 {m.comments.length} Comments</button>
                                    <button className="footer-btn">📤 Share</button>
                                </div>

                                {m.showComments && (
                                    <div className="comments-section">
                                        <div className="comment-input-box">
                                            <textarea className="comment-input" placeholder="What are your thoughts?" value={newCommentText[m.id] || ''} onChange={(e) => setNewCommentText({ ...newCommentText, [m.id]: e.target.value })} style={{ minHeight: '60px' }} />
                                            <button className="btn-reddit btn-reddit-primary" disabled={!newCommentText[m.id]?.trim()} onClick={() => submitComment(m.id)} style={{ height: 'auto', alignSelf: 'flex-end' }}>Comment</button>
                                        </div>
                                        <div className="comment-list">
                                            {m.comments.map(c => (
                                                <div key={c.id} className="comment">
                                                    <div className="comment-avatar">{c.avatar}</div>
                                                    <div className="comment-body">
                                                        <div className="comment-meta">
                                                            <span className="comment-author">{c.user_name}</span>
                                                            <span>• {new Date(c.created_at).toLocaleTimeString()}</span>
                                                            <button className="action-icon-btn" title="Translate" onClick={() => translateText(c.content, 'auto', m.id, c.id)} disabled={c.isTranslating} style={{ marginLeft: '8px', fontSize: '12px' }}>
                                                                {c.isTranslating ? '⏳' : '🌐'}
                                                            </button>
                                                        </div>
                                                        <div className="comment-text">{c.content}</div>
                                                        {c.translation && (
                                                            <div className="translation-box" style={{ marginTop: '4px', fontSize: '13px' }}>
                                                                <div className="translation-label">AI TRANSLATED</div>
                                                                <div>{c.translation}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {m.comments.length === 0 && <div style={{ textAlign: 'center', color: 'var(--c-text-dim)', fontSize: '14px', padding: '10px' }}>No comments yet.</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="sidebar">
                    <div className="sidebar-box">
                        <div className="sidebar-title">About PolyglotChat</div>
                        <div className="sidebar-content">
                            <div style={{ fontSize: '16px', fontWeight: 700 }}>r/PolyglotChat</div>
                            <p className="mt-4" style={{ fontSize: '13px', color: 'var(--c-text-dim)' }}>The first truly global subreddit. Talk with anyone, regardless of their native language.</p>
                            <div className="mt-4 flex justify-between" style={{ fontSize: '14px' }}>
                                <div><strong>15.2k</strong> Members</div>
                                <div><strong>1.2k</strong> Online</div>
                            </div>
                            <button className="btn-reddit btn-reddit-primary mt-4" style={{ width: '100%' }}>Join Community</button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
