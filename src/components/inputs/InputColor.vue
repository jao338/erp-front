<template>
  <q-input
    :model-value="props.modelValue"
    :label="t('chooseColor')"
    :bg-color="$q.dark.isActive ? 'grey-10' : 'grey-2'"
    class="input-rounded"
    outlined
    hide-bottom-space
    lazy-rules
    @update:model-value="(val) => emits('update:modelValue', val)"
  >
    <template #append>
      <q-icon
        name="palette"
        :style="{ color: props.modelValue }"
        class="cursor-pointer"
      >
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-color
            :model-value="props.modelValue"
            format-model="hex"
            default-view="palette"
            @update:model-value="(val) => emits('update:modelValue', val)"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  modelValue: string
}>()

const emits = defineEmits(['update:modelValue']);

defineOptions({
  name: 'InputColor'
})
</script>
