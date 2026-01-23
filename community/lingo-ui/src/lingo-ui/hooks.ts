import { useContext } from "react";
import { LingoContext, LingoContextType } from "./provider";

export function useLingo(): LingoContextType {
  const ctx = useContext(LingoContext);
  if (!ctx) {
    throw new Error("useLingo must be used inside LingoProvider");
  }
  return ctx;
}