<template>
  <slot v-if="error" name="error" :error="error" :clearError="clearError">
    <div class="def-error-ui">
      <p>⚠️ {{ (error as Error).message }}</p>
      <button type="button" title="Try again" @click="clearError">Try again</button>
    </div>
  </slot>
  <slot v-else :key="key" />
</template>

<script setup lang="ts">
import { uniqueId } from 'es-toolkit/compat';
import { onErrorCaptured, shallowRef } from 'vue';

const error = shallowRef<Error>();
const key = shallowRef<string>('');

onErrorCaptured((err): boolean => {
  error.value = err;
  return false;
});

const clearError = () => {
  key.value = uniqueId('error_');
  error.value = undefined;
};
</script>
