<template>
  <v-otp-input
    input-classes="otp-input"
    separator=""
    :num-inputs="inputLength ?? 6"
    :value="modelValue"
    :should-auto-focus="true"
    input-type="number"
    :conditional-class="[]"
    :placeholder="[]"
    @on-change="updateValue"
    @on-complete="updateValue"
  />
</template>

<script setup lang="ts">
import VOtpInput from 'vue3-otp-input';

withDefaults(
  defineProps<{
    modelValue: string;
    inputLength?: number;
  }>(),
  {
    modelValue: '',
    inputLength: 6,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

function updateValue(value: string): void {
  emit('update:modelValue', value);
}
</script>

<style>
.otp-input {
  background-color: white;
  color: var(--q-primary);
  border: 2px solid var(--q-primary);
  border-radius: 16px;
  width: 60px;
  height: 70px;
  padding: 5px;
  margin: 0 10px;
  font-size: 25px;
  text-align: center;
  font-weight: bold;
}

.otp-input:focus {
  box-shadow: 0;
  border: 3px solid var(--q-secondary);
  outline: 0;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 600px) {
  .otp-input {
    width: 40px;
    height: 55px;
    font-size: 18px;
    margin: 0 5px;
  }

  input::placeholder {
    font-size: 12px;
  }
}
</style>
