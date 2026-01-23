import Editor, { OnMount, Monaco } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import type { editor } from "monaco-editor";
import { DecorationRange } from "../utils/diff-utils";

interface EditorPanelProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language: string;
  readOnly?: boolean;
  decorations?: DecorationRange[];
  onTranslate?: () => void;
}

export function EditorPanel({
  value,
  onChange,
  language,
  readOnly = false,
  decorations = [],
  onTranslate,
}: EditorPanelProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const monacoRef = useRef<Monaco | null>(null);
  const onTranslateRef = useRef(onTranslate);

  useEffect(() => {
    onTranslateRef.current = onTranslate;
  }, [onTranslate]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Minimap and other options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 3,
      fontSize: 14,
      fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
      fontLigatures: true,
      lineHeight: 28,
      renderLineHighlight: "line",
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      scrollbar: {
        vertical: "hidden",
        horizontal: "hidden",
        useShadows: false,
      },
      readOnly,
      padding: { top: 48, bottom: 32 }, // Keep generous padding
    });

    // Add keyboard shortcut for translation
    if (onTranslate) {
      editor.addAction({
        id: "translate-shortcut",
        label: "Translate",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => {
          onTranslateRef.current?.();
        },
      });
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      // Apply decorations
      // We map our custom DecorationRange to monaco IModelDeltaDecoration
      console.log("Applying decorations:", decorations);
      const monacoDecorations = decorations.map((d) => ({
        range: new monacoRef.current.Range(
          d.startLineNumber,
          d.startColumn,
          d.endLineNumber,
          d.endColumn,
        ),
        options: {
          isWholeLine: false,
          className: d.className,
          inlineClassName: d.className, // Use inline class for text color
        },
      }));

      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        monacoDecorations,
      );
    }
  }, [decorations]);

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <style>{`
        .diff-added { background-color: rgba(16, 185, 129, 0.2) !important; color: #a7f3d0 !important; }
        .diff-removed { background-color: rgba(220, 38, 38, 0.2) !important; color: #fca5a5 !important; }
      `}</style>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          wordWrap: "on",
          lineHeight: 28,
          fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
          fontSize: 14,
          padding: { top: 48, bottom: 32 },
          minimap: { enabled: false },
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          renderLineHighlight: "line",
        }}
      />
    </div>
  );
}
