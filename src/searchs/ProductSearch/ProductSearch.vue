<template>
  <q-dialog v-model="modal" persistent full-width>
    <q-card class="advanced-modal">
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="text-h6">
            {{ $t('advancedSearch') }} - {{ $t('product', 2) }}
          </div>
          <ButtonGeneric icon="close" flat round dense @click="closeModal" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form
          ref="formRef"
          class="row q-col-gutter-md"
          @submit.prevent="searchData()"
          @reset="handleResetForm"
        >
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

          <q-card-actions class="col-12 justify-end">
            <ButtonGeneric
              icon="filter_alt_off"
              @click="handleResetForm"
              color="primary"
              flat
              class="button-rounded"
              :title="$t('clearFilters')"
            />
            <ButtonGeneric
              :loading="loadingData"
              :label="$t('search')"
              color="primary"
              icon="search"
              class="button-rounded"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>

      <q-separator />

      <DefaultTable
        data-cy="table-example-search"
        class="full-width q-pa-md"
        :rows="listData"
        :columns="columns"
        :loading="loadingData"
        v-model:pagination="pagination"
        @request="searchData"
        @row-click="emitValue"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { type Pagination } from 'src/util/Interface';
import type { ProductFilter, Product } from 'pages/Product/Util/ProductInterface';
import { type QTableColumn } from 'quasar';

import useHelpers from 'src/composables/useHelpers';
import ProductSearchService from './Util/ProductSearchService';

import InputText from 'src/components/inputs/InputText.vue';
import ButtonGeneric from 'src/components/buttons/ButtonGeneric.vue';
import DefaultTable from 'src/components/tables/DefaultTable.vue';
import InputDate from 'components/inputs/InputDate.vue';
import useFormat from 'src/composables/useFormat';

const { t } = useI18n();

const {
  setPagination,
  resetForm,
  resetFormAdvancedSearch,
  setOriginalForm,
  toggleLoading,
  getPagination
} = useHelpers();

const { formatDate } = useFormat();

const { index } = ProductSearchService('products');

const modal = ref<boolean>(false);
const loadingData = ref<boolean>(false);

const listData = ref<Product[]>([]);

const pagination = ref<Pagination>(getPagination({ sortBy: 'id' }));
const formRef = ref<HTMLFormElement | null>(null);
const form = ref<ProductFilter>({
  uuid: '',
  nome: '',
  quantidade: '',
  criado_em: '',
  atualizado_em: '',
});

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
];

const emits = defineEmits(['emitValue']);

async function searchData(props: { pagination?: Pagination } = {}): Promise<void> {
  setPagination(
    pagination.value,
    props.pagination?.page ?? 1,
    props.pagination?.rowsPerPage ?? 5,
    props.pagination?.rowsNumber ?? 0,
  );
  await fetchData();
}
async function fetchData(): Promise<void> {
  try {
    toggleLoading(loadingData);

    const data = await index<Product>({
      ...form.value,
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      tipo_ordenacao: pagination.value.descending ? 'DESC' : 'ASC',
      campo_ordenacao: pagination.value.sortBy,
    });

    listData.value = data.data;

    setPagination(
      pagination.value,
      data.meta.current_page,
      data.meta.per_page,
      data.meta.total,
    );
  } finally {
    toggleLoading(loadingData);
  }
}
async function handleResetForm(evt?: Event): Promise<void> {
  if(evt){
    evt.preventDefault();
    await resetForm(form, searchData);
  }
}
function emitValue(evt: Event, row: object): void {
  emits('emitValue', row);
  closeModal();
}
function openModal(): void {
  modal.value = true;
}
function closeModal(): void {
  resetFormAdvancedSearch(form);
  listData.value = [];
  modal.value = false;
}

defineExpose({ openModal });

defineOptions({
  name: 'ProductSearch',
});

onMounted(() => {
  setOriginalForm(form.value);
});
</script>
