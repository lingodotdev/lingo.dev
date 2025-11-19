import { EventEmitter } from "events";

export class LazyProviderConfigLoader extends EventEmitter {
  private providers = new Map<string, Promise<any>>();

  async load(name: string, loader: () => Promise<any>) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }

    const promise = loader()
      .then((res) => {
        this.emit("loaded", name);
        return res;
      })
      .catch((err) => {
        this.emit("error", name, err);
        throw err;
      });

    this.providers.set(name, promise);
    return promise;
  }

  unload(name: string) {
    this.providers.delete(name);
  }
}
