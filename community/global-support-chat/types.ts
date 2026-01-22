export type Message = {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    originalText?: string; // Foreign text for received messages, English for sent
    timestamp: Date;
    language: string; 
};

export type ChatSession = {
    id: string;
    userName: string;
    userLocale: string;
    messages: Message[];
    status: 'active' | 'closed';
    avatar?: string;
    lastMessagePreview?: string;
    unreadCount: number;
};
