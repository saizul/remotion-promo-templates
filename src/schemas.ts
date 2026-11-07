import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {theme} from './theme';

const colors = {
  primaryColor: zColor().default(theme.colors.primary),
  accentColor: zColor().default(theme.colors.accent),
  backgroundColor: zColor().default(theme.colors.background),
  textColor: zColor().default(theme.colors.text),
};

export const productPromoSchema = z.object({
  headline: z.string().default('Meet the all-new Aero Bottle'),
  productImageUrl: z.string().default(''),
  price: z.string().default('$29'),
  oldPrice: z.string().default('$49'),
  cta: z.string().default('Shop now'),
  brand: z.string().default('YOURBRAND'),
  ...colors,
});

export const serviceAdSchema = z.object({
  logoText: z.string().default('YourBrand'),
  headline: z.string().default('Websites that convert'),
  benefits: z.array(z.string()).length(3).default(['Fast, SEO-ready builds', 'Fixed price, no surprises', 'Support after launch']),
  cta: z.string().default('Book a free call'),
  ...colors,
});

export const youTubeIntroSchema = z.object({
  title: z.string().default('Motion design with code'),
  subtitle: z.string().default('New video every week'),
  ...colors,
});

export const blogToReelSchema = z.object({
  title: z.string().default('5 tips for faster websites'),
  points: z
    .array(z.string())
    .min(3)
    .max(5)
    .default(['Compress your images', 'Lazy-load below the fold', 'Cache aggressively', 'Ship less JavaScript']),
  cta: z.string().default('Read the full post'),
  source: z.string().default('yourblog.com'),
  ...colors,
});

export type ProductPromoProps = z.infer<typeof productPromoSchema>;
export type ServiceAdProps = z.infer<typeof serviceAdSchema>;
export type YouTubeIntroProps = z.infer<typeof youTubeIntroSchema>;
export type BlogToReelProps = z.infer<typeof blogToReelSchema>;
