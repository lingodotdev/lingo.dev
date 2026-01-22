"use client";
import "@/app/tambo/tambo-styles.css";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { getAccessToken, useSession } from "@/lib/auth-client";
import { components, tools } from "@/lib/tambo/tambo";
import { TamboProvider } from "@tambo-ai/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TamboPage() {
  const { data: session } = useSession();
  const [userToken, setUserToken] = useState<string>();

  useEffect(() => {
    async function refresh() {
      if (session) {
        const token = await getAccessToken({
          providerId: "google",
        });
        setUserToken(token.data?.idToken);
      }
    }
    refresh();
  }, [session]);

  // Show loading state while checking authentication
  if (session === null) {
    return (
      <div className="flex flex-col gap-8 items-center min-h-screen py-8 px-4 max-w-3xl mx-auto">
        <div className="p-4 w-full">
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              This chat is using tambo_ai's authentication with better-auth. To
              use this chat setup better auth and then come back here.
            </p>
            <Link
              href="/auth/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full tambo-theme pt-10">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        userToken={userToken}
        components={components}
        tools={tools}
      >
        <div className="p-4 w-full tambo-theme">
          <MessageThreadFull />
        </div>
      </TamboProvider>
    </div>
  );
}
