import * as vscode from "vscode";
import { setApiKey, translateText } from "./translator.js";
import { extractText } from "./codeExtractor.js";
import { showInlinePreview } from "./codelensPreview.js";

async function askForLanguage(): Promise<string | undefined> {
  const languages = [
    { label: "English", code: "en" },
    { label: "Hindi", code: "hi" },
    { label: "Spanish", code: "es" },
    { label: "French", code: "fr" },
    { label: "German", code: "de" },
    { label: "Chinese", code: "zh" },
    { label: "Japanese", code: "ja" },
    { label: "Russian", code: "ru" },
    { label: "Portuguese", code: "pt" },
    { label: "Arabic", code: "ar" },
  ];

  const selection = await vscode.window.showQuickPick(
    languages.map((l) => l.label),
    { placeHolder: "Select a target language" }
  );

  if (!selection) {
    return;
  }
  return languages.find((l) => l.label === selection)!.code;
}

async function ensureApiKey(): Promise<string | null> {
  const config = vscode.workspace.getConfiguration();
  // New key
  let apiKey = config.get<string>("metalingo.lingoApiKey");
  // Migration: fall back to old key if new not set
  if (!apiKey || apiKey.trim() === "") {
    const oldKey = config.get<string>("polycode.lingoApiKey");
    if (oldKey && oldKey.trim() !== "") {
      await config.update(
        "metalingo.lingoApiKey",
        oldKey,
        vscode.ConfigurationTarget.Global
      );
      apiKey = oldKey;
    }
  }

  if (apiKey && apiKey.trim() !== "") {
    return apiKey;
  }

  const enteredKey = await vscode.window.showInputBox({
    prompt: "Enter your Lingo.dev API Key",
    placeHolder: "sk-xxxxx",
    ignoreFocusOut: true,
    password: true,
  });

  if (!enteredKey) {
    vscode.window.showErrorMessage(
      "Lingo.dev API key is required to use MetaLingo features."
    );
    return null;
  }

  await config.update(
    "metalingo.lingoApiKey",
    enteredKey,
    vscode.ConfigurationTarget.Global
  );

  return enteredKey;
}

export async function activate(context: vscode.ExtensionContext) {
  const translateCmd = vscode.commands.registerCommand(
    "metalingo.translateSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const apiKey = await ensureApiKey();
      if (!apiKey) {
        return;
      }

      const lang = await askForLanguage();
      if (!lang) {
        return;
      }

      const selection = editor.selection;
      const originalText = editor.document.getText(selection);

      let translatedText: string | undefined;

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Translating selection…",
        },
        async () => {
          translatedText = await translateText(originalText, lang);
        }
      );

      if (!translatedText) {
        return;
      }

      const position = new vscode.Position(selection.start.line, 0);

      showInlinePreview(
        editor,
        new vscode.Range(selection.start, selection.end),
        translatedText!,
        () => {
          editor.edit((e) => e.replace(selection, translatedText!));
        },
        () => {}
      );
    }
  );

  const keyCmd = vscode.commands.registerCommand(
    "metalingo.setApiKey",
    setApiKey
  );

  const translateFileCmd = vscode.commands.registerCommand(
    "metalingo.translateFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const apiKey = await ensureApiKey();
      if (!apiKey) {
        return;
      }

      const lang = await askForLanguage();
      if (!lang) {
        return;
      }

      const originalCode = editor.document.getText();
      const { comments } = extractText(originalCode);

      const translatedItems: {
        range: vscode.Range;
        value: string;
      }[] = [];

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Translating full file…",
        },
        async () => {
          for (const c of comments) {
            const translatedPure = await translateText(c.value, lang);

            let finalTranslated = translatedPure;

            if (c.value.trim().startsWith("//")) {
              finalTranslated = translatedPure;
            } else if (c.value.trim().startsWith("/*")) {
              finalTranslated = translatedPure;
            } else if (c.value.trim().startsWith("#")) {
              finalTranslated = translatedPure;
            }

            const range = new vscode.Range(
              editor.document.positionAt(c.start),
              editor.document.positionAt(c.end)
            );

            translatedItems.push({
              range,
              value: finalTranslated!,
            });
          }
        }
      );

      showInlinePreview(
        editor,
        new vscode.Range(0, 0, 0, 0),
        `Full file translation ready (${translatedItems.length} comments). Click Apply.`,
        () => {
          translatedItems.sort((a, b) =>
            b.range.start.compareTo(a.range.start)
          );

          editor.edit((builder) => {
            for (const item of translatedItems) {
              builder.replace(item.range, item.value);
            }
          });
        },
        () => {}
      );
    }
  );

  context.subscriptions.push(translateCmd, translateFileCmd, keyCmd);
}
