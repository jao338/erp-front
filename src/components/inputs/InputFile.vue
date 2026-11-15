<template>
  <q-file
    class="input-rounded"
    :model-value="modelValue"
    @update:model-value="(val) => emits('update:modelValue', val)"
    :bg-color="$q.dark.isActive ? 'grey-10' : 'grey-2'"
    :readonly="readonly"
    :accept="accept"
    max-total-size="10485760"
    :hint="$t('maxSize10mb')"
    outlined
    hide-bottom-space
    lazy-rules
  >
    <template v-slot:prepend>
      <q-icon name="cloud" />
    </template>
    <template v-if="modelValue && clearable && !readonly" v-slot:append>
      <q-icon
        class="cursor-pointer"
        name="close"
        @click.stop.prevent="emits('update:modelValue', null)"
      />
    </template>
  </q-file>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

defineProps({
  modelValue: {
    type: [Object, Array, FileList] as PropType<File | File[] | FileList | null>,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
  },
});

const emits = defineEmits(['update:modelValue']);

defineOptions({
  name: 'InputFile',
});
</script>
