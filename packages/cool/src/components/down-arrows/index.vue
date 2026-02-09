<template>
  <svg
    class="down-arrows"
    ref="arrowsRef"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    stroke="var(--prc-cyan-5)"
    fill="none"
    stroke-width="1"
  >
    <g class="arrow-g">
      <path d="M 14 10 l 6 5 l 6 -5" />
      <path d="M 14 16 l 6 5 l 6 -5" />
      <path d="M 14 22 l 6 5 l 6 -5" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';

const arrowsRef = useTemplateRef('arrowsRef');
let tween: gsap.core.Tween;

onMounted(() => {
  if (arrowsRef.value) {
    const selector = gsap.utils.selector(arrowsRef.value);

    tween = gsap.to(selector('.arrow-g'), {
      duration: 1,
      y: '+=4',
      repeat: -1,
      ease: 'linear',
      yoyo: true,
    });
  }
});

onUnmounted(() => {
  tween?.kill();
});
</script>

<style lang="scss" scoped>
.down-arrows {
  border-radius: 50%;
  border: var(--border-size-2) solid var(--prc-cyan-5);
}
</style>
