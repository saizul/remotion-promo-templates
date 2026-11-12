// Argument parsing for render-from-json.mjs, kept separate so it can be unit tested.
export const USAGE =
  'Usage: node scripts/render-from-json.mjs <CompositionId> <props.json> [output] [--still [frame]] [--validate-only] [--skip-validation]\n' +
  '       node scripts/render-from-json.mjs --list';

export function parseRenderArgs(argv) {
  const args = [...argv];
  const take = (flag) => {
    const i = args.indexOf(flag);
    if (i === -1) return false;
    args.splice(i, 1);
    return true;
  };
  const opts = {
    list: take('--list'),
    validateOnly: take('--validate-only'),
    skipValidation: take('--skip-validation'),
    still: false,
    frame: '0',
  };
  const stillIdx = args.indexOf('--still');
  if (stillIdx !== -1) {
    opts.still = true;
    const maybe = args[stillIdx + 1];
    if (maybe !== undefined && /^\d+$/.test(maybe)) {
      opts.frame = maybe;
      args.splice(stillIdx, 2);
    } else {
      args.splice(stillIdx, 1);
    }
  }
  const unknown = args.filter((a) => a.startsWith('--'));
  if (unknown.length) return {...opts, error: `unknown option(s): ${unknown.join(', ')}`};
  if (opts.validateOnly && opts.skipValidation) {
    return {...opts, error: '--validate-only and --skip-validation cannot be combined'};
  }
  const [composition, propsFile, output, ...rest] = args;
  if (rest.length) return {...opts, error: `unexpected argument(s): ${rest.join(' ')}`};
  if (!opts.list && (!composition || !propsFile)) return {...opts, error: 'missing <CompositionId> or <props.json>'};
  return {...opts, composition, propsFile, output};
}
