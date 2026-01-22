"use client";
import type { ScrapeResponse } from "@mendable/firecrawl-js";

export default function FirecrawlResult({
  result,
  onDismiss,
}: {
  result: ScrapeResponse;
  onDismiss: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          onClick={onDismiss}
        >
          &larr; Scrape again
        </button>
      </div>
      <div className="text-sm bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col gap-2 h-[300px] overflow-y-auto">
        {result.metadata &&
          Object.entries(result.metadata).map(([key, value]) => (
            <div key={key}>
              <span className="font-bold">{key}:</span> {`${value}`}
            </div>
          ))}
      </div>
    </div>
  );
}
