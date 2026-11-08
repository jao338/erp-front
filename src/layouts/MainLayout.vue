<template>
  <q-layout
    view="hHh lpR lff"
    :class="{ 'q-dark': $q.dark.isActive, 'bg-grey-2': !$q.dark.isActive }"
  >
    <SkeletonHeader />

    <SkeletonMenu />

    <q-page-container>
      <router-view :key="route.path" />
    </q-page-container>

    <SkeletonFooter />
  </q-layout>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import SkeletonHeader from 'src/components/skeletons/SkeletonHeader.vue';
import SkeletonFooter from 'src/components/skeletons/SkeletonFooter.vue';
import SkeletonMenu from 'src/components/skeletons/SkeletonMenu.vue';

const { t } = useI18n();

const route = useRoute();

useMeta(() => {
  return {
    title: t('companyName'),
  }
})
</script>

