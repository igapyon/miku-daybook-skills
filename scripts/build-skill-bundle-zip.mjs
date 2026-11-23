import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const { version } = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const skill = "skills/igapyon-miku-daybook";
const output = path.join(root, "bundle");
const zipName = `igapyon-miku-daybook-skills-${version}.zip`;
const excluded = new Set([".DS_Store", "node_modules", ".git"]);

fs.mkdirSync(output, { recursive: true });
const temporary = fs.mkdtempSync(path.join(output, ".build-"));
try {
  const contents = path.join(temporary, "contents");
  fs.mkdirSync(path.join(contents, "skills"), { recursive: true });
  for (const file of ["README.md", "LICENSE"]) {
    fs.copyFileSync(path.join(root, file), path.join(contents, file));
  }
  fs.cpSync(path.join(root, skill), path.join(contents, skill), {
    recursive: true,
    filter: (source) => !excluded.has(path.basename(source)),
  });
  const zipPath = path.join(temporary, zipName);
  execFileSync("zip", ["-X", "-qr", zipPath, "README.md", "LICENSE", "skills"], {
    cwd: contents,
    stdio: "inherit",
  });
  fs.renameSync(zipPath, path.join(output, zipName));
  console.log(`Generated bundle/${zipName}`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
