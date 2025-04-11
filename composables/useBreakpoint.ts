import { useBreakpoints } from '@vueuse/core';

export function useBreakpoint() {
  const breakpoints = useBreakpoints({
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  });

  const currentBreakpoint = computed(() => {
    if (breakpoints.smaller('tablet').value) return 'Mobile';
    // if (breakpoints.between('tablet', 'desktop').value) return 'Tablet';
    return 'Desktop';
  });

  return currentBreakpoint;
}
