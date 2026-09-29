<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center column bg-grey-3">
        <q-card class="card-register q-pa-sm">
          <q-card-section class="text-center q-ma-lg">
            <LogoLogin />
          </q-card-section>

          <q-card-section class="q-pa-none">
            <p
              class="q-ma-none text-h5 text-weight-bold text-center"
              style="color: #076bb3"
            >
              {{ t('registre') }}
            </p>
          </q-card-section>

          <q-card-section>
            <q-form ref="formRef" @submit.prevent="register" class="q-gutter-lg">
              <InputText
                v-model="form.email"
                data-cy="text-email"
                has-request-errors
                :label="$t('email')"
                :rules="[validateRequiredField, validateEmail]"
                :request-errors="{ errors: errors, field: 'email'} "
              />

              <InputText
                v-model="form.name"
                data-cy="text-name"
                has-request-errors
                :label="$t('nome')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors: errors, field: 'name'} "
              />

              <InputPassword
                data-cy="text-password"
                v-model="form.password"
                has-request-errors
                :label="$t('senha')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors: errors, field: 'password'} "
              />

              <InputPassword
                data-cy="text-confirm_password"
                v-model="form.confirm_password"
                :label="$t('confirmeSuaSenha')"
                :rules="[validateRequiredField]"
                :request-errors="{ errors: errors, field: 'confirm_password'} "
              />

              <q-card-actions class="q-pa-none">
                <ButtonGeneric
                  type="submit"
                  color="primary"
                  icon="register"
                  data-cy="btn-register"
                  :loading="loadingRegister"
                  :label="$t('registrar')"
                  class="full-width button-rounded"
                />
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

import { type RegisterForm } from '../Util/AuthInterface';
import { type RequestErrors } from 'src/util/Interface';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useAuthService from '../Util/AuthService';

import InputText from 'components/inputs/InputText.vue';
import InputPassword from 'components/inputs/InputPassword.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import LogoLogin from 'components/utils/LogoLogin.vue';

const { validateRequiredField, validateEmail } = useValidations();
const { toggleLoading } = useHelpers();
const { fetchRegister } = useAuthService('/register');
const { t } = useI18n();

const errors          = ref<RequestErrors>({});
const loadingRegister = ref<boolean>(false);
const formRef         = ref<HTMLFormElement | null>(null);
const form            = ref<RegisterForm>({
  email: '',
  name: '',
  password: '',
  confirm_password: '',
});

async function register(): Promise<void> {
  toggleLoading(loadingRegister);
  try {
    await fetchRegister(form.value, t('registroFeitoSucesso'));
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  } finally {
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
