import React from "react";
import { Box, Text, Spacer, Newline } from "ink";
import figlet from "figlet";
import { vice } from "gradient-string";

const asciiArt = vice(
  figlet.textSync("LINGO.DEV", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
);

export default function Banner() {
  return (
    <Box flexDirection="column">
      <Text>{asciiArt}</Text>
    </Box>
  );
}
