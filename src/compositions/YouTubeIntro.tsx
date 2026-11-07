import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, SceneFade} from '../components';
import {enter, theme} from '../theme';
import type {YouTubeIntroProps} from '../schemas';

export const YouTubeIntro: React.FC<YouTubeIntroProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = Array.from(p.title);
  const sub = enter(frame, fps, 2 * fps, theme.spring.smooth);
  const line = interpolate(enter(frame, fps, 12, theme.spring.smooth), [0, 1], [0, 100]);

  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.body, color: p.textColor, justifyContent: 'center', alignItems: 'center'}}>
      <Background primary={p.primaryColor} accent={p.accentColor} background={p.backgroundColor} />
      <SceneFade>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 140px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, lineHeight: 1.1}}>
            {chars.map((c, i) => {
              const s = enter(frame, fps, 8 + i * 1.5, theme.spring.bouncy);
              return (
                <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * 12}deg)`}}>
                  {c}
                </span>
              );
            })}
          </div>
          <div style={{marginTop: 40, height: 10, width: `${line}%`, maxWidth: 600, borderRadius: 5, background: p.accentColor}} />
          <div style={{marginTop: 40, fontSize: 56, fontWeight: 600, color: theme.colors.muted, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`, letterSpacing: 2}}>
            {p.subtitle}
          </div>
        </AbsoluteFill>
      </SceneFade>
    </AbsoluteFill>
  );
};
