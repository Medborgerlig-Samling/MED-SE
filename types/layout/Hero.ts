import type { CTA } from './AppBar';

export interface Hero {
  title: string;
  subtitle?: string;
  CTA?: CTA;
  CTA_secondary?: CTA;
  image?: string;
}
