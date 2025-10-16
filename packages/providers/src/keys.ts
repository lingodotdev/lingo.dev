import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { ProviderId } from "./constants";
import { PROVIDER_METADATA } from "./metadata";
import { getRcConfig, type RcConfig } from "@lingo.dev/config";
import { ProviderKeyMissingError } from "./errors";

let dotenvLoaded = false;
function loadDotEnvOnce() {
  if (dotenvLoaded) return;
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env.development"),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
    }
  }
  dotenvLoaded = true;
}

function getByPath(obj: any, keyPath?: string): any {
  if (!obj || !keyPath) return undefined;
  return keyPath.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export interface KeySources {
  env?: Record<string, string | undefined>;
  rc?: RcConfig;
}

export function resolveProviderApiKey(
  providerId: ProviderId,
  options?: { sources?: KeySources; required?: boolean },
): string | undefined {
  const meta = PROVIDER_METADATA[providerId];
  if (!meta) return undefined;

  const sources = options?.sources ?? {};

  let envVal: string | undefined;
  if (sources.env) {
    envVal = meta.apiKeyEnvVar ? sources.env[meta.apiKeyEnvVar] : undefined;
  } else {
    loadDotEnvOnce();
    envVal = meta.apiKeyEnvVar ? process.env[meta.apiKeyEnvVar] : undefined;
  }

  const rc = sources.rc ?? getRcConfig();
  const rcVal = getByPath(rc, meta.apiKeyConfigKey);

  const key = envVal || rcVal;
  if (!key && options?.required) {
    throw new ProviderKeyMissingError(
      providerId,
      meta.apiKeyEnvVar,
      meta.apiKeyConfigKey,
    );
  }
  return key;
}
