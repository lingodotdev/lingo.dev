"use client";

import { useState } from "react";

export default function ResendEmailResult({
  result,
  onDismiss,
}: {
  result: {
    name: string;
    email: string;
    success: boolean;
    error?: string;
    errorDetails?: any;
  };
  onDismiss: () => void;
}) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          onClick={onDismiss}
        >
          &larr; Send another email
        </button>
      </div>
      <div className="text-sm bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{result.success ? "✅" : "❌"}</span>
          <span className="font-semibold">
            {result.success
              ? "Email sent successfully!"
              : "Failed to send email"}
          </span>
        </div>
        <div>
          <span className="font-bold">Name:</span> {result.name}
        </div>
        <div>
          <span className="font-bold">Email:</span> {result.email}
        </div>

        {!result.success && result.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-red-700">Error:</span>
              <span className="text-red-600">{result.error}</span>
            </div>

            {result.errorDetails && (
              <div className="mt-2">
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="text-xs text-red-600 hover:text-red-800 underline cursor-pointer"
                >
                  {showErrorDetails ? "Hide" : "Show"} error details
                </button>

                {showErrorDetails && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs font-mono overflow-auto max-h-32">
                    <pre>{JSON.stringify(result.errorDetails, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
