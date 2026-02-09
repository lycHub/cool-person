<template>
  <svg
    :class="clsx('menu-btn', status)"
    width="60px"
    height="60px"
    viewBox="0 0 60 60"
    stroke="url(#lineGradient)"
    stroke-width="3"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <defs>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="var(--prc-cyan-4)" />
        <stop offset="0.3" stop-color="var(--prc-cyan-6)" />
        <stop offset="1" stop-color="var(--prc-cyan-4)" />
      </linearGradient>
    </defs>

    <line class="line-1" x1="10" y1="15" x2="30" y2="15" transform-origin="30 15" />
    <line class="line-2" x1="15" y1="30" x2="45" y2="30" transform-origin="center" />
    <line class="line-3" x1="30" y1="45" x2="50" y2="45" transform-origin="30 45" />
  </svg>
</template>

<script setup lang="ts">
import clsx from 'clsx';
export type MenuStatus = 'active' | 'inactive';
const { status = 'inactive' } = defineProps<{
  status: MenuStatus;
}>();
</script>

<style lang="scss">
.menu-btn {
  cursor: pointer;
  transition: all var(--ts-duration-mid) ease-in-out;

  line {
    transition: inherit;
  }
}

.menu-btn:hover {
  transform: scale(1.1);
}

.menu-btn.active {
  transform: rotate(-45deg);

  .line-1 {
    transform: rotateZ(-90deg);
  }

  .line-3 {
    transform: rotateZ(-90deg);
  }
}
</style>
