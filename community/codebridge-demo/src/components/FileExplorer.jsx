import { useState } from "react";
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { getFileIcon } from "../utils/codeParser";
import { useTranslation } from "../contexts/LanguageContext";

function FileExplorer({ files, onFileSelect, selectedFile }) {
  const [expandedDirs, setExpandedDirs] = useState(new Set());
  const { t } = useTranslation();

  // Build tree structure from flat file list
  const buildTree = (files) => {
    const tree = { name: "root", children: {}, files: [] };

    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = tree;

      for (let i = 0; i < parts.length - 1; i++) {
        const dir = parts[i];
        if (!current.children[dir]) {
          current.children[dir] = { name: dir, children: {}, files: [] };
        }
        current = current.children[dir];
      }

      current.files.push(file);
    });

    return tree;
  };

  const toggleDir = (path) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const renderTree = (node, path = "") => {
    const dirs = Object.entries(node.children).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    const files = node.files.sort((a, b) => a.path.localeCompare(b.path));

    return (
      <>
        {dirs.map(([name, child]) => {
          const dirPath = path ? `${path}/${name}` : name;
          const isExpanded = expandedDirs.has(dirPath);

          return (
            <div key={dirPath} className="space-y-1">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors group"
                onClick={() => toggleDir(dirPath)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-orange-500 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-orange-500 transition-colors" />
                )}
                <span className="text-sm font-medium truncate text-foreground">
                  {name}
                </span>
              </div>
              {isExpanded && (
                <div className="ml-4 space-y-1 border-l border-border/50 pl-2">
                  {renderTree(child, dirPath)}
                </div>
              )}
            </div>
          );
        })}

        {files.map((file) => (
          <div
            key={file.path}
            className={`flex items-center gap-4 px-3 py-1.5 rounded-md cursor-pointer transition-all group ${
              selectedFile?.path === file.path
                ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                : "hover:bg-accent/50"
            }`}
            onClick={() => onFileSelect(file)}
          >
            <span className="text-base flex-shrink-0 w-6 text-center">
              {getFileIcon(file.path)}
            </span>
            <span className="text-sm truncate flex-1 text-foreground min-w-0">
              {file.path.split("/").pop()}
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatSize(file.size)}
            </span>
          </div>
        ))}
      </>
    );
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const tree = buildTree(files);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
        <Folder className="h-4 w-4 text-orange-500" />
        <h3 className="text-sm font-semibold text-white">
          {t("app.explorer.title")}
        </h3>
        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {files.length}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-2">{renderTree(tree)}</div>
    </div>
  );
}

export default FileExplorer;
