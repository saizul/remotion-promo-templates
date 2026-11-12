// Validate a props JSON file against a composition's zod schema.
// Usage: npx tsx scripts/validate-props.ts <CompositionId> <props.json> [--quiet]
//        npx tsx scripts/validate-props.ts --all     (every example in props/)
//        npx tsx scripts/validate-props.ts --list
// Exit codes: 0 valid, 1 invalid props, 2 bad usage or unreadable file.
import {readFileSync} from 'node:fs';
import {compositionIds, compositions} from '../src/registry';
import {validateProps} from '../src/validate';

export function checkFile(id: string, file: string, quiet = false): number {
  let input: unknown;
  try {
    input = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    const reason = (err as NodeJS.ErrnoException).code === 'ENOENT' ? 'file not found' : (err as Error).message;
    console.error(`error: cannot read ${file}: ${reason}`);
    return 2;
  }
  const result = validateProps(id, input);
  for (const w of result.warnings) console.warn(`warning: ${file}: ${w}`);
  if (!result.ok) {
    console.error(`invalid props in ${file} for ${id}:`);
    for (const e of result.errors) console.error(`  - ${e.path}: ${e.message}`);
    return 1;
  }
  if (!quiet) console.log(`ok: ${file} is valid for ${id}`);
  return 0;
}

function main(argv: string[]): number {
  const quiet = argv.includes('--quiet');
  const args = argv.filter((a) => a !== '--quiet');
  if (args[0] === '--list') {
    for (const id of compositionIds) {
      const m = compositions[id];
      console.log(`${id.padEnd(16)} ${m.width}x${m.height}  ${m.seconds}s  props: ${Object.keys(m.schema.shape).join(', ')}`);
    }
    return 0;
  }
  if (args[0] === '--all') {
    return compositionIds.reduce((code, id) => Math.max(code, checkFile(id, compositions[id].example, quiet)), 0);
  }
  if (args.length !== 2) {
    console.error('Usage: npx tsx scripts/validate-props.ts <CompositionId> <props.json> [--quiet] | --all | --list');
    return 2;
  }
  return checkFile(args[0], args[1], quiet);
}

if (process.argv[1] && /validate-props\.ts$/.test(process.argv[1])) {
  process.exit(main(process.argv.slice(2)));
}
