export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/politiker') {
    return navigateTo('/politiker/daniel_sonesson');
  }
});
