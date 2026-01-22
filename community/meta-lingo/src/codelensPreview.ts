import * as vscode from "vscode";

let decoration: vscode.TextEditorDecorationType | null = null;

let applyCallback: (() => void) | null = null;
let cancelCallback: (() => void) | null = null;

export function showInlinePreview(
  editor: vscode.TextEditor,
  range: vscode.Range,
  previewText: string,
  onApply: () => void,
  onCancel: () => void
) {
  hideInlinePreview();

  decoration = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: " ⟶ " + previewText,
      color: "#4CAF50",
      margin: "10px",
      fontStyle: "italic",
    },
    isWholeLine: false,
  });

  editor.setDecorations(decoration, [range]);

  applyCallback = onApply;
  cancelCallback = onCancel;

  vscode.window
    .showInformationMessage("Preview ready", "Apply", "Cancel")
    .then((choice) => {
      if (choice === "Apply" && applyCallback) {
        applyCallback();
        hideInlinePreview();
        return;
      }
      if (choice === "Cancel" && cancelCallback) {
        cancelCallback();
        hideInlinePreview();
        return;
      }
      hideInlinePreview();
    });
}

export function hideInlinePreview() {
  if (decoration) {
    decoration.dispose();
  }
  decoration = null;

  applyCallback = null;
  cancelCallback = null;
}
