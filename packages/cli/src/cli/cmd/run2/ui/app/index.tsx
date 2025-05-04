import { Box, Newline, Text } from "ink";
import { useStage } from "../context.stage";
import Banner from "./banner";
import Hero from "./hero";

export default function App() {
  const s = useStage();
  return (
    <Box flexDirection="column">
      <Banner />
      <Newline />
      <Hero />
    </Box>
  );
}
