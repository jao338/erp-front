import axios, { type AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';
import { authStore } from 'src/stores/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_URL as string,
  withCredentials: true,
  withXSRFToken: true,
});

export default boot(({ app }) => {
  const useAuthStore = authStore();

  api.interceptors.response.use(
    (response) => response,
    async (request) => {

      if (request.response && [500, 504].includes(request.response.status)) {
        Notify.create({
          type: 'negative',
          message: 'Houve um erro. Tente novamente.',
          progress: true,
        });
      }

      if (
        request?.response &&
        typeof request?.response.data?.message === 'string' &&
        !request?.response.data?.errors
      ) {
        Notify.create({
          type: 'negative',
          message: request?.response.data.message,
        });
      }

      if (request.response && [401, 419].includes(request.response.status)) {
        useAuthStore.setUserData(null);
        window.location.href = '/login';
      }

      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      return Promise.reject(request);
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
