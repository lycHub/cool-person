<template>
  <ripple-box
    class="all-project-trigger cursor-pointer"
    ripple-bg-color="var(--prc-neutral-50)"
    @mouseenter="onRippleEnter"
    @mouseleave="onRippleLeave"
  >
    <slot />
  </ripple-box>
</template>

<script setup lang="ts">
import RippleBox from '../ripple-box/index.vue';
import { useHoverMove } from '../../hooks';

const { onRippleEnter, onRippleLeave } = useHoverMove({ moveRange: [-10, 10] });
</script>

<style lang="scss" scoped>
.all-project-trigger {
  border-radius: 100vw;
  border: var(--border-size-2) solid var(--prc-neutral-900);
  text-align: center;
  padding-block: var(--spacing-14);

  &:hover {
    border-color: var(--prc-neutral-50);
  }
}
</style>
