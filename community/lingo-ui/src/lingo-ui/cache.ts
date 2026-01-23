const CACHE_KEY_PREFIX = "lingo_cache_v1_";

export function getCached(lang: string, text: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `${CACHE_KEY_PREFIX}${lang}`;
    const storeString = localStorage.getItem(key);
    if (!storeString) return null;
    
    const store = JSON.parse(storeString);
    return store[text] || null;
  } catch (e) {
    console.warn("Lingo Cache Read Error", e);
    return null;
  }
}

export function setCached(lang: string, text: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    const key = `${CACHE_KEY_PREFIX}${lang}`;
    const storeString = localStorage.getItem(key);
    const store = storeString ? JSON.parse(storeString) : {};
    
    store[text] = value;
    localStorage.setItem(key, JSON.stringify(store));
  } catch (e) {
    console.warn("Lingo Cache Write Error", e);
  }
}
