import { Box, Text } from "ink";
import { useEffect } from "react";
import { useStage } from "../../context.stage";
import Spinner from "ink-spinner";

export default function Config() {
  const s = useStage();

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      s.setStageState("config", true);
    })();
  }, []);

  const content = !s.stages.config ? (
    <Text>
      <Text color="#6ae300">
        <Spinner />
      </Text>
      <Text> </Text>
      <Text>Loading Lingo.dev configuration...</Text>
    </Text>
  ) : (
    <Text>
      <Text color="#6ae300">✓</Text>
      <Text> </Text>
      <Text>Lingo.dev configuration loaded!</Text>
    </Text>
  );

  return <Box flexDirection="column" children={content} />;
}
