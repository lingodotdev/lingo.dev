import type { Plugin as VitePlugin } from "vite";
import _ from "lodash";
import { defaultParams } from "./_base";
import { unplugin } from "./unplugin";
import { sendBuildEvent } from "./utils/build-event";

export function lingo(
  compilerParams?: Partial<typeof defaultParams>,
): VitePlugin {
  const mergedParams = _.merge(
    {},
    defaultParams,
    { rsc: false },
    compilerParams,
  );

  const plugin = unplugin.vite(mergedParams) as VitePlugin;
  const originalConfigResolved = plugin.configResolved;

  // Wrap to emit build event once Vite config is resolved so we can detect framework
  return {
    ...plugin,
    configResolved(resolvedConfig) {
      const isReactRouter = (resolvedConfig.plugins || []).some(
        (p) => p && p.name === "react-router",
      );
      const framework = isReactRouter ? "React Router" : "Vite";
      const isDev = resolvedConfig.command === "serve";
      sendBuildEvent(framework, mergedParams, isDev);

      // Call original hook if it exists
      if (originalConfigResolved) {
        if (typeof originalConfigResolved === "function") {
          return originalConfigResolved.call(this, resolvedConfig);
        } else {
          return originalConfigResolved.handler.call(this, resolvedConfig);
        }
      }
    },
  };
}

export default lingo;
