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
              <q-form
                ref="formRef"
                class="q-gutter-lg"
                @submit.prevent="verifyCode"
              >
                <p class="text-center">
                  {{ t('digiteOCodigoPorEmail') }}
                </p>

                <InputOtp
                  v-model="form.code"
                  :input-length="5"
                />

                <div
                  v-if="validationMessages.length"
                  class="text-negative text-center"
                  role="alert"
                >
                  <div
                    v-for="(message, index) in validationMessages"
                    :key="index"
                  >
                    {{ message }}
                  </div>
                </div>

                <q-card-actions class="q-gutter-md q-pa-none">
                  <ButtonGeneric
                    type="submit"
                    color="primary"
                    data-cy="btn-verify-code"
                    :loading="loadingSend"
                    :label="t('enviar')"
                    class="full-width button-rounded"
                  />

                  <ButtonGeneric
                    color="primary"
                    outline
                    data-cy="btn-back"
                    :label="t('voltar')"
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
import { ref, computed } from 'vue';
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { systemStore } from 'stores/system';

import { type VerifyCodeAccessBody } from 'pages/Auth/Util/AuthInterface';
import { type RequestErrors } from 'src/util/Interface';
import { storeToRefs } from 'pinia';

import useHelpers from 'src/composables/useHelpers';
import useAuthService from 'pages/Auth/Util/AuthService';

import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import InputOtp from 'components/inputs/InputOtp.vue';
import LogoLogin from 'components/utils/LogoLogin.vue';

const { toggleLoading, getRequestErrors }      = useHelpers();

const { requestVerifyFirstAccessCode }         = useAuthService('/verify-code-access');
const { t }                                    = useI18n();


const store        = systemStore();
const router       = useRouter();

const { temporaryEmail } = storeToRefs(store);

const errors             = ref<RequestErrors>({});
const loadingSend        = ref<boolean>(false);
const formRef            = ref<HTMLFormElement | null>(null);
const form               = ref<VerifyCodeAccessBody>({
  code: '',
  email: temporaryEmail.value
});

const validationMessages = computed(() =>
  Object.values(errors.value).flat()
);

function redirectBack(): void {
  router.go(-1)
}

async function verifyCode(): Promise<void> {
  errors.value = {}
  toggleLoading(loadingSend);
  try {
    await requestVerifyFirstAccessCode(form.value);

    setTimeout(() => {
      void router.push({ name: 'login' });
    }, 2000)

  } catch (error: unknown) {
    errors.value = getRequestErrors(error);
  } finally {
    toggleLoading(loadingSend);
  }
}

useMeta(() => {
  return {
    title: t('verificarCodigoAcesso'),
    meta: {
      description: {
        name: 'description',
        content: t('verificarCodigoAcesso'),
      },
    },
  };
});

defineOptions({
  name: 'VerifyCodeAccessPage',
});
</script>
