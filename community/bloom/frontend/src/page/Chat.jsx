import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Send, Plus, MessageSquare, Trash2, Menu } from "lucide-react"
import { useSelector } from "react-redux"
import axios from "axios"

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default function Chat() {
  const [message, setMessage] = useState("")
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [chat, setChat] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversationId, setConversationId] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const user = useSelector((state) => state.nav.user)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const navigate = useNavigate();

  // Start initial conversation on mount
  useEffect(() => {
    if (user?.uid) {
      startNewConversation()
    }
  }, [user])

  // Hide navbar
  useEffect(() => {
    const navbar = document.querySelector('nav')
    if (navbar) {
      navbar.style.display = 'none'
    }
    return () => {
      if (navbar) {
        navbar.style.display = 'flex'
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const handleInput = (e) => {
    setMessage(e.target.value)
    textareaRef.current.style.height = "auto"
    const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
    textareaRef.current.style.height = newHeight + "px"
  }

  // Start a new conversation with backend
  const startNewConversation = async () => {
    if (!user?.uid) {
      return
    }

    try {
      const response = await axios.post(`${API_URL}/aastha/chat`, {
        uid: user.uid
      })

      const data = response.data
      
      if (data.conversationId && data.response) {
        const newConvId = data.conversationId
        const aiMessage = { role: "ai", text: data.response }
        
        setConversationId(newConvId)
        setChat([aiMessage])
        setChatHistory([
          {
            role: "user",
            parts: [{
              text: `Here is my emotional score: ${data.emotionalScore || 'N/A'}/50 and emotional level: ${data.emotionalLevel || 'N/A'}.\nPlease start the conversation as Aastha.`
            }]
          },
          {
            role: "model",
            parts: [{ text: data.response }]
          }
        ])

        const newSession = {
          id: newConvId,
          title: "New conversation",
          active: true
        }

        setSessions(prev => [
          newSession,
          ...prev.map(s => ({ ...s, active: false }))
        ])
        setActiveSession(newConvId)
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      // Fallback
      setChat([{
        role: "ai",
        text: "Hi, I'm Aastha 🌸 I'm here to listen. What's on your mind?"
      }])
    }
  }

  // Send message to backend
  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { role: "user", text: message }
    setChat(prev => [...prev, userMessage])
    
    const userMessageText = message
    setMessage("")
    textareaRef.current.style.height = "52px"
    setIsTyping(true)

    try {
      // Add user message to history
      const updatedHistory = [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: userMessageText }]
        }
      ]

      const response = await axios.post(`${API_URL}/aastha/chat`, {
        uid: user.uid
      })

      const data = response.data
      
      setIsTyping(false)
      
      if (data.response) {
        const aiMessage = { role: "ai", text: data.response }
        setChat(prev => [...prev, aiMessage])
        
        // Update history with AI response
        setChatHistory([
          ...updatedHistory,
          {
            role: "model",
            parts: [{ text: data.response }]
          }
        ])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      setChat(prev => [...prev, {
        role: "ai",
        text: "I'm having trouble connecting. Please try again."
      }])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const createNewSession = () => {
    startNewConversation()
  }

  const deleteSession = (id, e) => {
    e.stopPropagation()
    const filtered = sessions.filter(s => s.id !== id)
    setSessions(filtered)
    if (activeSession === id && filtered.length > 0) {
      setActiveSession(filtered[0].id)
    }
  }

  return (
    <div className="flex h-screen bg-[#FDFCF8]">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-emerald-50 transition-all duration-300 overflow-hidden flex flex-col border-r`}>
        <div className="p-3 border-b border-slate-700">
          <button
            onClick={createNewSession}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm transition-colors"
          >
            <Plus size={18} />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                activeSession === session.id
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'border border-emerald-600 text-emerald-700 rounded-lg transition/50'
              }`}
            >
              <MessageSquare size={16} />
              <span className="flex-1 text-sm truncate">{session.title}</span>
              {sessions.length > 1 && (
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="py-9 px-2 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-sm" onClick={() => navigate("/dashboard")}>
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm hover:cursor-pointer">
              B
            </div>
            <button className="text-xl font-bold text-slate-500 hover:cursor-pointer" type="button">Bloom 🌱</button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-emerald-800" />
          </button>
          <h1 className="text-lg font-semibold text-emerald-700">Aastha 🌸</h1>
          <span className="text-sm text-slate-500">Your safe space to talk</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="space-y-6">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  style={{
                    animation: "fadeIn 0.3s ease-out"
                  }}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="relative bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow focus-within:border-emerald-400">
              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type how you're feeling..."
                className="w-full resize-none overflow-y-auto px-4 py-3.5 pr-12 rounded-2xl focus:outline-none text-[15px] text-slate-700 placeholder:text-slate-400 bg-transparent"
                style={{ 
                  minHeight: "52px",
                  maxHeight: "200px"
                }}
              />
              
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-md hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 text-center mt-3">
              Aastha can make mistakes. Please use with care.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}