<template>
  <q-btn
    data-cy="btn-user"
    class="bg-white text-primary"
    round
    push
    :label="user?.nome.substring(0, 2).toUpperCase() ?? ''"
  >
    <q-menu
      data-cy="menu-user"
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0, 20]"
      class="q-pa-xs"
    >
      <div class="row no-wrap q-pa-md items-start gt-sm">
        <div class="column menu-column">
          <div class="text-subtitle1 q-mb-sm">
            <InputSelect
              class="desktop-select"
              v-model="currentLang"
              :options="languages"
              :label="t('idioma')"
            />
          </div>
        </div>

        <q-separator
          vertical
          class="q-mx-lg"
          style="height: 42px; align-self:center;"
        />

        <div class="column menu-column">
          <div class="text-subtitle1 q-mb-sm">
            {{ t('configuracao', 2) }}
          </div>
          <q-toggle
            style="width: max-content"
            :model-value="darkMode"
            :label="t('modoEscuro')"
            @click="useSystemStore.toggleDarkMode"
          />
        </div>

        <q-separator
          vertical
          class="q-mx-lg"
          style="height: 42px; align-self:center;"
        />

        <div class="column menu-column">
          <div class="text-subtitle1 q-mb-md">{{ user?.nome }}</div>
          <q-btn
            data-cy="btn-logout"
            color="negative"
            :label="t('sair')"
            push
            size="sm"
            @click="logout"
          />
        </div>
      </div>

      <div class="column q-pa-sm lt-md">
        <div class="row items-center q-pb-sm">
          <div class="col">
            <div class="text-subtitle1 q-mb-xs">{{ t('idioma') }}</div>
            <InputSelect
              v-model="currentLang"
              :options="languages"
              :label="t('idioma')"
              class="full-width"
            />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <div class="row items-center q-pb-sm">
          <div class="col">
            <div class="text-subtitle1 q-mb-xs">{{ t('configuracao', 2) }}</div>
            <q-toggle
              style="width: max-content"
              :model-value="darkMode"
              :label="t('modoEscuro')"
              @click="useSystemStore.toggleDarkMode"
            />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <div class="row items-center q-pt-sm">
          <div class="col flex-end">
            <div class="text-subtitle1 q-mb-xs">{{ user?.nome }}</div>
            <q-btn
              data-cy="btn-logout"
              color="negative"
              :label="t('sair')"
              push
              size="sm"
              @click="logout"
            />
          </div>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { systemStore } from 'stores/system';
import { authStore } from 'stores/auth';
import { storeToRefs } from 'pinia';

import { type OptionsSelect, type RequestErrors } from 'src/util/Interface';
import { ref, watch } from 'vue';

import InputSelect from 'components/inputs/InputSelect.vue';

import LoginService from 'pages/Login/Util/LoginService';
import useHelpers from 'src/composables/useHelpers';
import { useI18n } from 'vue-i18n';
import { Lang } from 'src/util/Enums';

const useSystemStore = systemStore();
const useAuthStore = authStore();

const { darkMode } = storeToRefs(useSystemStore);
const { user } = storeToRefs(useAuthStore);
const { fetchLogout } = LoginService('/logout');
const { toggleLoading } = useHelpers();

const { locale, t } = useI18n();

const loadingLogin = ref<boolean>(false);
const errors = ref<RequestErrors>({});
const languages = ref<OptionsSelect[]>([
  { label: t('portugues'), value: Lang.Portuguese },
  { label: t('ingles'), value: Lang.English },
]);

const currentLang = ref<Lang>(locale.value as Lang);

async function logout(): Promise<void> {
  toggleLoading(loadingLogin);
  try {
    await fetchLogout(t('logoutFeitoComSucesso'));
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  } finally {
    toggleLoading(loadingLogin);
  }
}

watch(currentLang, (lang) => {
  useSystemStore.setLanguage(lang);
});

defineOptions({
  name: 'UserToolbar',
});
</script>

<style scoped>

.menu-column {
  min-width: 0;
}

.menu-column .text-subtitle1 {
  word-break: break-word;
}
</style>
