import { useState } from "react";

export const CounterClientChild = () => {
  const [state, setState] = useState(0);
  return (
    <div className="flex gap-2">
      <span>{state}</span>
      <button onClick={() => setState((old) => old + 1)}>
        How are you today?.
      </button>
    </div>
  );
};
