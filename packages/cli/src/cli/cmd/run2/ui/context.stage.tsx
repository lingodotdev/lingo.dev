import { createContext, useCallback, useContext, useState } from "react";

type Stage = "config" | "auth";

type StageContext = {
  setStageState: (stage: Stage, state: boolean) => void;
  stages: Record<Stage, boolean>;
  props: {
    allStagesReady: boolean;
  };
};
const StageContext = createContext<StageContext>({
  stages: {
    config: false,
    auth: false,
  },
  props: {
    allStagesReady: false,
  },
  setStageState: () => {},
});

export function StageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<Stage, boolean>>({
    config: false,
    auth: false,
  });
  const setStageState = useCallback(
    (stage: Stage, state: boolean) => {
      setData((prev) => ({ ...prev, [stage]: state }));
    },
    [setData],
  );

  return (
    <StageContext.Provider
      value={{
        stages: data,
        props: {
          allStagesReady: Object.values(data).every((stage) => stage),
        },
        setStageState,
      }}
      children={children}
    />
  );
}

export function useStage() {
  return useContext(StageContext);
}
