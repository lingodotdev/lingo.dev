import { Box } from "ink";
import { useStage } from "../context.stage";
import Banner from "./banner";
import Hero from "./hero";
import Setup from "./setup";
import Planning from "./planning";
import Translation from "./translation";

export default function App() {
  const s = useStage();
  return (
    <Box flexDirection="column">
      <Banner />
      <Hero />
      <Setup />
      <Planning />
      <Translation />
    </Box>
  );
}
