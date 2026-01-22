"use client";
import AuthForm from "@/components/better-auth/auth-form";
import Section from "@/components/common/section";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onResponse: () => {
          setIsLoading(false);
        },
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          router.replace("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <Section title="Login">
      <p>
        If you don&apos;t have an account,{" "}
        <Link href="/auth/signup" className="text-blue-500 underline">
          sign up
        </Link>
        . Otherwise, login here 👇
      </p>
      <AuthForm onSubmit={handleLogin} isLoading={isLoading} />
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </Section>
  );
}
