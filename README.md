# remotion-promo-templates

Reusable, props-driven promo video templates built with [Remotion](https://www.remotion.dev) 4, React and TypeScript. Every template is described by a zod schema, so you can edit props visually in Remotion Studio or fill them from JSON in an automation (n8n, Make, a cron job, your own backend).

Built by [Saizul Amin](https://saizul.com). MIT licensed.

No copyrighted music, brand assets or non-redistributable fonts are included. Fonts (Inter, Sora) come from Google Fonts through `@remotion/google-fonts`, and all graphics are plain shapes.

## Templates

| Composition    | Size      | Duration | Use case                                         |
| -------------- | --------- | -------- | ------------------------------------------------ |
| `ProductPromo` | 1080x1920 | 15 s     | Headline, product image URL, price, CTA, colors  |
| `ServiceAd`    | 1080x1080 | 12 s     | Logo text, headline, 3 animated benefits, CTA    |
| `YouTubeIntro` | 1920x1080 | 6 s      | Kinetic title and subtitle                       |
| `BlogToReel`   | 1080x1920 | 20 s     | Blog title plus 3 to 5 key points, for Reels     |
| `TestimonialCard` | 1080x1350 | 10 s  | Client quote, star rating, author, CTA (4:5 feed post) |

All run at 30 fps. Colors (`primaryColor`, `accentColor`, `backgroundColor`, `textColor`) are props on every template; defaults live in `src/theme.ts`.

## Previews

| ProductPromo | ServiceAd | YouTubeIntro | BlogToReel |
| --- | --- | --- | --- |
| ![ProductPromo](docs/preview-product-promo.png) | ![ServiceAd](docs/preview-service-ad.png) | ![YouTubeIntro](docs/preview-youtube-intro.png) | ![BlogToReel](docs/preview-blog-to-reel.png) |

## Quick start

```bash
npm install
npm run dev        # opens Remotion Studio, edit props in the sidebar
npm run typecheck
npm test           # props validation and CLI tests, no rendering
npm run validate   # check every example in props/
```

## Rendering from JSON

```bash
node scripts/render-from-json.mjs <CompositionId> <props.json> [output] [--still [frame]]

node scripts/render-from-json.mjs ProductPromo props/product-promo.json out/promo.mp4
node scripts/render-from-json.mjs BlogToReel props/blog-to-reel.json --still 225
```

Shortcuts: `npm run render:product`, `render:service`, `render:intro`, `render:reel`, `render:testimonial`. The script wraps `npx remotion render` (or `remotion still`) with `--props=<file>`. Example inputs are in `props/`. Missing props fall back to the schema defaults.

### Props are validated before rendering

Before Remotion starts, the JSON is checked against the composition's zod schema (the same one Remotion Studio uses). Bad input fails in about a second with every problem listed, instead of minutes into a render or, worse, as a silently wrong video:

```text
$ node scripts/render-from-json.mjs ServiceAd props/my-ad.json
warning: props/my-ad.json: unknown prop "headLine" is ignored, did you mean "headline"?
invalid props in props/my-ad.json for ServiceAd:
  - benefits: Too small: expected array to have >=3 items
  - primaryColor: Invalid color
```

| Option | Meaning |
| --- | --- |
| `--validate-only` | check the props and exit (0 valid, 1 invalid, 2 usage or file error) |
| `--skip-validation` | render without checking (not recommended) |
| `--list` | print every composition with its size, duration and props |

Unknown keys are warnings, not errors, because Remotion ignores them; they are almost always a typo in an automation. You can also run the validator directly: `npx tsx scripts/validate-props.ts ServiceAd props/my-ad.json`.

### Props reference

- `ProductPromo`: `headline`, `productImageUrl`, `price`, `oldPrice`, `cta`, `brand`
- `ServiceAd`: `logoText`, `headline`, `benefits` (exactly 3), `cta`
- `YouTubeIntro`: `title`, `subtitle`
- `BlogToReel`: `title`, `points` (3 to 5), `cta`, `source`
- `TestimonialCard`: `quote`, `author`, `role`, `rating` (1 to 5), `cta`

## Automating with n8n

Remotion renders need Node and Chromium, so run them on a machine you control (a VPS works well) with this repo installed.

**Execute Command approach (n8n on the same host)**

1. Generate content upstream (for example, an LLM node that turns a blog post into a title and 4 points).
2. A Code node builds the props object. A Write Binary File node saves it as `/tmp/props-{{$json.id}}.json`.
3. An Execute Command node runs:
   ```bash
   cd /opt/remotion-promo-templates && node scripts/render-from-json.mjs BlogToReel /tmp/props-{{$json.id}}.json out/{{$json.id}}.mp4
   ```
4. A Read Binary File node loads `out/<id>.mp4` and passes it to YouTube, Instagram, Drive, etc.

**HTTP approach (n8n elsewhere)**

Wrap the script in a small service (for example an Express endpoint that accepts `{composition, props}`, writes the JSON to a temp file, spawns the script and streams back the MP4). Then use an n8n HTTP Request node to POST the JSON and receive the file. Protect the endpoint with a secret header, and reject bad input early with `validateProps(id, props)` from `src/validate.ts` (or run the script with `--validate-only` and return its stderr to the caller).

Product images must be reachable URLs when rendering (`productImageUrl`).

## Project layout

```
src/
  Root.tsx          registers every entry of registry.ts with Remotion
  registry.ts       composition ids, sizes, durations, schemas, example props
  schemas.ts        zod schemas and prop types
  validate.ts       validateProps(): schema check, unknown-key warnings, suggestions
  palette.ts        color tokens (no side effects, safe to import in Node)
  theme.ts          palette, Google Fonts, spring presets
  components.tsx    shared background, CTA button, progress bar
  compositions/     the five templates
props/              example JSON inputs
scripts/            render-from-json.mjs, validate-props.ts, cli-args.mjs
test/               node:test suites (run with npm test)
```

To add a template, create the component and schema, then add one entry to `src/registry.ts` and the component to `Root.tsx`; validation, `--list` and the example test pick it up automatically.

## License

MIT, see [LICENSE](LICENSE). Copyright (c) 2026 Saizul Amin.
