<template>
  <div class="page-root gallery" ref="pageRef">
      todo
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';


// const pageRef = useTemplateRef<HTMLDivElement>('pageRef');

useHead({
  title: '图片库',
});

</script>

<style lang="scss" scoped>
.gallery {
  user-select: auto;
}
</style>
