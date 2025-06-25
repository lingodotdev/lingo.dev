import * as fs from "fs";
import _ from "lodash";
import { LCPFile, LCPSchema, LCPScope } from "./schema";
import * as path from "path";
import { LCP_DICTIONARY_FILE_NAME } from "../../_const";
import dedent from "dedent";

const LCP_FILE_NAME = "meta.json";

export class LCP {
  private constructor(
    private readonly filePath: string,
    public readonly data: LCPSchema = {
      version: 0.1,
    },
  ) {}

  public static ensureFile(params: { sourceRoot: string; lingoDir: string }) {
    const filePath = path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      LCP_FILE_NAME,
    );
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, "{}");

      console.log(dedent`
          \n
          ⚠️  Lingo.dev Compiler detected missing meta.json file in lingo directory. 
          Please restart the build / watch command to regenerate all Lingo.dev Compiler files.
        `);
      try {
        fs.rmdirSync(path.resolve(process.cwd(), ".next"), {
          recursive: true,
        });
      } catch (error) {
        // Ignore errors if directory doesn't exist
      }
      process.exit(1);
    }
  }

  public static getInstance(params: {
    sourceRoot: string;
    lingoDir: string;
  }): LCP {
    const filePath = path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      LCP_FILE_NAME,
    );
    if (fs.existsSync(filePath)) {
      return new LCP(filePath, JSON.parse(fs.readFileSync(filePath, "utf8")));
    }
    return new LCP(filePath);
  }

  // wait until LCP file stops updating
  // this ensures all files were transformed before loading / translating dictionaries
  public static async ready(params: {
    sourceRoot: string;
    lingoDir: string;
    isDev: boolean;
  }): Promise<void> {
    if (params.isDev) {
      LCP.ensureFile(params);
    }

    const filePath = path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      LCP_FILE_NAME,
    );
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (Date.now() - stats.mtimeMs > 1500) {
        return;
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        LCP.ready(params).then(resolve);
      }, 750);
    });
  }

  resetScope(fileKey: string, scopeKey: string): this {
    if (
      !_.isObject(
        _.get(this.data, ["files" satisfies keyof LCPSchema, fileKey]),
      )
    ) {
      _.set(this.data, ["files" satisfies keyof LCPSchema, fileKey], {});
    }

    _.set(
      this.data,
      [
        "files" satisfies keyof LCPSchema,
        fileKey,
        "scopes" satisfies keyof LCPFile,
        scopeKey,
      ],
      {},
    );

    return this;
  }

  setScopeType(
    fileKey: string,
    scopeKey: string,
    type: "element" | "attribute",
  ): this {
    return this._setScopeField(fileKey, scopeKey, "type", type);
  }

  setScopeContext(fileKey: string, scopeKey: string, context: string): this {
    return this._setScopeField(fileKey, scopeKey, "context", context);
  }

  setScopeHash(fileKey: string, scopeKey: string, hash: string): this {
    return this._setScopeField(fileKey, scopeKey, "hash", hash);
  }

  setScopeSkip(fileKey: string, scopeKey: string, skip: boolean): this {
    return this._setScopeField(fileKey, scopeKey, "skip", skip);
  }

  setScopeOverrides(
    fileKey: string,
    scopeKey: string,
    overrides: Record<string, string>,
  ): this {
    return this._setScopeField(fileKey, scopeKey, "overrides", overrides);
  }

  setScopeContent(fileKey: string, scopeKey: string, content: string): this {
    return this._setScopeField(fileKey, scopeKey, "content", content);
  }

  toJSON() {
    const files = _(this.data?.files)
      .mapValues((file: any, fileName: string) => {
        return {
          ...file,
          scopes: _(file?.scopes).toPairs().sortBy([0]).fromPairs().value(),
        };
      })
      .toPairs()
      .sortBy([0])
      .fromPairs()
      .value();
    return { ...this.data, files };
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2) + "\n";
  }

  save() {
    const hasChanges =
      !fs.existsSync(this.filePath) ||
      fs.readFileSync(this.filePath, "utf8") !== this.toString();

    if (hasChanges) {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, this.toString());

      this._triggerLCPReload();
    }
  }

  private _triggerLCPReload() {
    const dir = path.dirname(this.filePath);
    const filePath = path.resolve(dir, LCP_DICTIONARY_FILE_NAME);
    if (fs.existsSync(filePath)) {
      try {
        const now = Math.floor(Date.now() / 1000); // Convert to seconds
        fs.utimesSync(filePath, now, now);
      } catch (error: any) {
        // Non-critical operation - timestamp update is just for triggering reload
        if (error?.code === "EINVAL") {
          console.warn(
            dedent`
              ⚠️  Lingo: Auto-reload disabled - system blocks Node.js timestamp updates.
                  💡 Fix: Adjust security settings to allow Node.js file modifications.
                  ⚡  Workaround: Manually refresh browser after translation changes.
                  💬 Need help? Join our Discord: https://lingo.dev/go/discord.
            `,
          );
        }
      }
    }
  }

  private _setScopeField<K extends keyof LCPScope>(
    fileKey: string,
    scopeKey: string,
    field: K,
    value: LCPScope[K],
  ): this {
    _.set(
      this.data,
      [
        "files" satisfies keyof LCPSchema,
        fileKey,
        "scopes" satisfies keyof LCPFile,
        scopeKey,
        field,
      ],
      value,
    );
    return this;
  }
}
