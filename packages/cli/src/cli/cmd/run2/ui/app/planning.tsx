import { Box, Text } from "ink";
import { useStage } from "../context.stage";

export default function Planning() {
  const s = useStage();

  if (!s.props.allStagesReady) return null;

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color="#ff6600">Planning</Text>
      <Text>
        <Text>•</Text>
        <Text> </Text>
        <Text>Found 2 translation buckets: json, mdx</Text>
      </Text>
      <Text>
        <Text>•</Text>
        <Text> </Text>
        <Text>Found 10 documents in the json bucket</Text>
      </Text>
      <Text>
        <Text>•</Text>
        <Text> </Text>
        <Text>Found 10 documents in the mdx bucket</Text>
      </Text>
    </Box>
  );
}
