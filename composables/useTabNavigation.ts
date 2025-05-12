import { useRoute, useRouter } from 'vue-router';
import { computed, type ComputedRef } from 'vue';
import { debounce } from 'lodash-es';

interface TabConfig {
  getTargetRoute: (tab: number) => string;
  getTabFromRoute: (routePath: string) => number;
  defaultRoute?: string;
}

export function useTabNavigation(config: TabConfig) {
  const route = useRoute();
  const router = useRouter();

  if (config.defaultRoute && route.path === config.defaultRoute) router.replace(config.getTargetRoute(1));

  const activeTab = computed({
    get() {
      return config.getTabFromRoute(route.path);
    },
    set: debounce(async (newTab: number) => {
      const targetRoute = config.getTargetRoute(newTab);
      if (route.path !== targetRoute)
        try {
          await router.push(targetRoute);
        } catch (err) {
          console.error('Navigation error:', err);
        }
    }, 100),
  });

  const pageKey: ComputedRef<string> = computed(() => route.path);

  return {
    activeTab,
    pageKey,
  };
}
