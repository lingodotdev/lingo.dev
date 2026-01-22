"use client";

import { useState, useEffect } from "react";
import {
  useSocket,
  useSocketEvent,
  emitSocketEvent,
} from "../../../lib/socket-client";
import DocPanel from "../../../components/doc-panel";
import LanguageSelector from "../../../components/language-selector";
import { FileText, Plus, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DocEditorPage() {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [room, setRoom] = useState("doc-room");
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { socket, isConnected } = useSocket();

  // Handle document updates from other users
  useSocketEvent(
    "doc:update",
    ({ docId, content, username: updater, isTranslated }) => {
      if (selectedDoc?.id === docId && updater !== username) {
        setSelectedDoc((prev) => ({
          ...prev,
          content,
          isTranslated,
        }));
      }
    },
  );

  const handleJoin = () => {
    if (!tempUsername.trim()) return;

    setUsername(tempUsername);
    setIsJoined(true);

    emitSocketEvent("user:join", {
      username: tempUsername,
      language,
      room,
    });

    loadDocuments();
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/documents`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocument = async (docId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/documents/${docId}?lang=${language}`,
      );
      const data = await response.json();
      if (data.success) {
        setSelectedDoc(data.document);
      }
    } catch (error) {
      console.error("Failed to load document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async () => {
    const title = prompt("Enter document title:");
    if (!title) return;

    try {
      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: "",
          lang: language,
          username,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDocuments((prev) => [...prev, data.document]);
        setSelectedDoc(data.document);
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  const handleDocumentUpdate = async (content) => {
    if (!selectedDoc) return;

    try {
      // Update via API
      await fetch(`${API_URL}/api/documents/${selectedDoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, username }),
      });

      // Broadcast to other users via Socket.io
      emitSocketEvent("doc:update", {
        docId: selectedDoc.id,
        content,
        room,
      });
    } catch (error) {
      console.error("Failed to update document:", error);
    }
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-block p-4 gradient-bg rounded-2xl mb-4">
                <FileText className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Document Editor
              </h1>
              <p className="text-muted-foreground">
                Collaborative multilingual editing
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary smooth-transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Language
                </label>
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!tempUsername.trim() || !isConnected}
                className="w-full py-3 gradient-bg rounded-xl font-medium hover:opacity-90 smooth-transition disabled:opacity-50"
              >
                {isConnected ? "Start Editing" : "Connecting..."}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor screen
  return (
    <div className="h-screen flex">
      {/* Sidebar - Document list */}
      <div className="w-80 border-r border-white/10 glass-effect flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Documents</h2>
            <button
              onClick={createDocument}
              className="p-2 gradient-bg rounded-lg hover:opacity-90 smooth-transition"
              title="Create new document"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-4">
              No documents yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => loadDocument(doc.id)}
                  className={`w-full p-3 rounded-lg text-left smooth-transition ${
                    selectedDoc?.id === doc.id
                      ? "gradient-bg"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.collaborators?.length || 0} collaborator(s)
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main editor */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <DocPanel
            document={selectedDoc}
            onUpdate={handleDocumentUpdate}
            collaborators={selectedDoc.collaborators || []}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a document or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
