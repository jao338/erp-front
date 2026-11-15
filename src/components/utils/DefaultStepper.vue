<template>
  <q-stepper
      :modelValue="props.modelValue"
      ref="stepper"
      color="primary"
      class="q-border-radius"
      animated
      :vertical="isMobile"
      @update:model-value="(val) => emits('update:modelValue', Number(val))"
    >
    <q-step
      v-for="(step, index) in props.steppers"
      :key="index"
      :name="index"
      :title="step.title"
      :icon="step.icon"
      :disable="step.component ? step.disable : false"
    >
      <span v-if="!step.component && step.content">{{ step.content }}</span>
      <component v-else :is="step.component" @unlockNext="unlockStep(index + 1)" />
    </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="flex justify-end items-center q-gutter-sm">
          <ButtonGeneric
            :disable="!(props.modelValue > 0)"
            @click="stepper?.previous()"
            :label="t('back')"
            outline
            color="primary"
            icon="arrow_back"
            :size="formatSizes('button')"
          />
          <ButtonGeneric
            color="primary"
            @click="isLastStep ? emits('finish', true) : stepper?.next()"
            :label="isLastStep ? t('finish') : t('continue')"
            :icon="isLastStep ? 'save' : 'arrow_forward'"
            :size="formatSizes('button')"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
</template>

<script setup lang="ts">
import ButtonGeneric from 'src/components/buttons/ButtonGeneric.vue';
import useFormat from 'src/composables/useFormat';

import { type Stepper } from 'src/util/Interface';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { QStepper, useQuasar } from 'quasar';

// Para habilitar dinamicamente as proximas etapas, você deve usar componentes dinâmicos(defineAsyncComponent, de preferencia)
// Cada um deles deve emitir o evento "unlockNext"

const stepper = ref<InstanceType<typeof QStepper> | null>(null)

const $q = useQuasar();

const { t } = useI18n();

const { formatSizes } = useFormat();

const isLastStep = computed<boolean>(() => props.modelValue === props.steppers.length - 1)
const isMobile = computed<boolean>(() => $q.platform.is.mobile)

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  steppers: {
    type: Array<Stepper>,
    required: true,
    default: () => [],
  },
})

function unlockStep(nextIndex: number): void {
  emits('unlock-step', nextIndex)
}

const emits = defineEmits<{
  (e: 'unlock-step', value: number): void
  (e: 'update:modelValue', value: number): void
  (e: 'finish', value: boolean): boolean
}>()

defineOptions({
  name: 'DefaultStepper',
})

</script>
