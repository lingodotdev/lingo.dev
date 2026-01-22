"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Users, Loader2 } from "lucide-react";

export default function DocPanel({
  document,
  onUpdate,
  collaborators = [],
  isLoading = false,
}) {
  const [content, setContent] = useState(document?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (document?.content) {
      setContent(document.content);
    }
  }, [document]);

  const handleContentChange = (newContent) => {
    setContent(newContent);

    // Auto-save after 1 second of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(newContent);
    }, 1000);
  };

  const handleSave = async (contentToSave = content) => {
    if (!contentToSave.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await onUpdate(contentToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved";
    const seconds = Math.floor((new Date() - lastSaved) / 1000);
    if (seconds < 60) return "Saved just now";
    const minutes = Math.floor(seconds / 60);
    return `Saved ${minutes}m ago`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">
            {document?.title || "Untitled Document"}
          </h3>
          {document?.isTranslated && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
              Translated to {document.translatedTo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {collaborators.length} collaborator
                {collaborators.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Save status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{formatLastSaved()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start typing..."
            className="w-full h-full p-6 bg-transparent resize-none focus:outline-none text-base leading-relaxed"
            style={{ fontFamily: "inherit" }}
          />
        )}
      </div>

      {/* Original content indicator */}
      {document?.isTranslated && document?.originalContent && (
        <div className="p-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Note:</span> You're viewing a
            translated version. Original language: {document.originalLang}
          </p>
        </div>
      )}
    </div>
  );
}
