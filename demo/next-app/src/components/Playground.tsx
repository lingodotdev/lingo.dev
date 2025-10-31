"use client";
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import theme from "prism-react-renderer/themes/nightOwl";

const codeExample = `
<div style={{
  fontFamily: 'sans-serif',
  textAlign: 'center',
  padding: 20,
}}>
  <h2>👋 Welcome to Lingo.dev</h2>
  <p>Edit this text and see it update live!</p>
</div>
`;

export function Playground() {
  return (
    <section
      style={{
        margin: "3rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "#0f111a",
        maxWidth: 900,
      }}
    >
      <h3 style={{ color: "#fff", textAlign: "center", marginBottom: "1rem" }}>
        Try Lingo.dev Live
      </h3>

      <LiveProvider code={codeExample.trim()} theme={theme}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#1d1e2b",
              borderRadius: 8,
              overflow: "hidden",
              padding: "1rem",
            }}
          >
            <LiveEditor
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                background: "transparent",
                color: "#fff",
              }}
            />
            <LiveError
              style={{
                color: "#ff6b6b",
                fontSize: 12,
                marginTop: "0.5rem",
              }}
            />
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "1rem",
            }}
          >
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    </section>
  );
}
