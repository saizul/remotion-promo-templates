import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, CtaButton, ProgressBar, SceneFade} from '../components';
import {enter, theme} from '../theme';
import type {TestimonialCardProps} from '../schemas';

const Star: React.FC<{filled: boolean; color: string; size: number}> = ({filled, color, size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </svg>
);

export const TestimonialCard: React.FC<TestimonialCardProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = enter(frame, fps, 0, theme.spring.smooth);
  const quote = enter(frame, fps, Math.round(0.8 * fps), theme.spring.smooth);
  const author = enter(frame, fps, Math.round(2 * fps));
  const cta = enter(frame, fps, 6 * fps, theme.spring.bouncy);
  const initial = (p.author.trim()[0] ?? '?').toUpperCase();

  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.body, color: p.textColor}}>
      <Background primary={p.primaryColor} accent={p.accentColor} background={p.backgroundColor} />
      <SceneFade>
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 80,
            right: 80,
            padding: '70px 60px',
            borderRadius: theme.radius,
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.15)',
            opacity: card,
            transform: `translateY(${(1 - card) * 60}px)`,
          }}
        >
          <div style={{display: 'flex', gap: 10, marginBottom: 30}}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} filled={n <= p.rating} color={p.accentColor} size={64} />
            ))}
          </div>
          <div style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, lineHeight: 0.6, color: p.accentColor, height: 80}}>
            {'\u201C'}
          </div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 1.25,
              opacity: quote,
              transform: `translateY(${(1 - quote) * 30}px)`,
            }}
          >
            {p.quote}
          </div>
        </div>

        <div style={{position: 'absolute', top: 880, left: 80, right: 80, display: 'flex', alignItems: 'center', gap: 28, opacity: author}}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              background: p.primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 54,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div>
            <div style={{fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48}}>{p.author}</div>
            <div style={{fontSize: 34, color: theme.colors.muted}}>{p.role}</div>
          </div>
        </div>

        <div style={{position: 'absolute', bottom: 90, width: '100%', textAlign: 'center'}}>
          <CtaButton text={p.cta} scale={cta} color={p.primaryColor} textColor={p.textColor} fontSize={44} />
        </div>
      </SceneFade>
      <ProgressBar color={p.accentColor} />
    </AbsoluteFill>
  );
};
