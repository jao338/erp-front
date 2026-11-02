import { defineStore } from 'pinia';
import { ref } from 'vue';

export const supplierStore = defineStore(
  'suppliers',
  () => {
    const uuid_supplier = ref<string>('');
    function setUuidSupplier(element: string): void {
      uuid_supplier.value = element;
    }
    function resetUuidSupplier(): void {
      uuid_supplier.value = '';
    }

    return {
      uuid_supplier,
      setUuidSupplier,
      resetUuidSupplier,
    };
  },
  {
    persist: true,
  },
);
