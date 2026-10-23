const { execFileSync } = require("node:child_process");
const { mkdirSync, rmSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = require(path.join(root, "manifest.json"));
const distDir = path.join(root, "dist");
const packageName = `github-cn-hover-helper-v${manifest.version}.zip`;
const packagePath = path.join(distDir, packageName);

mkdirSync(distDir, { recursive: true });
rmSync(packagePath, { force: true });

execFileSync(
  "zip",
  ["-r", packagePath, "manifest.json", "src"],
  { cwd: root, stdio: "inherit" }
);

console.log(`Packaged ${packagePath}`);
