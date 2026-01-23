"use client";

import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import es from "@/messages/es.json";

const messages: any = { en, hi, es };

export default function Dashboard() {
  const lang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">
        {messages[lang].dashboard_title}
      </h2>

      <button className="mt-6 px-4 py-2 border rounded">
        {messages[lang].action_btn}
      </button>
    </div>
  );
}
