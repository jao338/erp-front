<template>
  <q-layout>
    <q-page-container>
      <q-page class="row justify-center items-center bg-grey-3 q-pa-md">
        <q-card class="col-12 col-md-6 q-pa-md">
          <q-card-section class="text-center">
            <LogoLogin />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <p class="q-ma-none text-h5 text-weight-bold text-center text-primary">
              {{ t('registre') }}
            </p>
          </q-card-section>

          <q-card-section>
            <q-form ref="formRef" class="row q-pa-none q-col-gutter-md flex-center" @submit.prevent="register">
              <InputText
                v-model="form.email"
                data-cy="text-email"
                has-request-errors
                :label="$t('email')"
                :rules="[validateRequiredField, validateEmail]"
                :request-errors="{ errors, field: 'email' }"
                class="col-12 col-md-6"
              />

              <InputText
                v-model="form.name"
                data-cy="text-name"
                has-request-errors
                :label="$t('nome')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors, field: 'name' }"
                class="col-12 col-md-6"
              />

              <InputPassword
                v-model="form.password"
                data-cy="text-password"
                has-request-errors
                :label="$t('senha')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors, field: 'password' }"
                class="col-12 col-md-6"
              />

              <InputPassword
                v-model="form.confirm_password"
                data-cy="text-confirm_password"
                :label="$t('confirmeSuaSenha')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors, field: 'confirm_password' }"
                class="col-12 col-md-6"
              />

              <div class="col-12 column q-gutter-sm">
                <ButtonGeneric
                  type="submit"
                  color="primary"
                  data-cy="btn-register"
                  :loading="loadingRegister"
                  :label="$t('registrar')"
                  class="button-rounded full-width"
                />

                <ButtonGeneric
                  color="primary"
                  data-cy="btn-back"
                  :label="$t('voltar')"
                  outline
                  class="button-rounded full-width"
                  @click="redirectBack"
                />
              </div>
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

import { type RegisterBody } from '../Util/AuthInterface';
import { type RequestErrors } from 'src/util/Interface';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useAuthService from '../Util/AuthService';

import InputText from 'components/inputs/InputText.vue';
import InputPassword from 'components/inputs/InputPassword.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import LogoLogin from 'components/utils/LogoLogin.vue';

const { validateRequiredField, validateEmail } = useValidations();
const { toggleLoading }                        = useHelpers();
const { requestRegister }                      = useAuthService('/register');

const { t } = useI18n();

const router       = useRouter();

const errors          = ref<RequestErrors>({});
const loadingRegister = ref<boolean>(false);
const formRef         = ref<HTMLFormElement | null>(null);
const form            = ref<RegisterBody>({
  email: '',
  name: '',
  password: '',
  confirm_password: '',
});

function redirectBack(): void {
  router.go(-1)
}

async function register(): Promise<void> {
  toggleLoading(loadingRegister);
  try {
    await requestRegister(form.value);

    setTimeout(() => {
      void router.push({ name: 'login' });
    }, 2000);

  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  }finally {
    toggleLoading(loadingRegister);
  }
}

useMeta(() => {
  return {
    title: t('registre'),
    meta: {
      description: {
        name: 'description',
        content: t('registre'),
      },
    },
  };
});

defineOptions({
  name: 'RegisterPage',
});
</script>
