<template>
  <q-drawer
    v-model="menuOpen"
    show-if-above
    :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-black text-white'"
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    :breakpoint="500"
  >
    <q-scroll-area class="fit relative-position" dark>
      <q-item-label header class="text-grey-5">{{ $t('menu', 2) }}</q-item-label>
      <q-list v-if="linksList.length">
        <RecursiveMenuItem
          v-for="link in linksList"
          :key="link.title"
          :item="link"
        />
      </q-list>

      <q-inner-loading :showing="loadingMenu" dark />
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import RecursiveMenuItem from 'components/utils/RecursiveMenuItem.vue';

import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { systemStore } from 'stores/system';
import { type MenuItem } from 'src/util/Interface';
import { useI18n } from 'vue-i18n';

const store = systemStore();

const { t } = useI18n();
const { menuOpen } = storeToRefs(store);

const linksList = computed<MenuItem[]>(() => [
  {
    title: t('product', 2),
    icon: 'inventory_2',
    link: '/products',
  },
  {
    title: t('supplier', 2),
    icon: 'local_shipping',
    link: '/suppliers',
  },
  {
    title: t('purchase', 2) + '/' + t('sale', 2),
    icon: 'shopping_cart',
    subLinks: [
      {
        title: t('purchase', 2),
        icon: 'shopping_cart_checkout',
        link: '/shoppings',
      },
      {
        title: t('sale', 2),
        icon: 'point_of_sale',
        link: '/sales',
      },
    ],
    defaultOpen: false,
  },
]);

const miniState = ref<boolean>(true);
const loadingMenu = ref<boolean>(false);
</script>
