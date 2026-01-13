export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const user = authStore.user as { role: string } | null

  // 1. Vérifier si l'utilisateur est connecté
  if (!authStore.isAuthenticated) {
    return navigateTo('/log/sign')
  }

  // 2. Vérifier les rôles
  const requiredRole = to.meta.role

  if (requiredRole && user?.role !== requiredRole) {
    // Si l'utilisateur n'a pas le bon rôle, on le renvoie à l'accueil
    return navigateTo('/')
  }
})