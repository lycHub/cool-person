<template>
  <footer class="sec sec-footer">
    <contact-icons />
  </footer>
</template>

<script setup lang="ts">
import ContactIcons from '../../components/contact-icons/index.vue';
</script>

<style scoped lang="scss">
.sec-footer {
  font-size: var(--text-size-20);
  padding: var(--spacing-8) var(--spacing-20);
  text-align: right;
}
</style>
