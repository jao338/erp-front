<template>
  <div>
    <q-uploader
      ref="upload"
      class="full-width"
      :auto-upload="false"
      :accept="accept"
      :multiple="multiple"
      hide-upload-btn
      max-total-size="10485760"
      @added="(val) => emits('addFile', val)"
      @removed="(val) => emits('removedFile', val)"
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <div class="col">
            <div class="q-uploader__title">{{ label }}</div>
            <div class="q-uploader__subtitle row justify-between">
              <p>{{ scope.uploadSizeLabel }}</p>
              <p>{{ $t('maxSize10mb') }}</p>
            </div>
          </div>
          <q-btn v-if="scope.canAddFiles" icon="add_box" @click="scope.pickFiles" round dense flat>
            <q-uploader-add-trigger />
          </q-btn>
        </div>
      </template>
    </q-uploader>
  </div>
</template>

<script setup lang="ts">
import { type InputUpload } from 'src/util/Interface';
import { ref } from 'vue';

withDefaults(defineProps<InputUpload>(), {
  label: '',
  accept: '*',
  multiple: false,
})

const upload = ref<any>(null)

function addFiles(files: []): void {
  upload.value.addFiles(files)
}

function clearAllFiles(): void {
  upload.value.reset()
}

const emits = defineEmits(['addFile', 'removedFile'])

defineExpose({ addFiles, clearAllFiles })
</script>
