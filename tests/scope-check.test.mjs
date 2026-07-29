import test from "node:test";
import assert from "node:assert/strict";
import {
  findUnauthorisedPaths,
  meaningfulLineSummary,
  parseAllowedPaths,
  pathIsAllowed,
  runScopeCheck,
} from "../.github/actions/scope-check/scope-check.mjs";

test("parses exact paths and directory prefixes", () => {
  assert.deepEqual(parseAllowedPaths("src/App.tsx\nsrc/components/\n"), [
    "src/App.tsx",
    "src/components/",
  ]);
  assert.equal(pathIsAllowed("src/App.tsx", ["src/App.tsx"]), true);
  assert.equal(pathIsAllowed("src/components/Card.tsx", ["src/components/"]), true);
  assert.equal(pathIsAllowed("src/component/Card.tsx", ["src/components/"]), false);
});

test("rejects missing, duplicate, wildcard, traversal, absolute and backslash entries", () => {
  for (const raw of [
    "",
    "src/App.tsx\nsrc/App.tsx",
    "src/**",
    "../secret",
    "/etc/passwd",
    "C:/secret",
    "src\\App.tsx",
    ".",
  ]) {
    assert.throws(() => parseAllowedPaths(raw));
  }
});

test("reports every path outside structured scope", () => {
  assert.deepEqual(
    findUnauthorisedPaths(
      ["src/App.tsx", "src/components/Card.tsx", "README.md"],
      ["src/App.tsx", "src/components/"],
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

test("accepts an authorised diff above 250 lines without throwing", () => {
  const calls = [];
  const git = (_command, args) => {
    calls.push(args);
    return args.includes("--name-only") ? "src/App.tsx\n" : "251\t0\tsrc/App.tsx\n";
  };

  const result = runScopeCheck({
    baseSha: "base",
    headSha: "head",
    rawAllowedPaths: "src/App.tsx",
    git,
  });

  assert.equal(result.exceedsReviewThreshold, true);
  assert.equal(result.changedLines, 251);
  assert.equal(calls.length, 2);
});

test("fails when any changed path is outside allowed_paths", () => {
  const git = (_command, args) =>
    args.includes("--name-only") ? "src/App.tsx\nsrc/Hidden.tsx\n" : "1\t0\tsrc/App.tsx\n";

  assert.throws(
    () =>
      runScopeCheck({
        baseSha: "base",
        headSha: "head",
        rawAllowedPaths: "src/App.tsx",
        git,
      }),
    /src\/Hidden\.tsx/,
  );
});

test("fails safely without base or head SHA", () => {
  assert.throws(
    () => runScopeCheck({ baseSha: "", headSha: "head", rawAllowedPaths: "src/App.tsx" }),
    /base SHA/,
  );
  assert.throws(
    () => runScopeCheck({ baseSha: "base", headSha: "", rawAllowedPaths: "src/App.tsx" }),
    /head SHA/,
  );
});