"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { ChatInterface } from "./ChatInterface";

interface FloatingChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function FloatingChatbot({
  isOpen,
  onClose,
  onOpen,
}: FloatingChatbotProps) {
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={onOpen}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Interface Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Container */}
          <div className="relative w-full max-w-md">
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-700 border-gray-300 shadow-md"
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>

            {/* Chat Interface */}
            <div className="transform transition-all duration-300 ease-out">
              <ChatInterface />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
