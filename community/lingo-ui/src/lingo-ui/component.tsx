"use client";

import { useLingo } from "@/lingo-ui";
import { useEffect, useState } from "react";

export function Translate({ children }: { children: string }) {
  const { translate, language } = useLingo();
  const [value, setValue] = useState(children);

  useEffect(() => {
    setValue(translate(children));
  }, [children, language]); 
  
  return <>{value}</>;
}
