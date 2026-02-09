<template>
  <svg
    width="50"
    height="50"
    viewBox="0 0 100 100"
    class="logo"
    @mouseenter="onRippleEnter"
    @mouseleave="onRippleLeave"
  >
    <path
      d="M50,20 L70,50 L30,50 Z M30,50 L50,80 L10,80 Z M70,50 L90,80 L50,80 Z"
      fill="none"
      stroke="var(--prc-cyan-8)"
      stroke-width="4"
    />
  </svg>
</template>

<script setup lang="ts">
import { useHoverMove } from '../../hooks';

const { onRippleEnter, onRippleLeave } = useHoverMove({
  moveRange: [-4, 4],
});
</script>

<style lang="scss" scoped>
.logo {
  --logo-filter: drop-shadow(0 0 5px var(--prc-cyan-8)) drop-shadow(0 0 10px var(--prc-cyan-8))
    drop-shadow(0 0 15px var(--prc-cyan-8));

  filter: var(--logo-filter);
  animation: neon-pulse 1s ease-in-out infinite alternate;
}

@keyframes neon-pulse {
  from {
    filter: var(--logo-filter);
    stroke: var(--prc-cyan-8);
  }

  to {
    filter: drop-shadow(0 0 10px var(--prc-cyan-8)) drop-shadow(0 0 20px var(--prc-cyan-8))
      drop-shadow(0 0 30px var(--prc-cyan-8));
    stroke: var(--prc-white);
  }
}
</style>
