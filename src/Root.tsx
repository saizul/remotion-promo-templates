import React from 'react';
import {Composition} from 'remotion';
import {ProductPromo} from './compositions/ProductPromo';
import {ServiceAd} from './compositions/ServiceAd';
import {YouTubeIntro} from './compositions/YouTubeIntro';
import {BlogToReel} from './compositions/BlogToReel';
import {TestimonialCard} from './compositions/TestimonialCard';
import {FPS, compositions, durationInFrames, type CompositionId} from './registry';

// Sizes, durations and schemas come from registry.ts, shared with the props validator.
const components: {[K in CompositionId]: React.FC<never>} = {
  ProductPromo,
  ServiceAd,
  YouTubeIntro,
  BlogToReel,
  TestimonialCard,
};

export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(compositions) as CompositionId[]).map((id) => {
      const meta = compositions[id];
      return (
        <Composition
          key={id}
          id={id}
          component={components[id] as React.FC<Record<string, unknown>>}
          schema={meta.schema}
          defaultProps={meta.schema.parse({})}
          width={meta.width}
          height={meta.height}
          fps={FPS}
          durationInFrames={durationInFrames(id)}
        />
      );
    })}
  </>
);
