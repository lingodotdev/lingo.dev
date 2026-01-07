"use client";

import { FC, PropsWithChildren } from "react";

export const ClientChildWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex gap-2">{children}</div>;
};
