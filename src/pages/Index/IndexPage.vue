<template>
  <q-page class="q-pa-lg">
    <div class="row justify-start items-center">
      <TitleH4
        class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12"
        :title="t('homePage')"
        :caption="t('homePageCaption')"
      />
      <CardGeneric class="row items-center justify-center q-mt-md col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <TitleH6 :title="t('homePage')" :caption="t('homeInfo')" align="center" />
      </CardGeneric>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TitleH4 from 'src/components/titles/TitleH4.vue';
import TitleH6 from 'src/components/titles/TitleH6.vue';
import CardGeneric from 'src/components/cards/CardGeneric.vue';

import useHotkeys from 'src/composables/useHotkeys';
import useNotify from 'src/composables/useNotify';

import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';

const { successMessage } = useNotify();

const { t } = useI18n();

useMeta(() => {
  return {
    title: t('homePage'),
  };
});

useHotkeys({
  keys: ['a', 'b', 'c', 'd', 'e', 'f'],
  callback: () => {
    successMessage(t('companyName'))
  },
});

</script>
