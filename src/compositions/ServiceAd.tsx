import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, CtaButton, ProgressBar, SceneFade} from '../components';
import {enter, theme} from '../theme';
import type {ServiceAdProps} from '../schemas';

export const ServiceAd: React.FC<ServiceAdProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = enter(frame, fps, 0, theme.spring.smooth);
  const cta = enter(frame, fps, 8 * fps, theme.spring.bouncy);

  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.body, color: p.textColor}}>
      <Background primary={p.primaryColor} accent={p.accentColor} background={p.backgroundColor} />
      <SceneFade>
        <div style={{position: 'absolute', top: 70, left: 80, display: 'flex', alignItems: 'center', gap: 20, opacity: head}}>
          <div style={{width: 56, height: 56, borderRadius: 16, background: p.accentColor, transform: `rotate(${frame * 1.2}deg)`}} />
          <span style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 44}}>{p.logoText}</span>
        </div>

        <div style={{position: 'absolute', top: 190, left: 80, right: 80, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 84, lineHeight: 1.1, opacity: head, transform: `translateY(${(1 - head) * 50}px)`}}>
          {p.headline}
        </div>

        <div style={{position: 'absolute', top: 440, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 28}}>
          {p.benefits.map((b, i) => {
            const s = enter(frame, fps, fps * (1.2 + i * 1.5));
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '28px 36px', borderRadius: theme.radius, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', opacity: s, transform: `translateX(${(1 - s) * -200}px)`}}>
                <div style={{width: 56, height: 56, borderRadius: '50%', background: p.accentColor, color: p.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 32, flexShrink: 0}}>
                  {i + 1}
                </div>
                <span style={{fontSize: 44, fontWeight: 600}}>{b}</span>
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', bottom: 80, width: '100%', textAlign: 'center'}}>
          <CtaButton text={p.cta} scale={cta} color={p.primaryColor} textColor={p.textColor} fontSize={46} />
        </div>
      </SceneFade>
      <ProgressBar color={p.accentColor} />
    </AbsoluteFill>
  );
};
