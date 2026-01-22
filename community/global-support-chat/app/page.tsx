"use client";

import React, { useState } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { AIToggle } from '../components/AIToggle';
import { ChatSession, Message } from '../types';

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: '1',
    userName: 'Maria Garcia',
    userLocale: 'es',
    status: 'active',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Hello, I have a problem with my order.',
        originalText: 'Hola, tengo un problema con mi pedido.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        language: 'es',
      },
    ],
  },
  {
    id: '2',
    userName: 'Hans Müller',
    userLocale: 'de',
    status: 'active',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Does this product work on Mac?',
        originalText: 'Funktioniert dieses Produkt auf dem Mac?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        language: 'de',
      },
      {
        id: 'msg-3',
        sender: 'agent',
        text: 'Yes, it supports macOS 10.15 and later.',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        language: 'en',
      },
      {
        id: 'msg-4',
        sender: 'user',
        text: 'Thank you very much, all good!',
        originalText: 'Vielen Dank, alles gut!',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        language: 'de',
      }
    ],
  },
  {
    id: '3',
    userName: 'Pankaj',
    userLocale: 'en', // Changed default from hi to en
    status: 'active',
    unreadCount: 0,
    messages: [],
  },
];

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [useAI, setUseAI] = useState<boolean>(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const updateSessionMessages = (sessionId: string, newMessage: Message) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, newMessage],
            lastMessagePreview: newMessage.text,
            unreadCount: sessionId === activeSessionId ? 0 : session.unreadCount + 1,
          };
        }
        return session;
      })
    );
  };

  const updateMessageContent = (sessionId: string, messageId: string, updates: Partial<Message>) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: session.messages.map((m) =>
              m.id === messageId ? { ...m, ...updates } : m
            ),
          };
        }
        return session;
      })
    );
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSession) return;

    const currentSessionId = activeSession.id;
    const targetLocale = activeSession.userLocale;

    // 1. Add Agent Message (English) immediately
    const agentMsgId = Date.now().toString();
    const newMsg: Message = {
      id: agentMsgId,
      sender: 'agent',
      text: text, // English
      timestamp: new Date(),
      language: 'en',
    };
    updateSessionMessages(currentSessionId, newMsg);

    // 2. Translate Agent Message: English -> User Locale
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLocale: 'en',
          targetLocale,
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        updateMessageContent(currentSessionId, agentMsgId, {
          originalText: data.translatedText, // Foreign translation stored here
        });
      }
    } catch (error) {
      console.error('Translation failed', error);
    }

    // 3. Trigger simulated user reply
    simulateUserReply(currentSessionId, targetLocale);
  };

  const simulateUserReply = async (sessionId: string, locale: string) => {
    setIsTyping(true);
    // Delay to simulate thinking/typing
    await new Promise((resolve) => setTimeout(resolve, 300));

    let replyTextForeign = '';

    if (useAI) {
      // Use Ollama
      // We should ideally send context, but for demo just the last message or so
      // Getting context from current state might be tricky inside async specific closure if state updates. 
      // But 'sessions' in closure is stale. We need to fetch fresh or assume for now.
      // Ideally we'd pass history.
      const session = sessions.find((s) => s.id === sessionId);
      const history = session?.messages.map(m => ({ role: m.sender, content: m.text })).slice(-5) || [];
      
      try {
        const res = await fetch('/api/ollama', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history, locale }),
        });
        const data = await res.json();
        replyTextForeign = data.reply;
      } catch (e) {
        console.error('Ollama failed', e);
        replyTextForeign = "Error calling AI. (Check console)";
      }
    } else {
      // Hardcoded fallback
      const MOCK_RESPONSES: Record<string, string[]> = {
        es: ['Gracias por la ayuda.', '¿Puede explicar eso de nuevo?', 'Entendido.', 'Esperaré su respuesta.'],
        de: ['Danke für die Hilfe.', 'Können Sie das wiederholen?', 'Verstanden.', 'Ich werde warten.'],
        fr: ['Merci pour l\'aide.', 'Pouvez-vous répéter ?', 'Compris.', 'J\'attendrai.'],
        ja: ['ありがとうございます。', 'もう一度説明していただけますか？', '分かりました。', 'お待ちしております。'],
        zh: ['谢谢你的帮助。', '你能再说一遍吗？', '明白了。', '我会等的。'], // Chinese
        ko: ['도와주셔서 감사합니다.', '다시 설명해 주시겠습니까?', '알겠습니다.', '기다리겠습니다.'], // Korean
        pt: ['Obrigado pela ajuda.', 'Pode explicar novamente?', 'Entendido.', 'Vou aguardar.'], // Portuguese
        it: ['Grazie per l\'aiuto.', 'Puoi ripetere?', 'Ho capito.', 'Aspetterò.'], // Italian
        ru: ['Спасибо за помощь.', 'Можете повторить?', 'Понял.', 'Я подожду.'], // Russian
        en: ['Thank you.', 'Understood.', 'I am facing an issue.', 'Could you explain that again?'], // English
      };
      
      const defaults = MOCK_RESPONSES[locale] || ['Thank you.', 'Understood.',  'I am facing an issue', 'I am not able to understand this'];
      replyTextForeign = defaults[Math.floor(Math.random() * defaults.length)];
    }

    // 4. Translate Reply: User Locale -> English
    let replyTextEnglish = replyTextForeign;
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: replyTextForeign,
          sourceLocale: locale,
          targetLocale: 'en',
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        replyTextEnglish = data.translatedText;
      }
    } catch (e) {
      console.error('Back-translation failed', e);
    }

    // 5. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: replyTextEnglish, // English translation
      originalText: replyTextForeign, // Original foreign text
      timestamp: new Date(),
      language: locale,
    };
    
    // Check if session still exists/valid
    setIsTyping(false);
    updateSessionMessages(sessionId, userMsg);
  };

  const handleLanguageChange = (id: string, newLocale: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, userLocale: newLocale } : s))
    );
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <h1 className="font-semibold text-lg">
                {activeSession ? activeSession.userName : 'Global Support'}
             </h1>
             {activeSession && (
               activeSession.userName === 'Pankaj' ? (
                 <select
                   value={activeSession.userLocale}
                   onChange={(e) => handleLanguageChange(activeSession.id, e.target.value)}
                   className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-mono border-none focus:ring-0 cursor-pointer"
                 >
                   <option value="en">EN (English)</option>
                   <option value="es">ES (Spanish)</option>
                   <option value="fr">FR (French)</option>
                   <option value="de">DE (German)</option>
                   <option value="ja">JA (Japanese)</option>
                   <option value="zh">ZH (Chinese)</option>
                   <option value="ko">KO (Korean)</option>
                   <option value="pt">PT (Portuguese)</option>
                   <option value="it">IT (Italian)</option>
                   <option value="ru">RU (Russian)</option>
                 </select>
               ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-mono">
                  {activeSession.userLocale.toUpperCase()}
                </span>
               )
             )}
          </div>
          <AIToggle enabled={useAI} onToggle={setUseAI} />
        </header>
        
        <ChatWindow session={activeSession} isTyping={isTyping} />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!activeSession || isTyping}
          targetLocale={activeSession?.userLocale || 'en'}
        />
      </div>
    </div>
  );
}
