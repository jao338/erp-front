import useApi from 'src/composables/useApi';

import { api } from 'boot/axios';
import { authStore } from 'stores/auth';
import { useRouter } from 'vue-router';

import { type AuthForm } from 'pages/Login/Util/LoginInterface';
import { type User } from 'src/util/Interface';
import useNotify from 'src/composables/useNotify';

export default function LoginService(url: string) {
  const { index, create, update, destroy } = useApi(url);
  const { successMessage } = useNotify()
  const router = useRouter();
  const auth = authStore();

  async function fetchLogin(form: AuthForm, message: string): Promise<void> {
    await csrfCookie();

    const { data } = await create<User>(form, false);

    successMessage(message);

    auth.setUserData(data);

    await router.push({ name: 'home' });
  }

  async function fetchLogout(): Promise<void> {
    try {
      await create(url);
    } finally {
      auth.setUserData(null);
      window.location.href = '/login';
    }
  }

  async function csrfCookie(): Promise<void> {
    await api.get('http://localhost/sanctum/csrf-cookie');
  }

  return {
    fetchLogin,
    fetchLogout,
    create,
    index,
    update,
    destroy,
  };
}
