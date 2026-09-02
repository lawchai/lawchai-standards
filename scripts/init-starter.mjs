#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const starterDir = path.join(rootDir, 'starter');

function parseArgs(args) {
  const options = {
    id: 'my-lawchai-app',
    title: 'My LawChai App',
    purpose: 'Standardized LawChai web application',
    owner: 'lawchai',
    repository: '',
    standardsSha: '0000000000000000000000000000000000000000',
    output: '',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--id' && args[i + 1]) {
      options.id = args[++i];
    } else if (arg === '--title' && args[i + 1]) {
      options.title = args[++i];
    } else if (arg === '--purpose' && args[i + 1]) {
      options.purpose = args[++i];
    } else if (arg === '--owner' && args[i + 1]) {
      options.owner = args[++i];
    } else if (arg === '--repository' && args[i + 1]) {
      options.repository = args[++i];
    } else if (arg === '--standards-sha' && args[i + 1]) {
      options.standardsSha = args[++i];
    } else if (arg === '--output' && args[i + 1]) {
      options.output = args[++i];
    }
  }

  if (!options.repository) {
    options.repository = `${options.owner}/${options.id}`;
  }
  if (!options.output) {
    options.output = path.join(rootDir, 'tmp-scaffold', options.id);
  }

  return options;
}

function copyDirRecursiveSync(src, dest, transform) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursiveSync(srcPath, destPath, transform);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (transform) {
        content = transform(srcPath, content);
      }
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }
}

export function initStarter(rawArgs = process.argv.slice(2)) {
  const options = parseArgs(rawArgs);

  if (options.help) {
    console.log(`
LawChai Starter Scaffolding Utility

Usage:
  node scripts/init-starter.mjs [options]

Options:
  --id <id>                 Product identifier (default: my-lawchai-app)
  --title <title>           Product title
  --purpose <purpose>       Product purpose description
  --owner <owner>           GitHub owner (default: lawchai)
  --repository <repo>       GitHub repo (default: owner/id)
  --standards-sha <sha>     40-character commit SHA of lawchai-standards
  --output <path>           Target directory path
  --help                    Show help message
`);
    return { success: true, options };
  }

  if (!/^[0-9a-f]{40}$/i.test(options.standardsSha) && options.standardsSha !== '0000000000000000000000000000000000000000') {
    throw new Error(`Invalid standards SHA: "${options.standardsSha}". Must be a 40-character commit SHA.`);
  }

  const targetDir = path.resolve(options.output);

  copyDirRecursiveSync(starterDir, targetDir, (filePath, content) => {
    const relative = path.relative(starterDir, filePath);

    if (relative === 'product-contract.json') {
      const parsed = JSON.parse(content);
      parsed.id = options.id;
      parsed.title = options.title;
      parsed.purpose = options.purpose;
      parsed.owner = options.owner;
      parsed.repository = options.repository;
      parsed.standards_sha = options.standardsSha;
      return JSON.stringify(parsed, null, 2) + '\n';
    }

    if (relative === 'package.json') {
      const parsed = JSON.parse(content);
      parsed.name = options.id;
      return JSON.stringify(parsed, null, 2) + '\n';
    }

    if (relative === path.join('.github', 'workflows', 'ci.yml')) {
      return content.replace(
        /lawchai\/lawchai-standards\/\.github\/workflows\/ci-react-ts\.yml@[0-9a-f]{40}/g,
        `lawchai/lawchai-standards/.github/workflows/ci-react-ts.yml@${options.standardsSha}`
      );
    }

    return content;
  });

  return { success: true, targetDir, options };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    const res = initStarter();
    if (res.targetDir) {
      console.log(`Successfully scaffolded LawChai starter product at: ${res.targetDir}`);
    }
  } catch (err) {
    console.error(`Error scaffolding starter: ${err.message}`);
    process.exit(1);
  }
}
