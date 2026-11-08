<template>
  <CardGeneric :label="$t('purchase', 2)">
      <q-form
        ref="formRef"
        @submit.prevent="searchData()"
        class="row q-pa-md q-col-gutter-md"
      >
        <q-card-section class="row col-12 justify-start q-col-gutter-md">
          <InputMoney
            v-model="form.total"
            :label="t('total')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputDate
            v-model="form.criado_em"
            :label="t('createdAt')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputDate
            v-model="form.atualizado_em"
            :label="t('updatedAt')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputRadio
            v-model="form.ativo"
            :options="optionsRadio"
          />

        </q-card-section>
        <q-card-actions class="col-12 justify-end q-mt-lg q-pa-none">
          <ButtonGeneric
            :loading="loadingSubmit"
            data-cy="btn-filtrar"
            :label="$t('filter')"
            type="submit"
            color="primary"
            icon="search"
            class="button-rounded"
            :size="formatSizes('button')"
          />
        </q-card-actions>
      </q-form>
      <DefaultTable
        class="q-ma-md"
        v-model:pagination="pagination"
        :rows="rows"
        :columns="columns"
        :loading="loadingData"
        @request="searchData"
      >
        <template v-slot:body-cell-actions="scope">
          <q-td :props="scope" class="q-gutter-sm">
            <ButtonGeneric
              v-if="scope.row.ativo"
              :data-cy="`btn-remove-${scope.rowIndex}`"
              @click="remove(scope.row.uuid)"
              color="negative"
              icon="delete"
              class="button-rounded"
              flat
              dense
              no-caps
            />
          </q-td>
        </template>
      </DefaultTable>
    </CardGeneric>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { saleStore } from 'stores/sales';

import CardGeneric from 'components/cards/CardGeneric.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import DefaultTable from 'components/tables/DefaultTable.vue';
import InputMoney from '../../components/inputs/InputMoney.vue';
import InputDate from '../../components/inputs/InputDate.vue';
import InputRadio from '../../components/inputs/InputRadio.vue';

import useDialog from 'src/composables/useDialog';
import useHelpers from 'src/composables/useHelpers';
import useSaleService from './Util/SaleService';
import useFormat from 'src/composables/useFormat';

import type { QTableColumn } from 'quasar';
import type { Sale, SaleFilter } from './Util/SaleInterface';
import type { Pagination, RadioOptions, RequestErrors } from 'src/util/Interface';

const { t } = useI18n();

const {
  toggleLoading,
  setPagination,
  getPagination,
} = useHelpers();
const { formatDate, formatSizes } = useFormat();
const { confirmDelete } = useDialog();
const { index, destroy } = useSaleService('sale');

const useSaleStore = saleStore();

const loadingSubmit = ref<boolean>(false);
const loadingData = ref<boolean>(false);
const formRef = ref<HTMLFormElement | null>(null);
const errors = ref<RequestErrors>({});
const rows = ref<Sale[]>([]);
const pagination = ref<Pagination>(getPagination({ sortBy: 'id' }));
const form = ref<SaleFilter>({
  total: '',
  criado_em: '',
  atualizado_em: '',
  ativo: '1',
  lucro: '',
});

const optionsRadio = ref<RadioOptions[]>([
  { label: t('active'), val: '1', color: 'blue' },
  { label: t('inactive'), val: '0', color: 'red' },
]);

const columns: QTableColumn[] = [
  {
    name: 'ativo',
    field: 'ativo',
    label: t('active'),
    sortable: false,
    align: 'left',
    format: val => val ? t('active') : t('inactive')
  },
  {
    name: 'lucro',
    field: 'lucro',
    label: t('profit'),
    sortable: false,
    align: 'left',
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: t('customer'),
    sortable: false,
    align: 'left',
  },
  {
    name: 'criado_em',
    field: 'criado_em',
    label: t('createdAt'),
    sortable: false,
    align: 'left',
    format: val => formatDate(val)
  },

  {
    name: 'atualizado_em',
    field: 'atualizado_em',
    label: t('updatedAt'),
    sortable: false,
    align: 'left',
    format: val => formatDate(val)
  },
  {
    name: 'actions',
    field: 'actions',
    label: t('actions'),
    align: 'center',
  },
];

async function searchData(props: { pagination?: Pagination } = {}): Promise<void> {
  setPagination(
    pagination.value,
    props.pagination?.page ?? 1,
    props.pagination?.rowsPerPage ?? 20,
    props.pagination?.rowsNumber ?? 0,
    props.pagination?.sortBy ?? 'id',
    props.pagination?.descending ?? false,
  );
  await fetchData();
}

async function fetchData(): Promise<void> {
  try {
    toggleLoading(loadingData);

    const data = await index<Sale>({
      ...form.value,
      page: pagination.value.page,
      por_pagina: pagination.value.rowsPerPage,
      tipo_ordenacao: pagination.value.descending ? 'DESC' : 'ASC',
      campo_ordenacao: pagination.value.sortBy,
    });

    rows.value = data.data;

    setPagination(
      pagination.value,
      data.meta.current_page,
      data.meta.per_page,
      data.meta.total,
    );
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  }
  finally {
    toggleLoading(loadingData);
  }
}

function remove(uuid_sale: string): void {
  confirmDelete().onOk(() => {
    void (async () => {
      toggleLoading(loadingData);
      try {
        await destroy(uuid_sale);
      } finally {
        await fetchData();
        toggleLoading(loadingData);
      }
    })();
  });
}

defineOptions({
  name: 'SalePage',
});

onMounted(async () => {
  useSaleStore.resetUuidSale();
  await searchData();
});

</script>
