import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const pasarelaDir = path.join(rootDir, "pasarela");
const pasarelaNextBin = path.join(pasarelaDir, "node_modules", ".bin", "next");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensurePasarelaDependencies() {
  if (fs.existsSync(pasarelaNextBin)) {
    return;
  }

  run("npm", ["ci", "--prefix", "pasarela"], rootDir);
}

function copyPasarelaExport() {
  const sourceDir = path.join(pasarelaDir, "out");
  const targetDir = path.join(rootDir, "dist", "pasarela");

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Pasarela export not found at ${sourceDir}`);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
}

try {
  ensurePasarelaDependencies();
  run("npm", ["run", "build:marketing"], rootDir);
  run("npm", ["run", "build:pasarela"], rootDir);
  copyPasarelaExport();
} catch (error) {
  console.error("[build-all] failed", error);
  process.exit(1);
}
