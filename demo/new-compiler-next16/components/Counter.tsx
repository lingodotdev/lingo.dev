"use client";

import { FC, useState } from "react";

export const Counter: FC = () => {
  const [state, setState] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => setState((old) => old + 1)}>
        Clicked {state} times
      </button>

      {/*<button onClick={() => setState((old) => old + 1)}>*/}
      {/*  Clicked {state} times*/}
      {/*</button>*/}

      <button onClick={() => setState((old) => 0)}>reset</button>
    </div>
  );
};
