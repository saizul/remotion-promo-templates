import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Background, CtaButton, ProgressBar, SceneFade} from '../components';
import {enter, theme} from '../theme';
import type {ProductPromoProps} from '../schemas';

export const ProductPromo: React.FC<ProductPromoProps> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = p.headline.split(' ');

  const card = enter(frame, fps, 20, theme.spring.smooth);
  const float = Math.sin(frame / 20) * 14;
  const price = enter(frame, fps, 150, theme.spring.bouncy);
  const cta = enter(frame, fps, 230, theme.spring.bouncy);

  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.body, color: p.textColor}}>
      <Background primary={p.primaryColor} accent={p.accentColor} background={p.backgroundColor} />
      <SceneFade>
        <div style={{position: 'absolute', top: 100, width: '100%', textAlign: 'center', fontFamily: theme.fonts.display, fontWeight: 800, letterSpacing: 8, fontSize: 36, opacity: enter(frame, fps, 0)}}>
          {p.brand}
        </div>

        <div style={{position: 'absolute', top: 220, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 24px'}}>
          {words.map((w, i) => {
            const s = enter(frame, fps, 6 + i * 5);
            return (
              <span key={i} style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 104, lineHeight: 1.1, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
                {w}
              </span>
            );
          })}
        </div>

        <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${float}px) scale(${0.6 + card * 0.4})`, opacity: card}}>
          <div style={{width: 620, height: 620, borderRadius: theme.radius * 2, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 40px 120px ${p.primaryColor}88`}}>
            {p.productImageUrl ? (
              <Img src={p.productImageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <div style={{width: 260, height: 400, borderRadius: 60, background: `linear-gradient(160deg, ${p.accentColor}, ${p.primaryColor})`}} />
            )}
          </div>
        </div>

        <div style={{position: 'absolute', top: 1450, width: '100%', textAlign: 'center', transform: `scale(${price})`, opacity: price}}>
          {p.oldPrice ? (
            <span style={{fontSize: 56, color: theme.colors.muted, textDecoration: 'line-through', marginRight: 32}}>{p.oldPrice}</span>
          ) : null}
          <span style={{fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 150, color: p.accentColor}}>{p.price}</span>
        </div>

        <div style={{position: 'absolute', top: 1660, width: '100%', textAlign: 'center', opacity: interpolate(cta, [0, 1], [0, 1])}}>
          <CtaButton text={p.cta} scale={cta} color={p.primaryColor} textColor={p.textColor} />
        </div>
      </SceneFade>
      <ProgressBar color={p.accentColor} />
    </AbsoluteFill>
  );
};
