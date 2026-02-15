<template>
  <icon class="to-top-icon" icon="zs:to-top" @click="toTop" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { DebounceTime } from '@personal/shared';
import {  watch, type MaybeRefOrGetter } from 'vue';
import { useScroll } from '@vueuse/core';
import {Icon} from '@iconify/vue';

const {scroller} = defineProps<{
  scroller: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const ShowToTopScrollY = 600;
let toTopIsShow  =false
const toTopShowDuration = DebounceTime.middle / 1000
const { y } = useScroll(scroller, { behavior: 'smooth', throttle: DebounceTime.middle });

watch(y, (newY) => {
  if (newY > ShowToTopScrollY) {
    if (!toTopIsShow) {
      toTopIsShow = true;
      gsap.to('.to-top-icon', {
        autoAlpha: 1,
        duration: toTopShowDuration,
      });
    }
  } else {
     if (toTopIsShow) {
      toTopIsShow = false;
      gsap.to('.to-top-icon', {
        autoAlpha: 0,
        duration: toTopShowDuration,
      });
    }
  }
});

const toTop = () => {
  y.value = 0;
};

</script>

<style lang="scss" scoped>
.to-top-icon {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  inset-block-end: var(--spacing-48);
  inset-inline-end: var(--spacing-16);
  font-size: var(--text-size-48);
  cursor: pointer;
  color: var(--prc-cyan-8);
  transition-property: transform;
  transition-duration: var(--ts-duration-mid);

  &:hover {
    transform: scale(1.1);
  }
}

@media screen and (width >=768px) {
  .to-top-icon {
    inset-inline-end: var(--spacing-40);
  }
}
</style>
