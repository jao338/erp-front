<template>
  <CardGeneric :label="$t('product')">
      <q-form
        ref="formRef"
        @submit.prevent="searchData()"
        class="row q-pa-md q-col-gutter-md"
      >
        <q-card-section class="row col-12 justify-start q-col-gutter-md">
          <InputText
            v-model="form.nome"
            :label="t('name')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputText
            v-model="form.quantidade"
            :label="t('quantity')"
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
              :data-cy="`btn-edit-${scope.rowIndex}`"
              @click="edit(scope.row.uuid)"
              color="primary"
              icon="edit"
              class="button-rounded"
              flat
              dense
              no-caps
            />
            <ButtonGeneric
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
import { useRouter } from 'vue-router';
import { productStore } from 'stores/product';

import CardGeneric from 'components/cards/CardGeneric.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import DefaultTable from 'components/tables/DefaultTable.vue';
import InputText from 'components/inputs/InputText.vue';
import InputDate from '../../components/inputs/InputDate.vue';

import useDialog from 'src/composables/useDialog';
import useHelpers from 'src/composables/useHelpers';
import useProductService from './Util/ProductService';
import useFormat from 'src/composables/useFormat';

import { type QTableColumn } from 'quasar';
import type { Product, ProductFilter } from './Util/ProductInterface';
import { type Pagination, type RequestErrors } from 'src/util/Interface';

const { t } = useI18n();

const {
  toggleLoading,
  setPagination,
  getPagination,
} = useHelpers();
const { formatDate, formatSizes } = useFormat();
const { confirmDelete } = useDialog();
const { index, destroy } = useProductService('products');

const useProductStore = productStore();

const loadingSubmit = ref<boolean>(false);
const loadingData = ref<boolean>(false);
const formRef = ref<HTMLFormElement | null>(null);
const errors = ref<RequestErrors>({});
const rows = ref<Product[]>([]);
const pagination = ref<Pagination>(getPagination({ sortBy: 'id' }));
const form = ref<ProductFilter>({
  uuid: '',
  nome: '',
  quantidade: '',
  criado_em: '',
  atualizado_em: '',
});

const router = useRouter();

const columns: QTableColumn[] = [
  {
    name: 'nome',
    field: 'nome',
    label: t('name'),
    sortable: false,
    align: 'left',
  },
  {
    name: 'custo_medio',
    field: 'custo_medio',
    label: t('averageCost'),
    sortable: false,
    align: 'left',
    format: val => 'R$ ' + val
  },
  {
    name: 'preco_venda',
    field: 'preco_venda',
    label: t('salePrice'),
    sortable: false,
    align: 'left',
    format: val => 'R$ ' + val
  },
  {
    name: 'quantidade',
    field: 'quantidade',
    label: t('quantity'),
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

    const data = await index<Product>({
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

async function edit(uuid_product: string): Promise<void> {
  useProductStore.setUuidProduct(uuid_product);
  await router.push({
    name: 'product-edit',
    params: { uuid_product: useProductStore.uuid_product },
  });
}

function remove(uuid_product: string): void {
  confirmDelete().onOk(() => {
    void (async () => {
      toggleLoading(loadingData);
      try {
        await destroy(uuid_product);
      } finally {
        await fetchData()
        toggleLoading(loadingData);
      }
    })();
  });
}

defineOptions({
  name: 'ProductPage',
});

onMounted(async () => {
  useProductStore.resetUuidProduct();
  await searchData();
});

</script>
