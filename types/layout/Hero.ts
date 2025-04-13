import type { CTA } from './AppBar';

export interface Hero {
  role: string;
  subtitle?: string;
  CTA: CTA;
  CTA_secondary: CTA;
  image: string;
}
