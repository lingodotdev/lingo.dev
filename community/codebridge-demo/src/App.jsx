import { useState } from "react";
import { LanguageProvider, useTranslation } from "./contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Header from "./components/Header";
import RepositoryInput from "./components/RepositoryInput";
import FileExplorer from "./components/FileExplorer";
import CodeViewer from "./components/CodeViewer";
import {
  parseGitHubUrl,
  fetchRepository,
  fetchFileTree,
  fetchFileContent,
} from "./services/github";

function AppContent() {
  const { t } = useTranslation();
  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRepositorySubmit = async (url) => {
    setIsLoading(true);
    setError("");
    setRepository(null);
    setFiles([]);
    setSelectedFile(null);
    setFileContent("");

    try {
      const { owner, repo } = parseGitHubUrl(url);
      const repoData = await fetchRepository(owner, repo);
      setRepository({ ...repoData, owner, repo });
      const fileTree = await fetchFileTree(owner, repo, repoData.defaultBranch);
      setFiles(fileTree);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!repository) return;

    setSelectedFile(file);
    setFileContent("");

    try {
      const { content } = await fetchFileContent(
        repository.owner,
        repository.repo,
        file.path,
      );
      setFileContent(content);
    } catch (err) {
      setError(`${t("app.errors.loadFile")}: ${err.message}`);
      setFileContent("# Error loading file\n\n" + err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {!repository ? (
        <main className="flex-1">
          <RepositoryInput
            onSubmit={handleRepositorySubmit}
            isLoading={isLoading}
          />
          {error && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-md animate-fade-in">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur">
                <h3 className="font-semibold mb-1">
                  ⚠️ {t("app.errors.general")}
                </h3>
                <p className="text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}
        </main>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 border-r border-border bg-card/50 flex flex-col overflow-hidden">
            {/* Repository Info */}
            <div className="p-4 space-y-3 border-b border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate text-foreground">
                    {repository.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {repository.description ||
                      t("app.repository.noDescription")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  {repository.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-500">🔀</span>
                  {repository.forks.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-500">📝</span>
                  {repository.language}
                </span>
              </div>

              {/* Back Button */}
              <button
                onClick={() => {
                  setRepository(null);
                  setFiles([]);
                  setSelectedFile(null);
                  setFileContent("");
                }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("app.repository.backButton")}
              </button>
            </div>

            {/* File Explorer */}
            <div className="flex-1 overflow-auto">
              <FileExplorer
                files={files}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden bg-background">
            <CodeViewer file={selectedFile} content={fileContent} />
          </main>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
