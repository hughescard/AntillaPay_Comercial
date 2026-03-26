import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const pasarelaDir = path.join(rootDir, "pasarela");

function spawnProcess(label, command, args, cwd, env = process.env) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[${label}] exited with signal ${signal}`);
      return;
    }

    if (code && code !== 0) {
      console.log(`[${label}] exited with code ${code}`);
      shutdown(code);
    }
  });

  child.on("error", (error) => {
    console.error(`[${label}] failed to start`, error);
    shutdown(1);
  });

  return child;
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(startPort, attempts = 20) {
  for (let offset = 0; offset < attempts; offset += 1) {
    const port = startPort + offset;
    // eslint-disable-next-line no-await-in-loop
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available port found starting at ${startPort}`);
}

function removeIfExists(filePath) {
  try {
    fs.rmSync(filePath, { force: true, recursive: true });
  } catch (error) {
    console.warn(`[dev-stack] failed to remove ${filePath}`, error);
  }
}

let isShuttingDown = false;
const children = [];

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 100);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function main() {
  const pasarelaPort = await findAvailablePort(3000);
  const nextBin = path.join(pasarelaDir, "node_modules", ".bin", "next");
  removeIfExists(path.join(pasarelaDir, ".next", "lock"));
  removeIfExists(path.join(pasarelaDir, ".next", "dev", "lock"));
  removeIfExists(path.join(pasarelaDir, ".next", "dev"));
  removeIfExists(path.join(pasarelaDir, ".next", "turbopack"));
  const sharedEnv = {
    ...process.env,
    PASARELA_DEV_PORT: String(pasarelaPort),
    VITE_PASARELA_PROXY_TARGET: `http://127.0.0.1:${pasarelaPort}`,
  };

  console.log(`[dev-stack] pasarela port ${pasarelaPort}`);

  children.push(
    spawnProcess(
      "marketing",
      "npm",
      ["run", "dev:marketing"],
      rootDir,
      sharedEnv
    )
  );
  children.push(
    spawnProcess(
      "pasarela",
      nextBin,
      ["dev", "--webpack", "--port", String(pasarelaPort)],
      pasarelaDir,
      sharedEnv
    )
  );
}

main().catch((error) => {
  console.error("[dev-stack] failed to initialize", error);
  shutdown(1);
});
