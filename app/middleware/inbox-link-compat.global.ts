/**
 * Map mobile-safe inbox deep links to web routes.
 * watts-mobile resolves /today and /activities/:id; web uses dashboard / workouts.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/today' || to.path === '/today/recommendation') {
    return navigateTo({ path: '/dashboard', query: to.query, hash: to.hash }, { replace: true })
  }

  const activityMatch = to.path.match(/^\/activities\/([^/]+)$/)
  if (activityMatch?.[1]) {
    return navigateTo(
      { path: `/workouts/${activityMatch[1]}`, query: to.query, hash: to.hash },
      { replace: true }
    )
  }
})
