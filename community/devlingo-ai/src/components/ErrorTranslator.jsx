import { useState } from "react";

export default function ErrorTranslator({ goBack }) {
  const [input, setInput] = useState("");
  const [langs] = useState(["en", "hi", "fr"]);
  const [output, setOutput] = useState("");

  const generateKey = (text) =>
    "dev.error." +
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .slice(0, 4)
      .join("_");

  const handleGenerate = () => {
    const errors = input
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (!errors.length) return alert("No errors found!");

    const result = {};

    errors.forEach((error) => {
      const key = generateKey(error);
      result[key] = {};
      langs.forEach((l) => {
        result[key][l] = l === "en" ? error : `${error} (${l} demo)`;
      });
    });

    setOutput(JSON.stringify(result, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert("JSON copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devlingo_error.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={goBack} className="text-sm mb-4 text-gray-500 hover:underline">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Error Translator</h1>
      <p className="text-gray-600 mb-4">Convert developer errors into localization JSON.</p>

      <textarea
        className="w-full h-40 border rounded p-3 mb-4"
        placeholder="TypeError: Cannot read properties of undefined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        {langs.map((l) => (
          <span key={l} className="px-3 py-1 bg-gray-200 rounded text-sm">
            {l}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGenerate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Generate JSON
        </button>
        <button
          onClick={handleCopy}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Copy JSON
        </button>
        <button
          onClick={handleDownload}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Download JSON
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  );
}
