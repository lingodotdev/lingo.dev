import { Ora } from "ora";
import { PlatformKit } from "../platforms/_base";

export type IIntegrationFlowOptions = {
  parallel?: boolean;
  force?: boolean;
};

export interface IIntegrationFlow {
  preRun?(): Promise<boolean>;
  run(options: IIntegrationFlowOptions): Promise<boolean>;
  postRun?(): Promise<void>;
}

export abstract class IntegrationFlow implements IIntegrationFlow {
  protected i18nBranchName?: string;

  constructor(
    protected ora: Ora,
    protected platformKit: PlatformKit,
  ) {}

  abstract run(options: IIntegrationFlowOptions): Promise<boolean>;
}

export function getGitConfig(platformKit: PlatformKit) {
  return {
    userName: platformKit.config.commitAuthorName,
    userEmail: platformKit.config.commitAuthorEmail,
  };
}

export function escapeShellArg(arg: string): string {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}
