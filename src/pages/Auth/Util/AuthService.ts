import useApi from 'src/composables/useApi';
import useNotify from 'src/composables/useNotify';

import { api } from 'boot/axios';
import { authStore } from 'stores/auth';
import { useRouter } from 'vue-router';

import type { LoginForm, RegisterForm } from 'pages/Auth/Util/AuthInterface';
import { type User } from 'src/util/Interface';

export default function AuthService(url: string) {
  const { create }         = useApi(url);
  const { successMessage } = useNotify();

  const router = useRouter();
  const auth   = authStore();

  async function fetchLogin(form: LoginForm, message: string): Promise<void> {
    await csrfCookie();

    const { data } = await create<User>(form, false);

    successMessage(message);

    auth.setUserData(data);

    await router.push({ name: 'home' });
  }
  async function fetchRegister(form: RegisterForm, message: string): Promise<void> {
    await csrfCookie();

    await create<User>(form, false);

    successMessage(message);

    await router.push({ name: 'login' });
  }

  async function fetchLogout(message: string): Promise<void> {
    try {
      await create(url,false);
      successMessage(message);
    } finally {
      auth.setUserData(null);
      await router.push({ name: 'home' });
    }
  }

  async function csrfCookie(): Promise<void> {
    await api.get('http://localhost/sanctum/csrf-cookie');
  }

  return {
    fetchLogin,
    fetchLogout,
    fetchRegister
  };
}
