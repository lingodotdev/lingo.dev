import trackEvent from "./observability";

const alreadySentBuildEvent = { value: false };

export function sendBuildEvent(
  framework: string,
  config: any,
  isDev: boolean,
) {
  if (alreadySentBuildEvent.value) return;
  alreadySentBuildEvent.value = true;
  trackEvent("compiler.build.start", {
    framework,
    configuration: config,
    isDevMode: isDev,
  });
}
