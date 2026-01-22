"use client";

import { useState } from "react";
import Section from "../common/section";
import ResendEmailForm from "./form";
import ResendEmailResult from "./result";

export default function Resend({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [sendResult, setSendResult] = useState<{
    name: string;
    email: string;
    success: boolean;
    error?: string;
    errorDetails?: any;
  } | null>(null);

  return (
    <Section title={<span data-lingo-skip>Resend</span>}>
      {sendResult ? (
        <ResendEmailResult
          result={sendResult}
          onDismiss={() => setSendResult(null)}
        />
      ) : (
        <ResendEmailForm
          onSend={setSendResult}
          defaultName={defaultName}
          defaultEmail={defaultEmail}
        />
      )}
    </Section>
  );
}
