<template>
  <q-uploader
    class="full-width"
    :auto-upload="false"
    :hide-upload-btn="true"
    max-total-size="10485760"
    @added="(val) => emits('addFile', val)"
    @removed="(val) => emits('removedFile', val)"
  >
    <template v-slot:header="scope">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <div class="col">
          <div class="q-uploader__title">{{ computedLabel }}</div>
          <div class="q-uploader__subtitle row justify-between">
            <p>{{ scope.uploadSizeLabel }}</p>
            <p>{{ $t('maxSize10mb') }}</p>
          </div>
        </div>
        <q-btn
          v-if="scope.canAddFiles"
          type="a"
          icon="add_box"
          @click="scope.pickFiles"
          round
          dense
          flat
        >
          <q-uploader-add-trigger />
        </q-btn>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n()

const emits = defineEmits(['addFile', 'removedFile'])

const computedLabel = computed(() => props.label || t('selectFiles'))

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})
</script>
