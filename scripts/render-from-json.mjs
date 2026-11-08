#!/usr/bin/env node
// Usage: node scripts/render-from-json.mjs <CompositionId> <props.json> [output] [--still [frame]]
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const stillIdx = args.indexOf('--still');
let still = false;
let frame = '0';
if (stillIdx !== -1) {
  still = true;
  const maybe = args[stillIdx + 1];
  if (maybe && /^\d+$/.test(maybe)) {
    frame = maybe;
    args.splice(stillIdx, 2);
  } else {
    args.splice(stillIdx, 1);
  }
}

const [composition, propsFile, output] = args;
if (!composition || !propsFile) {
  console.error('Usage: node scripts/render-from-json.mjs <CompositionId> <props.json> [output] [--still [frame]]');
  console.error('Compositions: ProductPromo, ServiceAd, YouTubeIntro, BlogToReel, TestimonialCard');
  process.exit(1);
}
if (!existsSync(propsFile)) {
  console.error(`Props file not found: ${propsFile}`);
  process.exit(1);
}

const out = output ?? path.join('out', `${composition}.${still ? 'png' : 'mp4'}`);
mkdirSync(path.dirname(out), {recursive: true});

const cliArgs = [
  'remotion',
  still ? 'still' : 'render',
  'src/index.ts',
  composition,
  out,
  `--props=${propsFile}`,
];
if (still) cliArgs.push(`--frame=${frame}`);

const res = spawnSync('npx', cliArgs, {stdio: 'inherit', shell: process.platform === 'win32'});
process.exit(res.status ?? 1);
