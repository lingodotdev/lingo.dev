"use client";

import { useState } from "react";
import { Copy, RefreshCw, Send } from "lucide-react";

export default function SubspaceTransmitter() {
  const [input, setInput] = useState("");
  const [channels, setChannels] = useState<{ locale: string; name: string; message: string }[]>([
    { locale: "es", name: "Sector 7 (Spanish)", message: "Esperando transmisión..." },
    { locale: "fr", name: "Nebula 9 (French)", message: "En attente de transmission..." },
    { locale: "ja", name: "Star Base (Japanese)", message: "送信待ち..." },
    { locale: "de", name: "Iron Moon (German)", message: "Warte auf Übertragung..." },
  ]);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const broadcast = async () => {
    if (!input.trim()) return;
    setIsTransmitting(true);

    try {
        // In a real app, this would call an API route that uses the SDK
        // For this demo, we simulate the effect or call a client-side wrapper if safe
        // BUT to showcase the SDK correctly, we need a Server Action or API Route.
        // Let's assume we fetch from our own API route /api/translate
        
        const response = await fetch("/api/transmit", {
            method: "POST",
            body: JSON.stringify({ text: input, targets: ["es", "fr", "ja", "de"] }),
        });
        
        const data = await response.json();
        
        if (data.results) {
             setChannels(prev => prev.map(ch => ({
                 ...ch,
                 message: data.results[ch.locale] || ch.message
             })));
        }
    } catch (error) {
        console.error("Transmitter malfunction:", error);
    } finally {
        setIsTransmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-full max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
        <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
           <Send size={20} />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">Subspace Transmitter</h2>
             <p className="text-xs text-blue-300 uppercase tracking-wider">Real-time SDK Translation Module</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message to broadcast to all sectors..."
              className="w-full bg-black/30 border border-glass-border rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
            />
            <button 
                onClick={broadcast}
                disabled={isTransmitting}
                className="absolute bottom-4 right-4 bg-primary hover:bg-sky-400 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
                {isTransmitting ? <RefreshCw className="animate-spin" size={16}/> : <Send size={16}/>}
                TRANSMIT
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {channels.map((channel) => (
                <div key={channel.locale} className="bg-black/40 border border-glass-border p-4 rounded-xl relative group">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-gray-400 uppercase">{channel.name}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-gray-200 font-mono text-sm">{channel.message}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
