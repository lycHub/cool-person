<script setup lang="ts">
import ErrorBoundary from './components/error-boundary.vue';
</script>

<template>
  <error-boundary>
    <router-view />
  </error-boundary>
</template>
