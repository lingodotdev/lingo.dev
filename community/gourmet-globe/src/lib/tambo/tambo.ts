/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import FirecrawlForm from "@/components/firecrawl/form";
import Resend from "@/components/resend";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "test-tool",
    description: "A tool to test the tooling",
    tool: async (name: string) => {
      //artificial delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `Hello ${name}`;
    },
    toolSchema: z.function().args(z.string()).returns(z.string()),
  },
];

/**
 * components
 *
 * This array contains all the components that are registered for use by Tambo within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "firecrawl",
    description:
      "A form to enter a url and scrape a website using firecrawl and return the results",
    component: FirecrawlForm,
    propsSchema: z.object({
      defaultUrl: z.string(),
    }),
  },
  {
    name: "resend",
    description: "A form to send an email using Resend",
    component: Resend,
    propsSchema: z.object({
      defaultName: z.string().optional(),
      defaultEmail: z.string().optional(),
    }),
  },
  // Add more components here
];
