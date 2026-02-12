<template>
  <div class="page-root projects" ref="pageRef">
    pageRef
    <spring-mobile class="mobile-svg" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import SpringMobile from '../../components/spring-mobile.vue';
import { useHead } from '@unhead/vue';

const pageRef = useTemplateRef<HTMLDivElement>('pageRef');

useHead({
  title: '我的项目',
});

onMounted(() => {
  if (!pageRef.value) return;
});
</script>

<style lang="scss" scoped>
.projects {
  user-select: none;

  .mobile-svg {
    border: 1px solid #666;
    font-size: 400px;

    // inset-inline-start: 0;
  }
}
</style>
