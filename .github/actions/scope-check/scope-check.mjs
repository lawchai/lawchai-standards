import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const EXCLUDED_NAMES = new Set([
  "package-lock.json",
  "npm-shrinkwrap.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]);
const EXCLUDED_DIRECTORIES = /(^|\/)(node_modules|dist|build|coverage|out|\.next|\.wrangler)(\/|$)/;
const SOURCE_EXTENSION = /\.(cjs|mjs|js|jsx|ts|tsx|css|scss|sass|less|html|vue|svelte)$/i;

export function parseAllowedPaths(raw) {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error("allowed_paths is required and must contain at least one path.");
  }

  const entries = raw.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
  const seen = new Set();

  for (const entry of entries) {
    if (entry.startsWith("/") || /^[A-Za-z]:/.test(entry)) {
      throw new Error(`allowed_paths entry must be repository-relative: ${entry}`);
    }
    if (entry.includes("\\")) {
      throw new Error(`allowed_paths entry must use forward slashes: ${entry}`);
    }
    if (entry.split("/").includes("..")) {
      throw new Error(`allowed_paths entry must not traverse parent directories: ${entry}`);
    }
    if (entry.includes("*")) {
      throw new Error(`allowed_paths does not support wildcards; use a trailing / for a directory prefix: ${entry}`);
    }
    if (entry === "." || entry === "./" || entry.includes("//")) {
      throw new Error(`allowed_paths entry is malformed: ${entry}`);
    }
    if (seen.has(entry)) {
      throw new Error(`allowed_paths contains a duplicate entry: ${entry}`);
    }
    seen.add(entry);
  }

  return entries;
}

export function pathIsAllowed(file, allowedPaths) {
  return allowedPaths.some((allowed) =>
    allowed.endsWith("/") ? file.startsWith(allowed) : file === allowed,
  );
}

export function findUnauthorisedPaths(changedPaths, allowedPaths) {
  return changedPaths.filter((file) => !pathIsAllowed(file, allowedPaths));
}

export function meaningfulLineSummary(numstatOutput) {
  let changedLines = 0;
  const countedFiles = [];

  for (const line of numstatOutput.split("\n").filter(Boolean)) {
    const [added, deleted, rawPath] = line.split("\t");
    if (!rawPath) continue;
    const file = rawPath.replace(/\\/g, "/");
    const name = file.split("/").pop();

    if (
      EXCLUDED_NAMES.has(name) ||
      EXCLUDED_DIRECTORIES.test(file) ||
      file.endsWith(".snap") ||
      !SOURCE_EXTENSION.test(file)
    ) {
      continue;
    }

    const additions = added === "-" ? 0 : Number(added);
    const deletions = deleted === "-" ? 0 : Number(deleted);
    const fileLines = additions + deletions;
    changedLines += fileLines;
    countedFiles.push({ file, changedLines: fileLines });
  }

  return { changedLines, countedFiles, exceedsReviewThreshold: changedLines > 250 };
}

function appendSummary(markdown) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}

export function runScopeCheck({ baseSha, headSha, rawAllowedPaths, git = execFileSync }) {
  if (!baseSha) throw new Error("Pull-request base SHA is unavailable; scope enforcement cannot run safely.");
  if (!headSha) throw new Error("Pull-request head SHA is unavailable; scope enforcement cannot run safely.");

  const allowedPaths = parseAllowedPaths(rawAllowedPaths);
  const changedOutput = git(
    "git",
    ["diff", "--name-only", "--no-renames", `${baseSha}...${headSha}`, "--"],
    { encoding: "utf8" },
  );
  const changedPaths = changedOutput.split("\n").map((path) => path.trim()).filter(Boolean);
  const unauthorised = findUnauthorisedPaths(changedPaths, allowedPaths);

  if (unauthorised.length > 0) {
    throw new Error(`Changed paths outside allowed_paths:\n${unauthorised.map((path) => `- ${path}`).join("\n")}`);
  }

  const numstatOutput = git(
    "git",
    ["diff", "--numstat", "--no-renames", `${baseSha}...${headSha}`, "--"],
    { encoding: "utf8" },
  );
  const lineSummary = meaningfulLineSummary(numstatOutput);

  appendSummary(`## Scope verification\n\n- Authorised changed paths: ${changedPaths.length}\n- Meaningful source/test diff: ${lineSummary.changedLines} changed lines\n`);

  if (lineSummary.exceedsReviewThreshold) {
    const detail = lineSummary.countedFiles.map(({ file, changedLines }) => `- ${file}: ${changedLines}`).join("\n");
    console.log(`::warning title=Large bounded diff::Meaningful source/test diff is ${lineSummary.changedLines} lines. Review decomposition and assertions; size alone does not fail CI.`);
    appendSummary(`\n> [!WARNING]\n> Large bounded diff: ${lineSummary.changedLines} changed lines. Review decomposition and assertions.\n\n${detail}\n`);
  }

  return { allowedPaths, changedPaths, ...lineSummary };
}

function main() {
  try {
    runScopeCheck({
      baseSha: process.env.BASE_SHA,
      headSha: process.env.HEAD_SHA || "HEAD",
      rawAllowedPaths: process.env.ALLOWED_PATHS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    appendSummary(`## Scope verification failed\n\n\`\`\`text\n${message}\n\`\`\`\n`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();