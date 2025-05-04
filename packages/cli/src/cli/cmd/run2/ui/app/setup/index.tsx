import { Box, Text } from "ink";
import Config from "./config";
import Auth from "./auth";

export default function Setup() {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color="#ff6600">Configuration</Text>
      <Config />
      <Auth />
    </Box>
  );
}
