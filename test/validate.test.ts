import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {compositionIds, compositions, durationInFrames, isCompositionId} from '../src/registry';
import {closest, validateProps} from '../src/validate';
// @ts-expect-error plain .mjs helper without type declarations
import {parseRenderArgs} from '../scripts/cli-args.mjs';

const example = (id: keyof typeof compositions) => JSON.parse(readFileSync(compositions[id].example, 'utf8'));

test('every example in props/ is valid and has no unknown keys', () => {
  for (const id of compositionIds) {
    const result = validateProps(id, example(id));
    assert.ok(result.ok, `${id}: ${JSON.stringify(!result.ok && result.errors)}`);
    assert.deepEqual(result.warnings, [], id);
  }
});

test('schema defaults alone are valid for every composition', () => {
  for (const id of compositionIds) {
    const result = validateProps(id, {});
    assert.ok(result.ok, id);
  }
});

test('registry: sizes and durations', () => {
  assert.deepEqual(
    compositionIds.map((id) => [id, compositions[id].width, compositions[id].height, durationInFrames(id)]),
    [
      ['ProductPromo', 1080, 1920, 450],
      ['ServiceAd', 1080, 1080, 360],
      ['YouTubeIntro', 1920, 1080, 180],
      ['BlogToReel', 1080, 1920, 600],
      ['TestimonialCard', 1080, 1350, 300],
    ],
  );
  assert.equal(isCompositionId('ServiceAd'), true);
  assert.equal(isCompositionId('toString'), false);
});

test('unknown composition gets a suggestion', () => {
  const result = validateProps('ServiceAdd', {});
  assert.equal(result.ok, false);
  assert.match(!result.ok ? result.errors[0].message : '', /did you mean "ServiceAd"/);
  const far = validateProps('Banner', {});
  assert.doesNotMatch(!far.ok ? far.errors[0].message : '', /did you mean/);
});

test('array length rules are reported with their path', () => {
  const bad = validateProps('ServiceAd', {benefits: ['only one']});
  assert.equal(bad.ok, false);
  assert.equal(!bad.ok && bad.errors[0].path, 'benefits');
  const reel = validateProps('BlogToReel', {points: ['a', 'b', 'c', 'd', 'e', 'f']});
  assert.equal(!reel.ok && reel.errors[0].path, 'points');
  const item = validateProps('BlogToReel', {points: ['a', 'b', 42]});
  assert.equal(!item.ok && item.errors[0].path, 'points[2]');
});

test('colors, rating and types are checked', () => {
  const color = validateProps('YouTubeIntro', {primaryColor: 'not-a-color'});
  assert.equal(!color.ok && color.errors[0].path, 'primaryColor');
  assert.equal(validateProps('YouTubeIntro', {primaryColor: 'rgba(10, 20, 30, 0.5)'}).ok, true);
  for (const rating of [0, 6, 4.5, '5']) {
    const r = validateProps('TestimonialCard', {rating});
    assert.equal(!r.ok && r.errors[0].path, 'rating', String(rating));
  }
  const type = validateProps('ProductPromo', {price: 29});
  assert.equal(!type.ok && type.errors[0].path, 'price');
});

test('non-object props are rejected', () => {
  for (const input of [null, [], 'text', 3]) {
    const r = validateProps('ServiceAd', input);
    assert.equal(r.ok, false);
  }
});

test('typos in prop names are warned about with a suggestion', () => {
  const result = validateProps('ProductPromo', {headLine: 'x', productImageURL: 'u', totallyNew: 1});
  assert.equal(result.ok, true);
  assert.deepEqual(result.warnings, [
    'unknown prop "headLine" is ignored, did you mean "headline"?',
    'unknown prop "productImageURL" is ignored, did you mean "productImageUrl"?',
    'unknown prop "totallyNew" is ignored',
  ]);
});

test('closest()', () => {
  assert.equal(closest('blogtoreel', compositionIds), 'BlogToReel');
  assert.equal(closest('zzz', ['abc']), undefined);
});

test('parseRenderArgs', () => {
  assert.deepEqual(parseRenderArgs(['BlogToReel', 'p.json', '--still', '225']), {
    list: false, validateOnly: false, skipValidation: false, still: true, frame: '225',
    composition: 'BlogToReel', propsFile: 'p.json', output: undefined,
  });
  const out = parseRenderArgs(['ProductPromo', 'p.json', 'out/x.png', '--still']);
  assert.equal(out.output, 'out/x.png');
  assert.equal(out.frame, '0');
  assert.equal(parseRenderArgs(['--list']).list, true);
  assert.match(parseRenderArgs(['X']).error, /missing/);
  assert.match(parseRenderArgs(['X', 'p.json', '--fast']).error, /unknown option/);
  assert.match(parseRenderArgs(['X', 'p.json', 'o', 'extra']).error, /unexpected/);
  assert.match(parseRenderArgs(['X', 'p.json', '--validate-only', '--skip-validation']).error, /cannot be combined/);
});

test('render script refuses invalid props before starting Remotion', () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ['scripts/render-from-json.mjs', ...args], {encoding: 'utf8'});
  const ok = run('ServiceAd', 'props/service-ad.json', '--validate-only');
  assert.equal(ok.status, 0, ok.stderr);
  const typo = run('ServiceAdd', 'props/service-ad.json', '--validate-only');
  assert.equal(typo.status, 1);
  assert.match(typo.stderr, /did you mean "ServiceAd"/);
  const wrongFile = run('TestimonialCard', 'props/service-ad.json', '--validate-only');
  assert.equal(wrongFile.status, 0, 'defaults fill in, unknown keys only warn');
  assert.match(wrongFile.stderr, /unknown prop "benefits"/);
  const missing = run('ServiceAd', 'props/nope.json');
  assert.equal(missing.status, 2);
  assert.equal(run('--bogus').status, 2);
});
