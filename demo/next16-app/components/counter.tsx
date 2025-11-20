"use client";
import { useState } from "react";

export const Counter = () => {
  const [state, setState] = useState(0);
  return (
    <div className="flex gap-2">
      <span>{state}</span>
      <button onClick={() => setState((old) => old + 1)}>Incremen.</button>
    </div>
  );
};
