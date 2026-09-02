import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initStarter } from '../scripts/init-starter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('starter template contains required baseline files', () => {
  const starterDir = path.join(rootDir, 'starter');
  const requiredFiles = [
    'product-contract.json',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'README.md',
    'AGENTS.md',
    '.github/lawchai-scope.yml',
    '.github/workflows/ci.yml',
    'src/App.tsx',
    'src/main.tsx',
    'src/index.css',
    'src/lib/storage.ts',
    'src/lib/evidence.ts',
    'tests/storage.test.ts',
    'tests/app.test.ts',
  ];

  for (const relFile of requiredFiles) {
    const fullPath = path.join(starterDir, relFile);
    assert.ok(fs.existsSync(fullPath), `Starter baseline missing required file: ${relFile}`);
  }
});

test('initStarter scaffolds customized consumer repository with pinned standards SHA', () => {
  const outputDir = path.join(rootDir, 'tmp-test-starter-output');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  const testSha = '1234567890abcdef1234567890abcdef12345678';
  const result = initStarter([
    '--id', 'dry-run-app',
    '--title', 'Dry Run Product',
    '--purpose', 'Test starter scaffolding',
    '--standards-sha', testSha,
    '--output', outputDir,
  ]);

  assert.ok(result.success);
  assert.ok(fs.existsSync(path.join(outputDir, 'product-contract.json')));

  const contract = JSON.parse(fs.readFileSync(path.join(outputDir, 'product-contract.json'), 'utf8'));
  assert.equal(contract.id, 'dry-run-app');
  assert.equal(contract.title, 'Dry Run Product');
  assert.equal(contract.standards_sha, testSha);

  const workflow = fs.readFileSync(path.join(outputDir, '.github', 'workflows', 'ci.yml'), 'utf8');
  assert.ok(workflow.includes(`@${testSha}`), 'CI workflow must pin specified commit SHA');

  fs.rmSync(outputDir, { recursive: true, force: true });
});
