import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {theme, fadeOut} from './theme';

/** Animated gradient background built only from shapes. */
export const Background: React.FC<{primary: string; accent: string; background: string}> = ({
  primary,
  accent,
  background,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: '90%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: primary,
          filter: 'blur(140px)',
          opacity: 0.55,
          left: `${-20 + Math.sin(t * 0.6) * 8}%`,
          top: `${-15 + Math.cos(t * 0.5) * 8}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '70%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: accent,
          filter: 'blur(160px)',
          opacity: 0.35,
          right: `${-20 + Math.cos(t * 0.5) * 8}%`,
          bottom: `${-15 + Math.sin(t * 0.7) * 8}%`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Wraps children and fades the whole scene out at the end. */
export const SceneFade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <AbsoluteFill style={{opacity: fadeOut(frame, durationInFrames)}}>{children}</AbsoluteFill>;
};

export const CtaButton: React.FC<{
  text: string;
  scale: number;
  color: string;
  textColor?: string;
  fontSize?: number;
}> = ({text, scale, color, textColor = '#fff', fontSize = 52}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.025 * Math.min(1, scale);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: `${fontSize * 0.5}px ${fontSize * 1.3}px`,
        borderRadius: 999,
        background: color,
        color: textColor,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize,
        transform: `scale(${scale * pulse})`,
        boxShadow: `0 20px 60px ${color}66`,
      }}
    >
      {text}
    </div>
  );
};

export const progressBar = (frame: number, duration: number) =>
  interpolate(frame, [0, duration], [0, 100], {extrapolateRight: 'clamp'});

export const ProgressBar: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${progressBar(frame, durationInFrames)}%`, background: color}} />
  );
};
