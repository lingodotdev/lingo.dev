import chalk from "chalk";
import { ListrDefaultRendererLogLevels } from "listr2";
import { colors } from "../../constants";

export const commonTaskRendererOptions = {
  color: {
    [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
      msg ? chalk.hex(colors.green)(msg) : chalk.hex(colors.green)(""),
  },
  icon: {
    [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(colors.green)("✓"),
  },
};
