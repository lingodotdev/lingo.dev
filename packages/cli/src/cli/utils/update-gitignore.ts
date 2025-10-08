import fs from "fs";
import path from "path";

export default function updateGitignore() {
  const cacheFile = "i18n.cache";
  const projectRoot = findCurrentProjectRoot();
  if (!projectRoot) {
    return;
  }
  const gitignorePath = path.join(projectRoot, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    return;
  }

  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  const gitignoreEntries = gitignoreContent
    .split(/\r?\n/)
    .map((entry) => entry.replace(/\r$/, ""));
  const cacheIsIgnored = gitignoreEntries.includes(cacheFile);

  if (!cacheIsIgnored) {
    let content = gitignoreContent;
    const newline = gitignoreContent.includes("\r\n") ? "\r\n" : "\n";

    // Ensure there's a trailing newline
    if (content !== "" && !content.endsWith("\n")) {
      content += newline;
    }

    content += `${cacheFile}${newline}`;
    fs.writeFileSync(gitignorePath, content);
  }
}

function findCurrentProjectRoot() {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    const gitDirPath = path.join(currentDir, ".git");
    if (fs.existsSync(gitDirPath) && fs.lstatSync(gitDirPath).isDirectory()) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}
