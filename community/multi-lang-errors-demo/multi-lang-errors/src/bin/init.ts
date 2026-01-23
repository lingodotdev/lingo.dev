#!/usr/bin/env node

/**
 * CLI: multi-lang-errors init
 *
 * This command:
 * 1. Creates a demo React app file
 * 2. Creates config file if missing
 * 3. Prepares src/errors folder where generated translations will live
 */

import fs from "fs";
import path from "path";
import readline from "readline";

const cwd = process.cwd(); // User project root
const srcDir = path.join(cwd, "src");
const errorsDir = path.join(srcDir, "errors"); // Where generated files will go

/**
 * Small helper to ask CLI questions
 */
function ask(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

export async function createDemoApp() {
  // Ensure this is a React-like project
  if (!fs.existsSync(srcDir)) {
    console.error("❌ src/ folder not found. Are you in a React project?");
    process.exit(1);
  }

  /**
   * Decide where to place demo file
   */
  const appPath = path.join(srcDir, "App.jsx");
  const examplePath = path.join(srcDir, "App.example.jsx");
  let targetPath = appPath;

  if (fs.existsSync(appPath)) {
    const choice = await ask(
      `App.jsx exists. Override (1) / Create example (2) / Cancel (3): `,
    );

    if (choice === "2") targetPath = examplePath;
    else if (choice !== "1") process.exit(0);
  }

  // Write demo app
  fs.writeFileSync(targetPath, demoAppTemplate());
  console.log(`✅ Demo app created at ${path.relative(cwd, targetPath)}`);

  /**
   * Create config file if missing
   */
  const configPath = path.join(cwd, "multi-lang-errors.config.json");

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          apiKey: "YOUR_LINGO_API_KEY",
          languages: ["en", "es", "fr"],
          baseErrors: {
            REQUIRED_FIELD: "This field is required",
            INVALID_EMAIL: "Invalid email address",
          },
        },
        null,
        2,
      ),
    );
    console.log("📝 multi-lang-errors.config.json created");
  }

  /**
   * Prepare folder for generated translations
   * (actual files created by `generate`)
   */
  fs.mkdirSync(errorsDir, { recursive: true });
  console.log("📁 src/errors folder ready for generated translations");

  /**
   * Create placeholder bridge so app doesn't crash before generate
   */
  const placeholderIndex = path.join(errorsDir, "index.js");

  if (!fs.existsSync(placeholderIndex)) {
    fs.writeFileSync(
      placeholderIndex,
      `// Placeholder created by multi-lang-errors
// Run "npx multi-lang-errors generate" to generate translations

export {};
`,
    );
  }
}

/**
 * Demo React App Template
 *
 * Important parts:
 * 1. `import "./errors"` → this runs the auto-generated bridge that calls initError()
 * 2. `useError` comes from your package root export
 */
function demoAppTemplate() {
  return `
import React, { useState } from "react";
import "./errors";
import { useError } from "multi-lang-errors";

export default function App() {
  const [lang, setLang] = useState("en");

  const { getError, getLanguages } = useError(lang);
  const languages = getLanguages();
  const isNotGenerated = languages.length === 0;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>DEMO APPLICATION</div>
          <h1 style={styles.title}>Multi-language Errors</h1>
          <p style={styles.subtitle}>
            Automatically translate error messages and seamlessly integrate them
            into your React application.
          </p>
        </div>

        {/* Main Content Card */}
        <div style={styles.card}>
          {isNotGenerated ? (
            <div style={styles.warningBox}>
              <div style={styles.warningContent}>
                <svg
                  style={styles.warningIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.warningTitle}>
                    Translations Not Generated
                  </h3>
                  <p style={styles.warningText}>
                    To get started, you need to generate the translation files.
                    Run the command below in your terminal:
                  </p>
                  <div style={styles.codeBlock}>
                    <code>npx multi-lang-errors generate</code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Language Selection */}
              <div style={styles.sectionHeader}>
                <label style={styles.label}>Select Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={styles.select}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.selectFocus)
                  }
                  onBlur={(e) => {
                    e.target.style.border = "1px solid #cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Examples */}
              <div style={styles.content}>
                <h3 style={styles.sectionTitle}>
                  <svg
                    style={styles.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Example Error Messages
                </h3>
                <div>
                  <div style={{ ...styles.errorBox, ...styles.errorBoxRed }}>
                    <span
                      style={{ ...styles.errorCode, ...styles.errorCodeRed }}
                    >
                      REQUIRED_FIELD
                    </span>
                    <p style={styles.errorMessage}>
                      {getError("REQUIRED_FIELD")}
                    </p>
                  </div>
                  <div style={{ ...styles.errorBox, ...styles.errorBoxOrange }}>
                    <span
                      style={{ ...styles.errorCode, ...styles.errorCodeOrange }}
                    >
                      INVALID_EMAIL
                    </span>
                    <p style={styles.errorMessage}>
                      {getError("INVALID_EMAIL")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* How It Works Section */}
        <div style={styles.card}>
          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>
              <svg
                style={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              How It Works
            </h3>
            <div style={styles.grid}>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>1</div>
                <p style={styles.stepText}>
                  Edit{" "}
                  <code style={styles.inlineCode}>
                    multi-lang-errors.config.json
                  </code>
                </p>
              </div>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>2</div>
                <p style={styles.stepText}>
                  Add error keys inside{" "}
                  <code style={styles.inlineCode}>baseErrors</code>
                </p>
              </div>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>3</div>
                <p style={styles.stepText}>
                  Run the <code style={styles.inlineCode}>generate</code>{" "}
                  command
                </p>
              </div>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>4</div>
                <p style={styles.stepText}>
                  Translations are written into{" "}
                  <code style={styles.inlineCode}>src/errors/</code>
                </p>
              </div>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>5</div>
                <p style={styles.stepText}>
                  <code style={styles.inlineCode}>initError()</code> loads them
                  into memory
                </p>
              </div>
              <div style={styles.stepBox}>
                <div style={styles.stepNumber}>6</div>
                <p style={styles.stepText}>
                  <code style={styles.inlineCode}>useError()</code> reads errors
                  based on selected language
                </p>
              </div>
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                <svg
                  style={styles.infoIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Do not edit{" "}
                <code style={styles.inlineCode}>src/errors/errors.js</code>
                manually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  wrapper: {
    // maxWidth: "1200px",
    margin: "0 auto",
    padding: "48px 24px",
  },
  header: {
    marginBottom: "48px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "20px",
    marginBottom: "16px",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "700px",
    lineHeight: "1.7",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    marginBottom: "32px",
  },
  warningBox: {
    padding: "32px",
  },
  warningContent: {
    display: "flex",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "8px",
  },
  warningIcon: {
    width: "24px",
    height: "24px",
    color: "#d97706",
    flexShrink: 0,
    marginTop: "2px",
  },
  warningTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#78350f",
    marginBottom: "8px",
  },
  warningText: {
    color: "#92400e",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  codeBlock: {
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    padding: "16px",
    fontFamily: "'Monaco', 'Courier New', monospace",
    fontSize: "14px",
    color: "#4ade80",
    overflowX: "auto",
  },
  sectionHeader: {
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    padding: "24px 32px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "12px",
  },
  select: {
    width: "100%",
    maxWidth: "300px",
    padding: "10px 16px",
    fontSize: "16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s",
  },
  selectFocus: {
    border: "1px solid #3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
  content: {
    padding: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    width: "20px",
    height: "20px",
    color: "#3b82f6",
  },
  errorBox: {
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  errorBoxRed: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
  },
  errorBoxOrange: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
  },
  errorCode: {
    display: "inline-block",
    padding: "4px 10px",
    fontSize: "12px",
    fontFamily: "'Monaco', 'Courier New', monospace",
    fontWeight: "600",
    borderRadius: "4px",
  },
  errorCodeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  errorCodeOrange: {
    backgroundColor: "#ffedd5",
    color: "#9a3412",
  },
  errorMessage: {
    marginTop: "12px",
    color: "#334155",
    fontWeight: "500",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  stepBox: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  stepNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: {
    color: "#334155",
    lineHeight: "1.6",
  },
  inlineCode: {
    padding: "2px 6px",
    backgroundColor: "#e2e8f0",
    color: "#1e293b",
    borderRadius: "4px",
    fontSize: "13px",
    fontFamily: "'Monaco', 'Courier New', monospace",
  },
  footer: {
    marginTop: "24px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
  },
  footerText: {
    fontSize: "14px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  infoIcon: {
    width: "16px",
    height: "16px",
    color: "#94a3b8",
  },
};
`.trim();
}
