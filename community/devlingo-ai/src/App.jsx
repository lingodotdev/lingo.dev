import { useState } from "react";
import CodeTranslator from "./components/CodeTranslator";
import ErrorTranslator from "./components/ErrorTranslator";
import READMETranslator from "./components/READMETranslator";

export default function App() {
  const [activeTool, setActiveTool] = useState(null);

  const goBack = () => setActiveTool(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {!activeTool ? (
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold">DevLingo AI</h1>
          <p className="text-gray-600">
            Demo: Convert developer comments & errors into localization-ready
            JSON.
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => setActiveTool("code")}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              Code Comment Translator
            </button>
            <button
              onClick={() => setActiveTool("error")}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              Error Translator
            </button>
            <button
              onClick={() => setActiveTool("readme")}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              README Translator
            </button>
          </div>
        </div>
      ) : activeTool === "code" ? (
        <CodeTranslator goBack={goBack} />
      ) : activeTool === "error" ? (
        <ErrorTranslator goBack={goBack} />
      ) : (
        <READMETranslator goBack={goBack} />
      )}
    </div>
  );
}
