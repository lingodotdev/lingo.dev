"use client";

import { createContext, useContext } from "react";

export type LingoContextType = {
  dictionary: any;
};

export const LingoContext = createContext<LingoContextType>({
  dictionary: {},
});

export function useLingo() {
  return useContext(LingoContext);
}
