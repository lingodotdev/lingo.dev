"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ userEmail }: { userEmail: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div>
        Logged in as{" "}
        <strong className="font-medium bg-yellow-100">{userEmail}</strong>
      </div>
      <button
        className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors inline-block cursor-pointer ${isLoading ? "cursor-progress opacity-50" : ""}`}
        disabled={isLoading}
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}
