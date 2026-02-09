<template>
  <svg
    ref="svgRef"
    :class="clsx('theme-btn', status)"
    width="1em"
    height="1em"
    viewBox="0 0 60 60"
    stroke="var(--prc-yellow-8)"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    fill="none"
    @click="$emit('toggle')"
  >
    <path
      :id="moonId"
      class="theme-icon moon"
      d="M42 30 A12 12 0 0 1 37.75 30.938 A12 12 0 0 1 24.5 21.938 c0 -1.66 0.33 -3.24 0.938 -4.688 A12 12 0 0 0 18 30 A12 12 0 0 0 30 42 a12 12 0 0 0 12-12"
    />

    <defs>
      <path
        :id="sunId"
        class="theme-icon sun"
        d="M30 14v4M30 46v-4M14 30h4M46 30h-4M39.2 20.8l2.8-2.8M39.2 39.2l2.8 2.8M20.8 20.8l-2.8-2.8M20.8 39.2l-2.8 2.8M30 20a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"
      />
    </defs>
  </svg>
</template>

<script setup lang="ts">
import clsx from 'clsx';
import { gsap } from 'gsap';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
import type { Theme } from '@personal/shared';
import { watch } from 'vue';
gsap.registerPlugin(MorphSVGPlugin);

const props = defineProps<{
  status: Theme;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const sunId = 'sun',
  moonId = 'moon';

// 初始化动画
watch(
  () => props.status,
  (newVal) => {
    const targetId = newVal === 'light' ? '#' + sunId : '#' + moonId;
    gsap.to('#' + moonId, {
      morphSVG: targetId,
      duration: 0.8,
    });
  },
);
</script>

<style lang="scss" scoped>
.theme-btn {
  cursor: pointer;

  &:hover .theme-icon {
    transform: scale(1.1);
    transform-origin: center;
    transition: transform var(--ts-duration-mid) ease;
  }
}
</style>
