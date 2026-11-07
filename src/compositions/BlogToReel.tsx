import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, CtaButton, ProgressBar, SceneFade} from '../components';
import {enter, theme} from '../theme';
import type {BlogToReelProps} from '../schemas';

const Title: React.FC<BlogToReelProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0, theme.spring.smooth);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: 90}}>
      <div style={{fontSize: 40, letterSpacing: 6, color: p.accentColor, fontWeight: 600, opacity: s}}>{p.source.toUpperCase()}</div>
      <div style={{marginTop: 30, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 130, lineHeight: 1.08, opacity: s, transform: `translateY(${(1 - s) * 80}px)`}}>
        {p.title}
      </div>
    </AbsoluteFill>
  );
};

const Point: React.FC<{text: string; index: number; total: number; p: BlogToReelProps}> = ({text, index, total, p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0);
  const t = enter(frame, fps, 6, theme.spring.smooth);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: 90}}>
      <div style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 360, lineHeight: 1, color: p.accentColor, opacity: 0.9, transform: `scale(${0.5 + s * 0.5})`, transformOrigin: 'left center'}}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div style={{marginTop: 20, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 98, lineHeight: 1.15, opacity: t, transform: `translateX(${(1 - t) * 120}px)`}}>
        {text}
      </div>
      <div style={{marginTop: 70, display: 'flex', gap: 14}}>
        {Array.from({length: total}).map((_, i) => (
          <div key={i} style={{height: 12, flex: 1, borderRadius: 6, background: i <= index ? p.accentColor : 'rgba(255,255,255,0.2)'}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<BlogToReelProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0, theme.spring.bouncy);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 90}}>
      <div style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 96, marginBottom: 70, opacity: s}}>{p.title}</div>
      <CtaButton text={p.cta} scale={s} color={p.primaryColor} textColor={p.textColor} fontSize={64} />
      <div style={{marginTop: 50, fontSize: 44, color: theme.colors.muted, opacity: s}}>{p.source}</div>
    </AbsoluteFill>
  );
};

export const BlogToReel: React.FC<BlogToReelProps> = (p) => {
  const {fps} = useVideoConfig();
  const intro = 3 * fps;
  const outro = 3 * fps;
  const n = p.points.length;
  const per = Math.floor((20 * fps - intro - outro) / n);
  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.body, color: p.textColor}}>
      <Background primary={p.primaryColor} accent={p.accentColor} background={p.backgroundColor} />
      <SceneFade>
        <Sequence durationInFrames={intro}><Title {...p} /></Sequence>
        {p.points.map((pt, i) => (
          <Sequence key={i} from={intro + i * per} durationInFrames={per}>
            <Point text={pt} index={i} total={n} p={p} />
          </Sequence>
        ))}
        <Sequence from={intro + n * per}><Outro {...p} /></Sequence>
      </SceneFade>
      <ProgressBar color={p.accentColor} />
    </AbsoluteFill>
  );
};
