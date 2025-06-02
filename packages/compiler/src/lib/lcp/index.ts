import * as fs from "fs";
import _ from "lodash";
import { LCPFile, LCPSchema, LCPScope } from "./schema";
import * as path from "path";
import { LCP_DICTIONARY_FILE_NAME } from "../../_const";

const LCP_FILE_NAME = "meta.json";

export class LCP {
  private constructor(
    private readonly filePath: string,
    public readonly data: LCPSchema = {
      version: 0.1,
    },
  ) {}

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
  }): Promise<void> {
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
    return JSON.stringify(this.toJSON(), null, 2);
  }
  save() {
    const hasChanges =
      !fs.existsSync(this.filePath) ||
      fs.readFileSync(this.filePath, "utf8") !== this.toString();

    if (hasChanges) {
      const dir = this.filePath.substring(0, this.filePath.lastIndexOf("/"));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, this.toString());

      this._triggerLCPReload();
    }
  }

  private _triggerLCPReload() {
    const dir = this.filePath.substring(0, this.filePath.lastIndexOf("/"));
    const filePath = path.resolve(dir, LCP_DICTIONARY_FILE_NAME);
    if (fs.existsSync(filePath)) {
      const now = Date.now();
      fs.utimesSync(filePath, now, now);
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
