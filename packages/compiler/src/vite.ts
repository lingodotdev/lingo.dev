import _ from "lodash";
import { defaultParams } from "./_base";
import { unplugin } from "./unplugin";
import { sendBuildEvent } from "./utils/build-event";

// Minimal Vite plugin interface to avoid depending on Vite types here
type VitePlugin = {
  name: string;
  enforce?: "pre" | "post";
  configResolved?: (resolvedConfig: any) => void;
  transformInclude: (id: string) => boolean;
  transform: (code: string, id: string) => any;
  loadInclude?: (id: string) => boolean;
  load?: (id: string) => any;
};

export function lingo(
  compilerParams?: Partial<typeof defaultParams>,
): VitePlugin {
  const mergedParams = _.merge({}, defaultParams, { rsc: false }, compilerParams);

  const plugin = unplugin.vite(mergedParams) as VitePlugin;

  // Wrap to emit build event once Vite config is resolved so we can detect framework
  const wrapped: VitePlugin = {
    ...plugin,
    name: plugin.name,
    enforce: plugin.enforce,
    configResolved(resolvedConfig: any) {
      const isReactRouter = (resolvedConfig.plugins || []).some(
        (p: any) => p && p.name === "react-router",
      );
      const framework = isReactRouter ? "React Router" : "Vite";
      const isDev = resolvedConfig.command === "serve";
      sendBuildEvent(framework, mergedParams, isDev);
      if (typeof (plugin as any).configResolved === "function") {
        (plugin as any).configResolved(resolvedConfig);
      }
    },
  };

  return wrapped;
}

export default lingo;
