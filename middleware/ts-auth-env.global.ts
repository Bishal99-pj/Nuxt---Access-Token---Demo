export default defineNuxtRouteMiddleware(async (to, from) => {
  const { dev } = useDevStore();

  if (!dev) return await navigateTo("/");
});
