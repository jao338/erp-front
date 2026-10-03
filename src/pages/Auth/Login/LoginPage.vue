<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center column bg-grey-3">
        <q-card class="card-login q-pa-sm">
          <q-card-section class="text-center q-ma-lg">
            <LogoLogin />
          </q-card-section>

          <q-card-section class="q-pa-none">
            <p
              class="q-ma-none text-h5 text-weight-bold text-center"
              style="color: #076bb3"
            >
              {{ t('login') }}
            </p>
          </q-card-section>

          <q-card-section>
            <q-form ref="formRef" @submit.prevent="login" class="q-gutter-lg">
              <InputText
                v-model="form.email"
                data-cy="text-email"
                has-request-errors
                :label="$t('email')"
                :rules="[validateRequiredField, validateEmail]"
                :request-errors="{ errors: errors, field: 'email'} "
              />

              <InputPassword
                data-cy="text-password"
                v-model="form.password"
                :label="$t('senha')"
                :rules="[validateRequiredField]"
              />

              <q-card-actions class="q-pa-none">
                <ButtonGeneric
                  type="submit"
                  color="primary"
                  icon="login"
                  data-cy="btn-login"
                  :loading="loadingLogin"
                  :label="$t('login')"
                  class="full-width button-rounded"
                />
                <ButtonGeneric
                  color="primary"
                  icon="login"
                  data-cy="btn-register"
                  :label="$t('register')"
                  outline
                  class="full-width button-rounded outline q-mt-md"
                  @click="router.push({ name: 'register' })"
                />
              </q-card-actions>

              <q-card-actions class="flex justify-center q-pa-none">
                <RouterLink class="no-decoration text-primary text-caption" :to="{ name: 'first-access' }">{{ t('primeiroAcesso') }}</RouterLink>
<!--                <RouterLink :to="{ name: 'forgot-pass' }">{{ t('primeiroAcesso') }}</RouterLink>-->
              </q-card-actions>

            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { type LoginBody } from 'pages/Auth/Util/AuthInterface';
import { type RequestErrors } from 'src/util/Interface';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useLoginService from 'pages/Auth/Util/AuthService';

import InputText from 'components/inputs/InputText.vue';
import InputPassword from 'components/inputs/InputPassword.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import LogoLogin from 'components/utils/LogoLogin.vue';

const { validateRequiredField, validateEmail } = useValidations();
const { toggleLoading } = useHelpers();
const { fetchLogin } = useLoginService('/login');
const { t } = useI18n();

const router       = useRouter();
const errors       = ref<RequestErrors>({});
const loadingLogin = ref<boolean>(false);
const formRef      = ref<HTMLFormElement | null>(null);
const form         = ref<LoginBody>({
  email: '',
  password: '',
});

async function login(): Promise<void> {
  toggleLoading(loadingLogin);
  try {
    await fetchLogin(form.value, t('loginFeitoSucesso'));
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  } finally {
    toggleLoading(loadingLogin);
  }
}

useMeta(() => {
  return {
    title: t('login'),
    meta: {
      description: {
        name: 'description',
        content: t('login'),
      },
    },
  };
});

defineOptions({
  name: 'LoginPage',
});
</script>
