"use client";
import { useEffect, useState } from "react";
import { getDictionary } from "../../core/get-dictionary";

export default function LocaleSwitcher() {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await getDictionary("en");
        if (mounted) setDict(result);
      } catch (err) {
        if (mounted) setError(err as Error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <div>Error loading locale</div>;
  if (!dict) return <div>Loading…</div>;
  return <div>{dict.hello}</div>;
}
