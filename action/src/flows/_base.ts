import { Ora } from "ora";
import { PlatformKit } from "../platforms/_base.js";

export interface IIntegrationFlow {
  preRun?(): Promise<boolean>;
  run(): Promise<boolean>;
  postRun?(): Promise<void>;
}

export abstract class IntegrationFlow implements IIntegrationFlow {
  protected i18nBranchName?: string;

  constructor(
    protected ora: Ora,
    protected platformKit: PlatformKit,
  ) {}
  // Added detailed logging method for CI environments
  protected log(message: string, level: "info" | "debug" | "error" = "info") {
    if (level === "debug" && !process.env.LINGO_DEBUG) {
      return;
    }
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Lingo.dev] [${level.toUpperCase()}] ${message}`);
  }

  abstract run(): Promise<boolean>;
}

export const gitConfig = {
  userName: "Lingo.dev",
  userEmail: "support@lingo.dev",
};
