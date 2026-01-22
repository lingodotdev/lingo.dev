"use client";
import Link from "next/link";
import { useState } from "react";

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}

export default function AuthForm({ onSubmit, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailPassword = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleEmailPassword}
      className="flex flex-col gap-4 w-full max-w-md mx-auto py-6"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className={`${isLoading ? "cursor-progress opacity-50" : ""} bg-primary text-white px-4 py-2 rounded-md cursor-pointer`}
        disabled={isLoading}
      >
        {isLoading ? <>Loading...</> : <>Continue</>}
      </button>
      <div>
        or{" "}
        <Link href="/" className="text-blue-500 underline">
          go back to homepage
        </Link>
      </div>
    </form>
  );
}
