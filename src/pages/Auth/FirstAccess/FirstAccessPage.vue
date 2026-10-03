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
            <q-form ref="formRef" @submit.prevent="firstAccess" class="q-gutter-lg">
              <InputText
                v-model="form.email"
                data-cy="text-email"
                has-request-errors
                :label="$t('email')"
                :rules="[validateRequiredField, validateEmail]"
                :request-errors="{ errors: errors, field: 'email'} "
              />

              <q-card-actions class="q-gutter-md q-pa-none">
                <ButtonGeneric
                  type="submit"
                  color="primary"
                  icon="send"
                  data-cy="btn-send"
                  :loading="loadingSend"
                  :label="$t('enviar')"
                  class="full-width button-rounded"
                />
                <ButtonGeneric
                  color="primary"
                  data-cy="btn-back"
                  :label="$t('voltar')"
                  outline
                  class="full-width button-rounded"
                  @click="redirectBack"
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
import { useRouter } from 'vue-router';

import { type FirstAccessBody } from 'pages/Auth/Util/AuthInterface';
import { type RequestErrors } from 'src/util/Interface';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useAuthService from 'pages/Auth/Util/AuthService';

import InputText from 'components/inputs/InputText.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import LogoLogin from 'components/utils/LogoLogin.vue';

const { validateRequiredField, validateEmail } = useValidations();
const { toggleLoading }                        = useHelpers();

const { fetchSendFirstAccess }                 = useAuthService('/first-access');
const { t }                                    = useI18n();

const router       = useRouter();

const errors       = ref<RequestErrors>({});
const loadingSend  = ref<boolean>(false);
const formRef      = ref<HTMLFormElement | null>(null);
const form         = ref<FirstAccessBody>({
  email: '',
});
function redirectBack(): void {
  router.go(-1)
}

async function firstAccess(): Promise<void> {
  toggleLoading(loadingSend);
  try {
    await fetchSendFirstAccess(form.value);
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  } finally {
    toggleLoading(loadingSend);

    setTimeout(() => {
      console.log('Redirecting to verify access...');
    }, 2000);
  }
}

useMeta(() => {
  return {
    title: t('primeiroAcesso'),
    meta: {
      description: {
        name: 'description',
        content: t('primeiroAcesso'),
      },
    },
  };
});

defineOptions({
  name: 'FirstAccessPage',
});
</script>
