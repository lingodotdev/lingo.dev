#!/usr/bin/env node

import { generateTranslations } from "./bin/generate";
import { createDemoApp } from "./bin/init";

const cmd = process.argv[2];

if (cmd === "init") createDemoApp();
else if (cmd === "generate") generateTranslations();
else console.log("Unknown command");
