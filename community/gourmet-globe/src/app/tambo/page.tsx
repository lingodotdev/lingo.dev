"use client";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo/tambo";
import { TamboProvider } from "@tambo-ai/react";
import "./tambo-styles.css";

export default function TamboPage() {
  return (
    <div className="fixed inset-0 bg-background">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
      >
        <div className="w-full h-full tambo-theme pt-10">
          <MessageThreadFull />
        </div>
      </TamboProvider>
    </div>
  );
}
