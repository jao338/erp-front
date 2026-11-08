<template>
  <CardGeneric
    :label="useShoppingStore.uuid_shopping ? $t('edit') : $t('add')"
    :icon="useShoppingStore.uuid_shopping ? 'edit' : 'add'"
  >
    <div v-if="loadingData" class="row q-col-gutter-md ">
      <template v-for="(element, index) in skeleton" :key="index">
        <Skeleton v-for="n in element.qtd" :key="n" :class="element.class" />
      </template>
    </div>
    <q-form
      ref="formRef"
      class="row q-col-gutter-md q-pa-md"
      @submit.prevent="submitForm()"
      v-if="!loadingData"
    >
      <InputSelect
        v-model="form.fornecedor_uuid"
        class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
        :rules="[validateRequiredField]"
        :label="$t('supplier')"
        :options="optionsSuppliers"
        :loading="loadingSuppliers"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'fornecedor_uuid' }"
      />

      <InputAdvancedSearch
        class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
        v-model="produto.nome"
        :label="$t('product')"
        :clearable="true"
        modal="Produto"
        @emitValue="setValueProduto"
      />

      <q-card-section class="col-12 justify-end q-mt-lg">
        <DefaultTable
          class="q-ma-md"
          v-model:pagination="pagination"
          :rows="form.itens"
          :columns="columns"
          :loading="loadingData"
          rowKey="produto_uuid"
        >
          <template v-slot:body-cell-quantidade="scope">
            <q-td :props="scope">
              <InputText
                class="q-ma-sm"
                v-model.number="scope.row.quantidade"
                :rules="[validateRequiredField]"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-preco_unitario="scope">
            <q-td :props="scope">
              <InputMoney
                class="q-ma-sm"
                v-model.number="scope.row.preco_unitario"
                :rules="[validateRequiredField]"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-preco_venda="scope">
            <q-td :props="scope">
              <InputMoney
                class="q-ma-sm"
                v-model.number="scope.row.preco_venda"
                :rules="[validateRequiredField]"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="scope">
            <q-td :props="scope" class="q-gutter-sm">
              <ButtonGeneric
                @click="remove(scope.rowIndex)"
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
      </q-card-section>

      <q-card-actions class="col-12 justify-end q-mt-lg">
        <ButtonGeneric
          :label="$t('back')"
          :aria-label="$t('back')"
          :to="{ name: 'shopping' }"
          class="text-capitalize"
          color="primary"
          icon="arrow_back"
          data-cy="btn-back"
        />
        <ButtonGeneric
          :loading="loadingSubmit"
          :label="$t('save')"
          data-cy="btn-salvar"
          type="submit"
          color="positive"
          icon="save"
          class="button-rounded"
        />
      </q-card-actions>
    </q-form>
  </CardGeneric>
</template>

<script setup lang="ts">
import CardGeneric from 'components/cards/CardGeneric.vue';
import Skeleton from 'components/skeletons/Skeleton.vue';
import ButtonGeneric from 'components/buttons/ButtonGeneric.vue';
import InputSelect from 'components/inputs/InputSelect.vue';
import DefaultTable from 'components/tables/DefaultTable.vue';
import InputAdvancedSearch from 'components/inputs/InputAdvancedSearch.vue';
import InputText from 'components/inputs/InputText.vue';
import InputMoney from 'components/inputs/InputMoney.vue';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useLookups from 'src/composables/useLookups';
import useShoppingService from './Util/ShoppingService';


import { type QTableColumn, useMeta } from 'quasar';
import type { OptionsSelect, Pagination, RequestErrors, SkeletonItem } from 'src/util/Interface';
import type { Shopping } from './Util/ShoppingInterface';
import type { Product } from 'pages/Product/Util/ProductInterface';
import { type ShoppingItem } from './Util/ShoppingInterface';

import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { shoppingStore } from 'stores/shopping';

const { validateRequiredField } = useValidations();
const { lookupSuppliers } = useLookups();
const { toggleLoading, fetchOptions, getPagination } = useHelpers();
const { create, show } = useShoppingService('shopping');

const { t } = useI18n();

const useShoppingStore = shoppingStore();

const loadingData = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);
const loadingSuppliers = ref<boolean>(false);

const optionsSuppliers = ref<OptionsSelect[]>([]);
const pagination = ref<Pagination>(getPagination({ sortBy: 'id' }));

const router = useRouter();

const errors = ref<RequestErrors>({});
const form = ref<Shopping>({
  uuid: '',
  fornecedor_uuid: '',
  itens: [],
})

const produto = ref<Product>({
  uuid: '',
  nome: '',
  custo_medio: 0,
  preco_venda: 0,
  quantidade: 0,
})

const columns: QTableColumn[] = [
  {
    name: 'nome',
    field: 'nome',
    label: t('name'),
    sortable: true,
    align: 'center',
  },
  {
    name: 'custo_medio',
    field: 'custo_medio',
    label: t('averageCost'),
    sortable: true,
    align: 'center',
  },
  {
    name: 'preco_unitario',
    field: 'preco_unitario',
    label: t('unitPrice'),
    sortable: true,
    align: 'center',
  },
  {
    name: 'preco_venda',
    field: 'preco_venda',
    label: t('salePrice'),
    sortable: true,
    align: 'center',
  },
  {
    name: 'quantidade',
    field: 'quantidade',
    label: t('quantity'),
    sortable: true,
    align: 'center',
  },
  {
    name: 'actions',
    field: 'actions',
    label: t('actions'),
    align: 'center',
  },
];

const skeleton: SkeletonItem[] = [
  { qtd: 4, class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3' }
];

async function showForm(): Promise<void> {
  toggleLoading(loadingData);
  try {
    const data = await show<Shopping>(useShoppingStore.uuid_shopping);
    form.value = data.data;
  } catch {
    return;
  } finally {
    toggleLoading(loadingData);
  }
}

async function submitForm(): Promise<void> {
  toggleLoading(loadingSubmit);
  try {
    if(!useShoppingStore.uuid_shopping){
      const data = await create<Shopping>(form.value);
      useShoppingStore.setUuidShopping(data.data.uuid);
    }
    await router.push({ name: 'shopping' })
  } catch (error: any) {
    errors.value = error.response?.data.errors ?? {};
  } finally {
    toggleLoading(loadingSubmit);
  }
}

function setValueProduto(element: ShoppingItem): void {
  const { uuid, ...rest } = element;

  form.value.itens.push({
    ...rest,
    produto_uuid: uuid ?? '',
  });
}

function remove(index: number): void {
  form.value.itens.splice(index, 1);
}


useMeta(() => {
  return {
    title: (t('purchase') + ' - ') + (useShoppingStore.uuid_shopping ? t('edit') : t('add')),
  };
});

defineOptions({
  name: 'ShoppingForm',
});

onMounted(async () => {
  if(useShoppingStore.uuid_shopping){
    await showForm();
  }
  await Promise.all([
    fetchOptions(lookupSuppliers, optionsSuppliers, loadingSuppliers),
  ])
})
</script>
