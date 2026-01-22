import { tool, ToolRuntime } from "@langchain/core/tools";
import z from "zod";

export const calculatorTool = tool(
  async (
    {
      operation,
      a,
      b,
      value,
      percent,
    }: {
      operation: "add" | "subtract" | "multiply" | "divide" | "percentage";
      a?: number;
      b?: number;
      value?: number;
      percent?: number;
    },
    config: ToolRuntime
  ): Promise<number> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "calculator",
      message: "Performing calculation...",
    });

    let result: number;

    switch (operation) {
      case "add":
        result = (a ?? 0) + (b ?? 0);
        break;

      case "subtract":
        result = (a ?? 0) - (b ?? 0);
        break;

      case "multiply":
        result = (a ?? 0) * (b ?? 0);
        break;

      case "divide":
        if (b === 0) {
          writer?.({
            type: "progress",
            id: "calculator",
            message: "Error: Division by zero success=false",
          });
          throw new Error("Division by zero");
        }
        result = (a ?? 0) / (b ?? 1);
        break;

      case "percentage":
        result = ((value ?? 0) * (percent ?? 0)) / 100;
        break;

      default:
        throw new Error("Invalid operation");
    }

    writer?.({
      type: "progress",
      id: "calculator",
      message: "Calculation completed success=true",
    });

    return result;
  },
  {
    name: "calculator",
    description: "Perform accurate mathematical calculations",
    schema: z.object({
      operation: z.enum([
        "add",
        "subtract",
        "multiply",
        "divide",
        "percentage",
      ]),
      a: z.number().optional(),
      b: z.number().optional(),
      value: z.number().optional(),
      percent: z.number().optional(),
    }),
  }
);
