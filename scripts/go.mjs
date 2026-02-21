#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const setupOnly = args.has("--setup-only");
const doctorOnly = args.has("--doctor-only");

const nodeMajor = Number(process.versions.node.split(".")[0]);
const isSupportedNode = nodeMajor >= 18;
const envExamplePath = join(root, ".env.example");
const envLocalPath = join(root, ".env.local");
const nodeModulesPath = join(root, "node_modules");

function run(cmd, cmdArgs) {
  const result = spawnSync(cmd, cmdArgs, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function printDoctor() {
  console.log("Project doctor");
  console.log(`- Node: ${process.versions.node}`);
  console.log(`- Node supported (>=18): ${isSupportedNode ? "yes" : "no"}`);
  if (nodeMajor > 20) {
    console.log("- Note: macOS Big Sur users should stay on Node 18 LTS for best compatibility.");
  }
  console.log(`- node_modules: ${existsSync(nodeModulesPath) ? "present" : "missing"}`);
  console.log(`- .env.local: ${existsSync(envLocalPath) ? "present" : "missing"}`);
}

if (!isSupportedNode) {
  console.error(`Unsupported Node version: ${process.versions.node}`);
  console.error("Use Node 18+ (Node 18 LTS recommended for macOS Big Sur 11.7).");
  process.exit(1);
}

if (!existsSync(nodeModulesPath)) {
  console.log("Installing dependencies with npm ci...");
  run("npm", ["ci"]);
}

if (!existsSync(envLocalPath)) {
  const seed = existsSync(envExamplePath)
    ? null
    : "GEMINI_API_KEY=\n# Optional: set your Gemini API key above.\n";
  if (seed !== null) {
    writeFileSync(envExamplePath, seed, "utf8");
  }
  const localSeed = existsSync(envExamplePath)
    ? readFileSync(envExamplePath, "utf8")
    : "GEMINI_API_KEY=\n";
  writeFileSync(envLocalPath, localSeed, "utf8");
  console.log("Created .env.local from .env.example.");
}

if (doctorOnly) {
  printDoctor();
  process.exit(0);
}

if (setupOnly) {
  printDoctor();
  console.log("Setup complete.");
  process.exit(0);
}

console.log("Starting development server...");
run("npm", ["run", "dev"]);
