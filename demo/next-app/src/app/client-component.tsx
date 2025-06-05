"use client";
import { useState } from "react";

export function ClientComponent() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="flex flex-col gap-4 bg-gray-300 p-4 rounded-lg">
      <span className="color-white">Interactive component</span>
      <div className="flex items-center gap-4 justify-center w-100 border-2 border-gray-300 rounded-lg p-6 bg-white">
        <button
          onClick={() => setCounter(counter - 1)}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-auto whitespace-nowrap cursor-pointer"
        >
          - Decrement
        </button>
        <span className="text-4xl" title="This is current counter value">
          {counter}
        </span>
        <button
          onClick={() => setCounter(counter + 1)}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-auto whitespace-nowrap cursor-pointer"
        >
          + Increment
        </button>
      </div>
      <div className="h-8">
        {counter < -3 && (
          <span className="text-red-500">
            <strong>Error:</strong> Counter too low!
          </span>
        )}
        {counter > 5 && (
          <span className="text-red-500">
            <strong>Error:</strong> Counter too high!
          </span>
        )}
      </div>
    </div>
  );
}
