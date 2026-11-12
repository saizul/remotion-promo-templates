import type {z} from 'zod';
import {
  blogToReelSchema,
  productPromoSchema,
  serviceAdSchema,
  testimonialCardSchema,
  youTubeIntroSchema,
} from './schemas';

export const FPS = 30;

export type CompositionMeta = {
  schema: z.ZodObject<z.ZodRawShape>;
  width: number;
  height: number;
  seconds: number;
  /** Example input in props/, used by docs, npm scripts and tests. */
  example: string;
};

/**
 * Single source of truth for every template: Root.tsx registers these with Remotion,
 * and scripts/validate-props.ts checks JSON input against the same schemas before a
 * render starts. Keep this file free of React and font imports so it loads in plain Node.
 */
export const compositions = {
  ProductPromo: {schema: productPromoSchema, width: 1080, height: 1920, seconds: 15, example: 'props/product-promo.json'},
  ServiceAd: {schema: serviceAdSchema, width: 1080, height: 1080, seconds: 12, example: 'props/service-ad.json'},
  YouTubeIntro: {schema: youTubeIntroSchema, width: 1920, height: 1080, seconds: 6, example: 'props/youtube-intro.json'},
  BlogToReel: {schema: blogToReelSchema, width: 1080, height: 1920, seconds: 20, example: 'props/blog-to-reel.json'},
  TestimonialCard: {schema: testimonialCardSchema, width: 1080, height: 1350, seconds: 10, example: 'props/testimonial-card.json'},
} satisfies Record<string, CompositionMeta>;

export type CompositionId = keyof typeof compositions;

export const compositionIds = Object.keys(compositions) as CompositionId[];

export const isCompositionId = (id: string): id is CompositionId =>
  Object.prototype.hasOwnProperty.call(compositions, id);

export const durationInFrames = (id: CompositionId) => compositions[id].seconds * FPS;
