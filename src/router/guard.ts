import { type Router } from 'vue-router';
import { authStore } from 'stores/auth';
import { systemStore } from 'stores/system';

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const auth = authStore()
    const system = systemStore()

    if(to.name == 'login' && auth.isAuthenticated){
      return next({ name: 'home' })
    }

    if(to.name == 'verify-code-access' && system.temporaryEmail === ''){
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
