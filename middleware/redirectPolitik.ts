export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/politik') {
    return navigateTo('/politik/sammanfattning');
  }
});
