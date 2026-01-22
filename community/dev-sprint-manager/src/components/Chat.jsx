import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateText } from '../lib/lingo';

const Chat = ({ isWidget = true, locale = 'en' }) => {
    const [isOpen, setIsOpen] = useState(!isWidget);
    const [messages, setMessages] = useState([
        // Demo messages for project showcase
        {
            id: 'msg-1',
            content: 'Welcome to the dev sprint chat!',
            user_id: 'demo-user-1',
            created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'msg-2', 
            content: 'How is the API development going?',
            user_id: 'demo-user-2',
            created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
            id: 'msg-3',
            content: 'Making good progress on the endpoints!',
            user_id: 'current-user',
            created_at: new Date(Date.now() - 900000).toISOString()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);
    const [translatedMessages, setTranslatedMessages] = useState({});

    const currentUserId = 'current-user'; // Demo user ID

    useEffect(() => {
        if (isOpen || !isWidget) {
            scrollToBottom();
        }
    }, [isOpen, isWidget]);

    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: `msg-${Date.now()}`,
            content: newMessage,
            user_id: currentUserId,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        scrollToBottom();
    };

    const getEnhancedContent = (content) => {
        // Locale Translation - Powered by Lingo.dev SDK
        // Real-time AI translation via API
        if (locale !== 'en') {
            const messageKey = `${content}:${locale}`;

            // Use cached translation or show original
            const translatedText = translatedMessages[messageKey] || content;

            return (
                <span>
                    {translatedText}
                    <span className="block text-[9px] text-purple-400 mt-1.5 font-mono opacity-80 flex items-center gap-1.5">
                      
                    </span>
                </span>
            );
        }

        return content;
    };

    // Translate messages using Lingo.dev SDK when locale changes
    useEffect(() => {
        const performTranslation = async () => {
            if (locale === 'en' || messages.length === 0) return;

            const newTranslations = {};

            for (const msg of messages) {
                const messageKey = `${msg.content}:${locale}`;
                if (!translatedMessages[messageKey]) {
                    try {
                        // Call official Lingo.dev SDK
                        const translated = await translateText(msg.content, locale);
                        newTranslations[messageKey] = translated;
                    } catch (error) {
                        console.error('[Chat] Translation failed:', error);
                        newTranslations[messageKey] = msg.content;
                    }
                }
            }

            if (Object.keys(newTranslations).length > 0) {
                setTranslatedMessages(prev => ({ ...prev, ...newTranslations }));
            }
        };

        performTranslation();
    }, [locale, messages]); // Removed translatedMessages from dependencies to prevent infinite loop


    const getUserIdentity = (userId) => {
        if (!userId) return { name: 'Unknown', color: 'bg-slate-500' };

        // Simple hash function for consistency
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }

        const codenames = ['Viper', 'Ghost', 'Spectre', 'Nomad', 'Ranger', 'Prophet', 'Noble', 'Hunter', 'Falcon', 'Raven', 'Wolf', 'Bear'];
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500',
            'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-sky-500', 'bg-blue-500',
            'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
            'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
        ];

        const nameIndex = Math.abs(hash) % codenames.length;
        const colorIndex = Math.abs(hash) % colors.length;

        return {
            name: `Agent ${codenames[nameIndex]}`,
            color: colors[colorIndex],
            initial: codenames[nameIndex][0]
        };
    };

    // Shared Message List Component to avoid duplication
    const MessageList = () => {
        return (
            <div className="chat-messages-area custom-scrollbar">
                {messages.map((msg, index) => {
                    const isMe = msg.user_id === currentUserId;
                    const showHeader = index === 0 || messages[index - 1].user_id !== msg.user_id;
                    const identity = isMe ? null : getUserIdentity(msg.user_id);

                    return (
                        <div key={msg.id} className={`message-wrapper ${isMe ? 'sent' : 'received'} chat-message-enhanced`}>
                            {!isMe && showHeader && (
                                <div className="flex items-center gap-2 mb-1 ml-1 opacity-80">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${identity.color}`}>
                                        {identity.initial}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {identity.name}
                                    </span>
                                </div>
                            )}
                            <div className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                                {getEnhancedContent(msg.content)}
                                <span className="message-time">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        );
    };

    if (!isWidget) {
        return (
            <div className="chat-container-full">
                <MessageList />
                <form onSubmit={handleSend} className="chat-input-area">
                    <div className="chat-input-wrapper">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input-enhanced focus-enhanced"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="chat-send-btn btn-enhanced"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="chat-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        className="chat-widget-panel"
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <h3 className="chat-header-title">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Team Chat
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <MessageList />
                        <form onSubmit={handleSend} className="chat-input-area">
                            <div className="chat-input-wrapper">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="chat-input-enhanced focus-enhanced"
                                />
                                <button
                                    type="submit"
                                    className="chat-send-btn btn-enhanced"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="chat-toggle-btn interactive-enhanced"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default Chat;
