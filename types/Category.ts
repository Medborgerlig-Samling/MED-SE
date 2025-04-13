export type CategoryValue = 'taxes' | 'defence' | 'feminism' | 'lgbtq' | 'migration';

export interface Category {
  value: CategoryValue;
  label: string;
}
