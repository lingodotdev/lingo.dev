import { Box, Text } from "ink";
import { useEffect } from "react";
import { useStage } from "../../context.stage";
import Spinner from "ink-spinner";

export default function Auth() {
  const s = useStage();

  useEffect(() => {
    if (!s.stages.config) return;
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      s.setStageState("auth", true);
    })();
  }, [s.stages.config]);

  const content = !s.stages.auth ? (
    <Text>
      {s.stages.config ? (
        <Text color="#6ae300">
          <Spinner />
        </Text>
      ) : (
        "•"
      )}
      <Text> </Text>
      <Text>Authenticating with Lingo.dev servers...</Text>
    </Text>
  ) : (
    <Text>
      <Text color="#6ae300">✓</Text>
      <Text> </Text>
      <Text>Authenticated with Lingo.dev!</Text>
    </Text>
  );

  return <Box flexDirection="column" children={content} />;
}
