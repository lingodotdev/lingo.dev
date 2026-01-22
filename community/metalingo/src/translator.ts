const { LingoDotDevEngine } = require("lingo.dev/sdk");
import * as vscode from "vscode";

export async function translateText(text: string, targetLang?: string) {
  try {
    const apiKey = await getApiKey();

    if (!apiKey) {
      vscode.window.showErrorMessage(
        "Lingo.dev API key not set. Please add it via MetaLingo settings."
      );
      return text;
    }

    const lingo = new LingoDotDevEngine({ apiKey });

    if (!targetLang) {
      return;
    }

    const result = await lingo.localizeText(text, {
      sourceLocale: null,
      targetLocale: targetLang,
    });

    return result;
  } catch (error: any) {
    vscode.window.showErrorMessage("Translation failed: " + error.message);
    return text;
  }
}

// Store API key inside VS Code secure storage
export async function setApiKey() {
  const key = await vscode.window.showInputBox({
    prompt: "Enter your Lingo.dev API Key",
    password: true,
  });

  if (key) {
    await vscode.workspace
      .getConfiguration()
      .update("metalingo.lingoApiKey", key, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage("API key saved!");
  }
}

export async function getApiKey() {
  const config = vscode.workspace.getConfiguration();
  let key = config.get<string>("metalingo.lingoApiKey");
  if (!key || key.trim() === "") {
    const oldKey = config.get<string>("metalingo.lingoApiKey");
    if (oldKey && oldKey.trim() !== "") {
      await config.update(
        "metalingo.lingoApiKey",
        oldKey,
        vscode.ConfigurationTarget.Global
      );
      key = oldKey;
    }
  }
  return key as string;
}
