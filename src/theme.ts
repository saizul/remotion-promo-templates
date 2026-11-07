import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadSora} from '@remotion/google-fonts/Sora';
import {spring, interpolate} from 'remotion';

export const {fontFamily: bodyFont} = loadInter('normal', {weights: ['400', '600'], subsets: ['latin']});
export const {fontFamily: displayFont} = loadSora('normal', {weights: ['700', '800'], subsets: ['latin']});

export const theme = {
  colors: {
    primary: '#6C5CE7',
    accent: '#00D2A0',
    background: '#0B0B14',
    text: '#FFFFFF',
    muted: '#A9A9C0',
  },
  fonts: {display: displayFont, body: bodyFont},
  radius: 32,
  spring: {
    snappy: {damping: 14, stiffness: 140, mass: 0.7},
    smooth: {damping: 200},
    bouncy: {damping: 9, stiffness: 120},
  },
} as const;

/** Spring from 0 to 1 starting at `delay` frames. */
export const enter = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<{damping: number; stiffness: number; mass: number}> = theme.spring.snappy,
) => spring({frame: frame - delay, fps, config});

/** Fade-out over the final `frames` of a composition. */
export const fadeOut = (frame: number, duration: number, frames = 12) =>
  interpolate(frame, [duration - frames, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
