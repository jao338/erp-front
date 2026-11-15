<template>
  <CardGeneric
    :label="useSupplierStore.uuid_supplier ? $t('edit') : $t('add')"
    :icon="useSupplierStore.uuid_supplier ? 'edit' : 'add'"
  >
    <div v-if="loadingData" class="row q-col-gutter-md q-pa-md">
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
      <InputText
        v-model="form.nome"
        data-cy="supplier-name"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        maxLength="50"
        :rules="[validateRequiredField]"
        :label="$t('name')"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'nome' }"
      />

      <InputText
        v-model="form.email"
        data-cy="supplier-email"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        :label="$t('email')"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'email' }"
      />

      <InputText
        v-model="form.telefone"
        data-cy="supplier-phone"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        :label="$t('phone')"
        :hint="$t('phoneFormatHint')"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'telefone' }"
        :mask="Mask.TelefoneMovel"
        unmasked-value
      />

      <InputSelect
        v-model="form.tipo"
        data-cy="supplier-type"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        :label="$t('type')"
        :options="optionsType"
      />

      <InputText
        v-model="form.cpf"
        data-cy="supplier-cpf"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        :label="$t('cpf')"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'cpf' }"
        :mask="Mask.Cpf"
        unmasked-value
      />

      <InputText
        v-model="form.cnpj"
        data-cy="supplier-cnpj"
        class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        :label="$t('cnpj')"
        hasRequestErrors
        :requestErrors="{ errors: errors, field: 'cnpj' }"
        :mask="Mask.Cnpj"
        unmasked-value
      />

      <q-card-actions class="col-12 justify-end q-mt-lg">
        <ButtonGeneric
          :label="$t('back')"
          :aria-label="$t('back')"
          :to="{ name: 'supplier' }"
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
import InputText from 'components/inputs/InputText.vue';
import InputSelect from 'components/inputs/InputSelect.vue';

import useValidations from 'src/composables/useValidations';
import useHelpers from 'src/composables/useHelpers';
import useSupplierService from './Util/SupplierService';

import { Mask, PersonType } from 'src/util/Enums';

import type { OptionsSelect, RequestErrors, SkeletonItem } from 'src/util/Interface';
import type { Supplier } from './Util/SupplierInterface';

import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { supplierStore } from 'stores/supplier';
import { useMeta } from 'quasar';

const { validateRequiredField }             = useValidations();
const { toggleLoading, getRequestErrors }   = useHelpers();
const { create, update, show }              = useSupplierService('suppliers');

const { t } = useI18n();

const useSupplierStore = supplierStore();

const loadingData = ref<boolean>(false);
const loadingSubmit = ref<boolean>(false);

const router = useRouter();

const errors = ref<RequestErrors>({});
const form = ref<Supplier>({
  uuid: '',
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  cnpj: '',
  tipo: PersonType.Company,
})

const skeleton: SkeletonItem[] = [
  { qtd: 4, class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3' }
];

const optionsType: OptionsSelect[] = [
  { label: t('individual'), value: PersonType.Individual },
  { label: t('company'), value: PersonType.Company }
];

async function showForm(): Promise<void> {
  toggleLoading(loadingData);
  try {
    const data = await show<Supplier>(useSupplierStore.uuid_supplier);
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
    if(!useSupplierStore.uuid_supplier){
      const data = await create<Supplier>(form.value);
      useSupplierStore.setUuidSupplier(data.data.uuid);
      await router.push({ name: 'supplier' });
    }else{
      await update(useSupplierStore.uuid_supplier, form.value);
      await router.push({ name: 'supplier' });
    }

  } catch (error: unknown) {
    errors.value = getRequestErrors(error);
  } finally {
    toggleLoading(loadingSubmit);
  }
}


useMeta(() => {
  return {
    title: (t('supplier') + ' - ') + (useSupplierStore.uuid_supplier ? t('edit') : t('add')),
  };
});

defineOptions({
  name: 'SupplierForm',
});

onMounted(async () => {
  if(useSupplierStore.uuid_supplier){
    await showForm();
  }
})
</script>
