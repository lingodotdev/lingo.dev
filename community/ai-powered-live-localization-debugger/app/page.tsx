"use client";

import { useState } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import IssuesPanel from "./components/IssuesPanel";
import SuggestionsPanel from "./components/SuggestionsPanel";
import LoadingState from "./components/LoadingState";

export default function HomePage() {

  const [codeInput, setCodeInput] = useState("");
  const [sourceJson, setSourceJson] = useState("");
  const [targetJson, setTargetJson] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [issues, setIssues] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any>(null);

  const handleAnalyze = async () => {
    setError(null);
    setIssues(null);
    setSuggestions(null);

    if (!codeInput || !sourceJson || !targetJson) {
      setError("Please paste code, source JSON, and target JSON.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeInput,
          sourceJson,
          targetJson,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please check your input.");
      }

      const data = await response.json();

      setIssues(data.issues);
      setSuggestions(data.suggestions);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "24px" }}>
      <Header />

      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {loading && <LoadingState />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginTop: "24px",
        }}
      >

        <InputPanel
          codeInput={codeInput}
          sourceJson={sourceJson}
          targetJson={targetJson}
          onCodeChange={setCodeInput}
          onSourceJsonChange={setSourceJson}
          onTargetJsonChange={setTargetJson}
          onAnalyze={handleAnalyze}
        />

   
        <IssuesPanel issues={issues} />

        <SuggestionsPanel suggestions={suggestions} />
      </div>
    </main>
  );
}
