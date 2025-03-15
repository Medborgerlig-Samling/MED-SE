export interface MenuItem {
  title: string;
  to?: string;
  menu?: { title: string; to: string }[];
}

export interface CTA {
  title: string;
  to: string;
}
