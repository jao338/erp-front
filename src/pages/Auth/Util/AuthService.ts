import useApi from 'src/composables/useApi';
import useNotify from 'src/composables/useNotify';

import { api } from 'boot/axios';
import { authStore } from 'stores/auth';

import type { FirstAccessBody, LoginBody, RegisterBody, VerifyCodeAccessBody } from 'pages/Auth/Util/AuthInterface';
import type { MessageFeedbackResponse, UserResponse } from 'src/util/Interface';

export default function useAuthService(url: string) {
  const { create }         = useApi(url);
  const { successMessage } = useNotify();

  const auth   = authStore();

  async function requestLogin(body: LoginBody, message: string): Promise<void> {
    await csrfCookie();

    const { data } = await create<UserResponse>(body, false);

    successMessage(message);

    auth.setUserData(data);
  }

  async function requestVerifyFirstAccessCode(body: VerifyCodeAccessBody): Promise<void> {
    await csrfCookie();

    const { data } = await create<MessageFeedbackResponse>(body, false);

    successMessage(data.message);
  }

  async function requestFirstAccess(body: FirstAccessBody): Promise<void> {
    await csrfCookie();

    const { data } = await create<MessageFeedbackResponse>(body, false);

    successMessage(data.message);
  }

  async function requestRegister(body: RegisterBody): Promise<void> {
    await csrfCookie();

    const { data } = await create<MessageFeedbackResponse>(body, false);

    successMessage(data.message);
  }

  async function requestLogout(message: string): Promise<void> {
    try {
      await create(url,false);
      successMessage(message);
    } finally {
      auth.setUserData(null);
    }
  }

  async function csrfCookie(): Promise<void> {
    await api.get('http://localhost/sanctum/csrf-cookie');
  }

  return {
    requestLogin,
    requestLogout,
    requestRegister,
    requestFirstAccess,
    requestVerifyFirstAccessCode,
  };
}
