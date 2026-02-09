<template>
  <div class="ripple-box" ref="rippleBoxRef" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="ripple"></div>
    <slot class="ripple-content" />
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { useTemplateRef } from 'vue';

const { rippleBgColor } = defineProps<{
  rippleBgColor: string;
}>();

const boxRef = useTemplateRef('rippleBoxRef');

const onMouseEnter = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // console.log({ x, y });
  const boxQSelector = gsap.utils.selector(boxRef.value);
  const el = boxQSelector('.ripple');
  gsap.killTweensOf(el);
  gsap.set(el, { clipPath: `circle(0 at ${x}px ${y}px)` });
  gsap.to(el, {
    duration: 0.3,
    ease: 'power2.out',
    clipPath: `circle(150% at ${x}px ${y}px)`,
  });
};

const onMouseLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const boxQSelector = gsap.utils.selector(boxRef.value);
  const el = boxQSelector('.ripple');
  gsap.killTweensOf(el);
  gsap.set(el, { clipPath: `circle(150% at ${x}px ${y}px)` });
  gsap.to(el, {
    duration: 0.3,
    ease: 'power2.out',
    clipPath: `circle(0% at ${x}px ${y}px)`,
    onComplete: () => {
      gsap.killTweensOf(el);
    },
  });
};
</script>

<style lang="scss">
.ripple-box {
  position: relative;
  overflow: hidden;

  .ripple {
    position: absolute;
    inset: 0;
    /* stylelint-disable value-keyword-case */
    background-color: v-bind(rippleBgColor);
    pointer-events: none;

    // z-index: -1;
    clip-path: circle(0% at 0 0);
  }

  .ripple-content {
    position: relative;
    z-index: 1;
  }
}
</style>
