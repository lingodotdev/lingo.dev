import fs from "fs";
import path from "path";
import crypto from "crypto";

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export class ConfigCacheManager<T = any> {
  private memoryCache = new Map<string, CacheEntry<T>>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes
  private cacheDir: string;

  constructor(cacheDir = path.resolve(".cache/spec")) {
    this.cacheDir = cacheDir;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  }

  private getHash(key: string): string {
    return crypto.createHash("md5").update(key).digest("hex");
  }

  get(key: string): T | undefined {
    const entry = this.memoryCache.get(key);
    if (entry && Date.now() - entry.timestamp < this.cacheTTL) {
      return entry.value;
    }
    const file = path.join(this.cacheDir, this.getHash(key) + ".json");
    if (fs.existsSync(file)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, "utf8"));
        this.memoryCache.set(key, { value: data, timestamp: Date.now() });
        return data;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  set(key: string, value: T) {
    const file = path.join(this.cacheDir, this.getHash(key) + ".json");
    fs.writeFileSync(file, JSON.stringify(value));
    this.memoryCache.set(key, { value, timestamp: Date.now() });
  }

  clear() {
    this.memoryCache.clear();
  }
}
