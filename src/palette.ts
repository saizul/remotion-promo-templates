// Plain color tokens with no side effects, so schemas (and the props validator that runs
// in Node outside Remotion) can import them without loading fonts.
export const palette = {
  primary: '#6C5CE7',
  accent: '#00D2A0',
  background: '#0B0B14',
  text: '#FFFFFF',
  muted: '#A9A9C0',
} as const;
