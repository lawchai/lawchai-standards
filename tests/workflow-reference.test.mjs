import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflows = [
  ".github/workflows/ci-react-ts.yml",
  ".github/workflows/ci-react-ts-self-hosted.yml",
];

for (const workflow of workflows) {
  test(`${workflow} binds scope-check to the reusable workflow revision`, () => {
    const content = readFileSync(workflow, "utf8");

    assert.match(
      content,
      /uses:\s+\$\/\.github\/actions\/scope-check/,
      "scope-check must resolve from the same repository revision as the reusable workflow",
    );
    assert.doesNotMatch(
      content,
      /lawchai\/lawchai-standards\/\.github\/actions\/scope-check@/,
      "scope-check must not carry an independent standards commit pin",
    );
  });
}
