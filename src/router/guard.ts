import { type Router } from 'vue-router';
import { authStore } from 'stores/auth';

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const auth = authStore()

    if(to.name == 'login' && auth.isAuthenticated){
      return next({ name: 'home' })
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return next({ name: 'login' })
    }

    else{
      next()
    }
  })
}
