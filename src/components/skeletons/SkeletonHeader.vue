<template>
  <q-header reveal class="q-pa-sm">
    <q-toolbar>
      <q-btn
        flat
        round
        icon="menu"
        data-cy="btn-toggleMenu"
        @click="useSystemStore.toggleMenu"
      />

      <q-toolbar-title class="row justify-center items-center q-gutter-sm">
        <router-link
          :to="{ name: 'home' }"
          class="text-overline text-bold text-white"
          style="font-size: 20px; text-decoration: none"
        >
          {{ t('companyName') }}
        </router-link>
      </q-toolbar-title>

      <UserToolbar />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import UserToolbar from 'components/utils/UserToolbar.vue';
import { systemStore } from 'stores/system';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
  name: 'SkeletonHeader',
});

const useSystemStore = systemStore();

</script>
