"use client";

import { useState } from "react";
import Section from "../common/section";
import { useCustomer } from "autumn-js/react";

export default function Autumn() {
  const { customer, isLoading, allowed, track, refetch, attach } =
    useCustomer();
  const [message, setMessage] = useState("");
  const [isAllowed, setIsAllowed] = useState(true);

  const { balance, included_usage } = customer?.features.messages ?? {};

  const sendMessage = async () => {
    setMessage("");

    if (allowed({ featureId: "messages" })) {
      await track({ featureId: "messages" });
      refetch();
    } else {
      setIsAllowed(false);
    }
  };

  return (
    <Section title={<span data-lingo-skip>Autumn</span>}>
      <div className="pt-0 flex gap-2">
        <input
          type="text"
          placeholder="Hi chatbot!"
          className="border border-gray-300 rounded-md p-2 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`${
            isLoading ? "cursor-progress opacity-50" : ""
          } bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 transition-colors`}
          onClick={async () => {
            await sendMessage();
          }}
        >
          Send Message
        </button>
        <div className="flex whitespace-nowrap items-center justify-end w-[200px] text-sm">
          {balance ? (
            <span>
              Usage: {balance} / {included_usage}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">No messages left.</span>
          )}
        </div>
      </div>
      {!isAllowed && (
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="text-red-500">Out of messages, please upgrade!</div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "cursor-progress opacity-50" : ""
            } bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 transition-colors`}
            onClick={async () => {
              await attach({
                productId: "pro_monthly",
                openInNewTab: true,
              });
            }}
          >
            Upgrade
          </button>
        </div>
      )}
    </Section>
  );
}
