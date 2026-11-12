#!/usr/bin/env node
// Usage: node scripts/render-from-json.mjs <CompositionId> <props.json> [output] [--still [frame]]
//        [--validate-only] [--skip-validation]   |   --list
// Props are validated against the composition's zod schema before Remotion starts, so a
// typo in an automation fails in a second with a clear message instead of mid-render.
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {USAGE, parseRenderArgs} from './cli-args.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const opts = parseRenderArgs(process.argv.slice(2));

const tsx = (...args) =>
  spawnSync(process.execPath, ['--import', 'tsx', path.join(here, 'validate-props.ts'), ...args], {stdio: 'inherit'})
    .status ?? 2;

if (opts.list) process.exit(tsx('--list'));
if (opts.error) {
  console.error(`error: ${opts.error}`);
  console.error(USAGE);
  process.exit(2);
}

if (!opts.skipValidation) {
  const status = tsx(opts.composition, opts.propsFile, '--quiet');
  if (status !== 0) process.exit(status);
  if (opts.validateOnly) {
    console.log(`ok: ${opts.propsFile} is valid for ${opts.composition}`);
    process.exit(0);
  }
}

const out = opts.output ?? path.join('out', `${opts.composition}.${opts.still ? 'png' : 'mp4'}`);
mkdirSync(path.dirname(out), {recursive: true});

const cliArgs = [
  'remotion',
  opts.still ? 'still' : 'render',
  'src/index.ts',
  opts.composition,
  out,
  `--props=${opts.propsFile}`,
];
if (opts.still) cliArgs.push(`--frame=${opts.frame}`);

const res = spawnSync('npx', cliArgs, {stdio: 'inherit', shell: process.platform === 'win32'});
process.exit(res.status ?? 1);
