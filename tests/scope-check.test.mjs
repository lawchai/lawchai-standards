import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SCOPE_PATH,
  findUnauthorisedPaths,
  meaningfulLineSummary,
  parseScopeYaml,
  pathIsAllowed,
  runScopeCheck,
} from "../.github/actions/scope-check/scope-check.mjs";

const VALID_SCOPE = `allowed_paths:
  - .github/lawchai-scope.yml
  - src/App.tsx
  - src/components/
`;

test("parses strict YAML exact paths and directory prefixes", () => {
  assert.deepEqual(parseScopeYaml(VALID_SCOPE), [
    ".github/lawchai-scope.yml",
    "src/App.tsx",
    "src/components/",
  ]);
  assert.equal(pathIsAllowed("src/App.tsx", ["src/App.tsx"]), true);
  assert.equal(pathIsAllowed("src/components/Card.tsx", ["src/components/"]), true);
  assert.equal(pathIsAllowed("src/component/Card.tsx", ["src/components/"]), false);
});

test("rejects missing, malformed and multi-key YAML", () => {
  for (const raw of [
    "",
    "paths:\n  - src/App.tsx",
    "allowed_paths:",
    "allowed_paths:\nsrc/App.tsx",
    "allowed_paths:\n  - src/App.tsx\nowner: agent",
    "allowed_paths:\n\t- src/App.tsx",
    "allowed_paths:\n  - 'src/App.tsx'",
  ]) {
    assert.throws(() => parseScopeYaml(raw));
  }
});

test("rejects duplicate, wildcard, traversal, absolute and backslash paths", () => {
  for (const entry of [
    "src/**",
    "../secret",
    "/etc/passwd",
    "C:/secret",
    "src\\App.tsx",
    ".",
  ]) {
    assert.throws(() => parseScopeYaml(`allowed_paths:\n  - ${entry}\n`));
  }
  assert.throws(() => parseScopeYaml("allowed_paths:\n  - src/App.tsx\n  - src/App.tsx\n"));
});

test("reports every path outside structured scope", () => {
  assert.deepEqual(
    findUnauthorisedPaths(
      [".github/lawchai-scope.yml", "src/App.tsx", "src/components/Card.tsx", "README.md"],
      [".github/lawchai-scope.yml", "src/App.tsx", "src/components/"],
    ),
    ["README.md"],
  );
});

test("counts meaningful source lines and excludes generated or dependency metadata", () => {
  const summary = meaningfulLineSummary([
    "200\t60\tsrc/App.tsx",
    "50\t50\tpackage-lock.json",
    "300\t0\tdist/app.js",
    "10\t5\tREADME.md",
  ].join("\n"));

  assert.equal(summary.changedLines, 260);
  assert.equal(summary.exceedsReviewThreshold, true);
  assert.deepEqual(summary.countedFiles, [{ file: "src/App.tsx", changedLines: 260 }]);
});

test("accepts a fresh authorised diff above 250 lines without throwing", () => {
  const calls = [];
  const git = (_command, args) => {
    calls.push(args);
    return args.includes("--name-only")
      ? `${DEFAULT_SCOPE_PATH}\nsrc/App.tsx\n`
      : `2\t0\t${DEFAULT_SCOPE_PATH}\n251\t0\tsrc/App.tsx\n`;
  };

  const result = runScopeCheck({
    baseSha: "base",
    headSha: "head",
    readFile: () => VALID_SCOPE,
    git,
  });

  assert.equal(result.exceedsReviewThreshold, true);
  assert.equal(result.changedLines, 251);
  assert.equal(calls.length, 2);
});

test("fails when per-PR scope metadata was inherited unchanged", () => {
  const git = (_command, args) =>
    args.includes("--name-only") ? "src/App.tsx\n" : "1\t0\tsrc/App.tsx\n";

  assert.throws(
    () => runScopeCheck({ baseSha: "base", headSha: "head", readFile: () => VALID_SCOPE, git }),
    /must be added or changed in every pull request/,
  );
});

test("fails when required scope metadata cannot be read", () => {
  const git = (_command, args) =>
    args.includes("--name-only") ? `${DEFAULT_SCOPE_PATH}\n` : `1\t0\t${DEFAULT_SCOPE_PATH}\n`;

  assert.throws(
    () =>
      runScopeCheck({
        baseSha: "base",
        headSha: "head",
        readFile: () => {
          throw new Error("missing");
        },
        git,
      }),
    /Unable to read required scope metadata/,
  );
});

test("fails when any changed path is outside allowed_paths", () => {
  const git = (_command, args) =>
    args.includes("--name-only")
      ? `${DEFAULT_SCOPE_PATH}\nsrc/App.tsx\nsrc/Hidden.tsx\n`
      : `1\t0\tsrc/App.tsx\n`;

  assert.throws(
    () =>
      runScopeCheck({
        baseSha: "base",
        headSha: "head",
        readFile: () => VALID_SCOPE,
        git,
      }),
    /src\/Hidden\.tsx/,
  );
});

test("fails safely without base or head SHA", () => {
  assert.throws(() => runScopeCheck({ baseSha: "", headSha: "head" }), /base SHA/);
  assert.throws(() => runScopeCheck({ baseSha: "base", headSha: "" }), /head SHA/);
});