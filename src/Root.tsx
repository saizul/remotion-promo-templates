import React from 'react';
import {Composition} from 'remotion';
import {ProductPromo} from './compositions/ProductPromo';
import {ServiceAd} from './compositions/ServiceAd';
import {YouTubeIntro} from './compositions/YouTubeIntro';
import {BlogToReel} from './compositions/BlogToReel';
import {blogToReelSchema, productPromoSchema, serviceAdSchema, youTubeIntroSchema} from './schemas';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ProductPromo" component={ProductPromo} schema={productPromoSchema}
      defaultProps={productPromoSchema.parse({})} width={1080} height={1920} fps={FPS} durationInFrames={15 * FPS} />
    <Composition id="ServiceAd" component={ServiceAd} schema={serviceAdSchema}
      defaultProps={serviceAdSchema.parse({})} width={1080} height={1080} fps={FPS} durationInFrames={12 * FPS} />
    <Composition id="YouTubeIntro" component={YouTubeIntro} schema={youTubeIntroSchema}
      defaultProps={youTubeIntroSchema.parse({})} width={1920} height={1080} fps={FPS} durationInFrames={6 * FPS} />
    <Composition id="BlogToReel" component={BlogToReel} schema={blogToReelSchema}
      defaultProps={blogToReelSchema.parse({})} width={1080} height={1920} fps={FPS} durationInFrames={20 * FPS} />
  </>
);
