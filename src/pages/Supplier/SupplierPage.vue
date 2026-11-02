<template>
  <CardGeneric :label="$t('supplier')">
      <q-form
        ref="formRef"
        @submit.prevent="searchData()"
        class="row q-pa-md q-col-gutter-md"
      >
        <q-card-section class="row col-12 justify-start q-col-gutter-md">
          <InputText
            v-model="form.nome"
            :label="t('nome')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputText
            v-model="form.email"
            :label="t('email')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputText
            v-model="form.telefone"
            :label="t('telefone')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputText
            v-model="form.cnpj"
            :label="t('cnpj')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

          <InputText
            v-model="form.cpf"
            :label="t('cpf')"
            class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          />

        </q-card-section>
        <q-card-actions class="col-12 justify-end q-mt-lg q-pa-none">
          <ButtonGeneric
            :loading="loadingSubmit"
            data-cy="btn-filtrar"
            :label="$t('filtrar')"
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
import { supplierStore } from 'stores/supplier';

import CardGeneric from 'components/cards/CardGeneric.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import DefaultTable from 'components/tables/DefaultTable.vue';
import InputText from 'components/inputs/InputText.vue';

import useDialog from 'src/composables/useDialog';
import useHelpers from 'src/composables/useHelpers';
import useSupplierService from './Util/SupplierService';
import useFormat from 'src/composables/useFormat';

import { type QTableColumn } from 'quasar';
import type { Supplier, SupplierFilter } from './Util/SupplierInterface';
import { type Pagination, type RequestErrors } from 'src/util/Interface';

const { t } = useI18n();

const {
  toggleLoading,
  setPagination,
  getPagination,
} = useHelpers();
const { formatDate, formatSizes, formatPhone, formatCPF, formatCNPJ } = useFormat();
const { confirmDelete } = useDialog();
const { index, destroy } = useSupplierService('suppliers');

const useSupplierStore = supplierStore();

const loadingSubmit = ref<boolean>(false);
const loadingData = ref<boolean>(false);
const formRef = ref<HTMLFormElement | null>(null);
const errors = ref<RequestErrors>({});
const rows = ref<Supplier[]>([]);
const pagination = ref<Pagination>(getPagination({ sortBy: 'id' }));
const form = ref<SupplierFilter>({
  nome: '',
  email: '',
  cnpj: '',
  cpf: '',
  telefone: '',
});

const router = useRouter();

const columns: QTableColumn[] = [
  {
    name: 'nome',
    field: 'nome',
    label: t('nome'),
    sortable: false,
    align: 'left',
  },
  {
    name: 'cpf',
    field: 'cpf',
    label: t('cpf'),
    sortable: false,
    align: 'left',
    format: val => formatCPF(val)
  },
  {
    name: 'cnpj',
    field: 'cnpj',
    label: t('cnpj'),
    sortable: false,
    align: 'left',
    format: val => formatCNPJ(val)
  },
  {
    name: 'email',
    field: 'email',
    label: t('email'),
    sortable: false,
    align: 'left',
  },
  {
    name: 'telefone',
    field: 'telefone',
    label: t('telefone'),
    sortable: false,
    align: 'left',
    format: val => formatPhone(val)
  },
  {
    name: 'tipo',
    field: 'tipo',
    label: t('tipo'),
    sortable: false,
    align: 'left',
    format: val => t(val === 1 ? t('individual') : 'company')
  },
  {
    name: 'criado_em',
    field: 'criado_em',
    label: t('criadoEm'),
    sortable: false,
    align: 'left',
    format: val => formatDate(val)
  },
  {
    name: 'atualizado_em',
    field: 'atualizado_em',
    label: t('atualizadoEm'),
    sortable: false,
    align: 'left',
    format: val => formatDate(val)
  },
  {
    name: 'actions',
    field: 'actions',
    label: t('acoes'),
    align: 'center',
  },
];

async function searchData(props: any = {}): Promise<void> {
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

    const data = await index<Supplier>({
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

async function edit(uuid_supplier: string): Promise<void> {
  useSupplierStore.setUuidSupplier(uuid_supplier);
  await router.push({
    name: 'supplier-edit',
    params: { uuid_supplier: useSupplierStore.uuid_supplier },
  });
}

function remove(uuid_supplier: string): void {
  confirmDelete().onOk(() => {
    void (async () => {
      toggleLoading(loadingData);
      try {
        await destroy(uuid_supplier);
      } finally {
        await fetchData()
        toggleLoading(loadingData);
      }
    })();
  });
}

defineOptions({
  name: 'SupplierPage',
});

onMounted(async () => {
  useSupplierStore.resetUuidSupplier();
  await searchData();
});

</script>
