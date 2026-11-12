import {compositionIds, compositions, isCompositionId, type CompositionId} from './registry';

export type PropsIssue = {path: string; message: string};

export type ValidationResult =
  | {ok: true; id: CompositionId; props: Record<string, unknown>; warnings: string[]}
  | {ok: false; errors: PropsIssue[]; warnings: string[]};

/** Levenshtein distance, used to suggest the composition or prop name that was meant. */
const distance = (a: string, b: string): number => {
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
};

export const closest = (input: string, options: readonly string[]): string | undefined => {
  const lower = input.toLowerCase();
  let best: string | undefined;
  let bestScore = Infinity;
  for (const option of options) {
    const score = distance(lower, option.toLowerCase());
    if (score < bestScore) {
      best = option;
      bestScore = score;
    }
  }
  return best !== undefined && bestScore <= Math.max(2, Math.floor(input.length / 3)) ? best : undefined;
};

const formatPath = (path: readonly PropertyKey[]) =>
  path.length ? path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('').replace(/^\./, '') : '(root)';

/**
 * Validate `input` for composition `id` with the same zod schema Remotion Studio uses.
 * Unknown keys are reported as warnings (with a "did you mean" hint) because Remotion
 * would silently ignore them, which usually means a typo in an automation.
 */
export function validateProps(id: string, input: unknown): ValidationResult {
  const warnings: string[] = [];
  if (!isCompositionId(id)) {
    const hint = closest(id, compositionIds);
    return {
      ok: false,
      warnings,
      errors: [
        {
          path: '(composition)',
          message: `unknown composition "${id}"${hint ? `, did you mean "${hint}"?` : ''} (available: ${compositionIds.join(', ')})`,
        },
      ],
    };
  }
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return {ok: false, warnings, errors: [{path: '(root)', message: 'props must be a JSON object'}]};
  }

  const {schema} = compositions[id];
  const known = Object.keys(schema.shape);
  for (const key of Object.keys(input)) {
    if (!known.includes(key)) {
      const hint = closest(key, known);
      warnings.push(`unknown prop "${key}" is ignored${hint ? `, did you mean "${hint}"?` : ''}`);
    }
  }

  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      ok: false,
      warnings,
      errors: result.error.issues.map((issue) => ({path: formatPath(issue.path), message: issue.message})),
    };
  }
  return {ok: true, id, props: result.data as Record<string, unknown>, warnings};
}
