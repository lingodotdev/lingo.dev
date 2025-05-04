import { Box, Text } from "ink";
import { useStage } from "../context.stage";
import Spinner from "ink-spinner";
import { useState } from "react";
import { useEffect } from "react";
import { ProgressBar } from "@inkjs/ui";

export default function Translation() {
  const s = useStage();
  const p = useFakeProgress();

  if (!s.props.allStagesReady) return null;

  return (
    <Box flexDirection="column" paddingY={1}>
      <Box flexDirection="row" alignItems="center">
        <Text color="#ff6600">[Translation]</Text>
        <Text> </Text>
        <Text color="yellow">Completed: {p}/100</Text>
        <Text color="grey"> | </Text>
        <Text color="yellow">Queued: {100 - p}</Text>
      </Box>
      <Box flexDirection="row">
        <Text color="yellow">{p}%</Text>
        <Text> </Text>
        <Text>[en → es]</Text>
        <Text> </Text>
        <Text>[10 entries]</Text>
        <Text> </Text>
        <Text>content/[locale]/file.mdx</Text>
      </Box>
    </Box>
  );
}

export function useFakeProgress(min = 0, max = 100) {
  const [progress, setProgress] = useState(min);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Instead of resetting to 0 when reaching 100, we'll stop at 100
        if (prev >= max) {
          clearInterval(interval);
          return max;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return progress;
}
