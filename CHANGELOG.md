# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Props validation before every render: `render-from-json.mjs` checks the JSON against the
  composition's zod schema and stops with a list of problems (exit code 1) before
  Remotion starts. Unknown keys produce "did you mean" warnings.
- `--validate-only`, `--skip-validation` and `--list` options; `scripts/validate-props.ts`
  and `npm run validate` to check every example.
- `src/registry.ts` as the single source of truth for ids, sizes, durations and schemas,
  and `src/validate.ts` with `validateProps()` for use in your own services.
- Test suite (`npm test`) and a GitHub Actions workflow that typechecks, tests and
  renders one still frame.

### Changed
- Color tokens moved to `src/palette.ts` so schemas load in plain Node without fonts.
- Unknown CLI flags and extra arguments are now rejected with exit code 2.
- Requires Node.js 20 or newer.

## [1.0.0]

- ProductPromo, ServiceAd, YouTubeIntro, BlogToReel and TestimonialCard templates.
