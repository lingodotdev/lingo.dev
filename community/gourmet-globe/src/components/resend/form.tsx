"use client";

import { useEffect, useState } from "react";

export default function ResendEmailForm({
  onSend,
  defaultName = "",
  defaultEmail = "",
}: {
  onSend: (data: {
    name: string;
    email: string;
    success: boolean;
    error?: string;
    errorDetails?: any;
  }) => void;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(`Sending email to "${name} <${email}>"`);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Email sent successfully. Response: ", data);
        onSend({ name, email, success: true });
      } else {
        console.error("Failed to send email. Response: ", data);
        const errorMessage =
          data?.error?.message ||
          data?.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        onSend({
          name,
          email,
          success: false,
          error: errorMessage,
          errorDetails: data,
        });
      }
    } catch (error) {
      console.error("Network error or failed to send email:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      onSend({
        name,
        email,
        success: false,
        error: errorMessage,
        errorDetails: { networkError: true, originalError: error },
      });
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 w-full"
    >
      <input
        type="text"
        placeholder="Name"
        required
        className="border border-gray-300 rounded-md p-2 flex-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <input
        type="email"
        placeholder="Email"
        required
        className="border border-gray-300 rounded-md p-2 flex-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`${isLoading ? "cursor-progress opacity-50" : ""} bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 transition-colors`}
      >
        {isLoading ? <span>Sending...</span> : <span>Send email</span>}
      </button>
    </form>
  );
}
