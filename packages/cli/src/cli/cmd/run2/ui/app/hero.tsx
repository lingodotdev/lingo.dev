import { Box, Text } from "ink";

export default function Hero() {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Text>
        ⚡️ <Text color="#6ae300">Lingo.dev</Text> - open-source, AI-powered CLI
        for web & mobile localization.
      </Text>
      <Text> </Text>
      <Text color="#0090ff">⭐ GitHub Repo: lingo.dev/go/gh</Text>
      <Text color="#0090ff">💬 24/7 Support: hi@lingo.dev</Text>
    </Box>
  );
}
