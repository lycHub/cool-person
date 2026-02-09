<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RouterLink, type RouterLinkProps } from 'vue-router';

defineOptions({
  inheritAttrs: false,
});

const { external = false, ...rest } = defineProps<RouterLinkProps & { external?: boolean }>();

const attrs = useAttrs();

const externalFlags = ['mailto:', 'tel:', '//'];

const path = computed(() => {
  return typeof rest.to === 'string' ? rest.to : rest.to?.path || '';
});

const isExternalLink = computed(() => {
  return external || externalFlags.some((flag) => path.value.includes(flag));
});
</script>

<template>
  <a v-if="isExternalLink" v-bind="attrs" :href="path">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="{
      ...rest,
      ...attrs,
    }"
  >
    <slot />
  </router-link>
</template>
