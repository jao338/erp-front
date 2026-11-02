<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center">
      <TitleH4 :title="$t('supplier')" :caption="$t('supplierCaption')" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"/>
      <div class="row col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div class="full-width flex-end">
          <Breadcrumb v-if="!isMobile"/>
        </div>
      </div>
      <div v-if="isIndex" class="col-12 flex-end">
        <ButtonGeneric
          class="text-capitalize"
          color="primary"
          icon="add"
          :label="$t('adicionar')"
          :aria-label="$t('adicionar')"
          :to="{ name: 'supplier-add' }"
          data-cy="btn-add"
          :size="formatSizes('button')"
        />
      </div>

    </div>
    <div class="q-my-lg">
      <router-view />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TitleH4 from 'components/titles/TitleH4.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import Breadcrumb from 'components/utils/Breadcrumb.vue';
import useFormat from 'src/composables/useFormat';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const { formatSizes } = useFormat();
const { t } = useI18n()

const $q = useQuasar();
const router = useRouter();

const isIndex = computed(() => router.currentRoute.value.name === 'supplier')
const isMobile = computed<boolean>(() => $q.platform.is.mobile)

useMeta(() => {
  return {
    title: t('supplier'),
  };
});

defineOptions({
  name: 'SupplierLayout',
});

</script>
