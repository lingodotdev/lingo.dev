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

  const gitignore = fs.readFileSync(gitignorePath, "utf8").split("\n");
  const cacheIsIgnored = gitignore.includes(cacheFile);

  if (!cacheIsIgnored) {
    let content = "";

    // Ensure there's a trailing newline
    content = fs.readFileSync(gitignorePath, "utf8");
    if (content !== "" && !content.endsWith("\n")) {
      content += "\n";
    }

    content += `${cacheFile}\n`;
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
