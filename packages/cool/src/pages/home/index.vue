<template>
  <div class="page-root home" ref="homeRef">
    <profile />
    <works :direction="direction" />
    <intro :scroller="homeRef" />
    <hobby :scroller="homeRef" />
    <projects :scroller="homeRef" />
    <gallery :scroller="homeRef" :direction="direction" />
    <friends />
    <contact />
    <Footer />
    <icon class="to-top-icon" icon="zs:to-top" @click="toTop" />
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Intro from './intro.vue';
import Works from './works.vue';
import Profile from './profile.vue';
import Hobby from './hobby.vue';
import Projects from './projects.vue';
import Gallery from './gallery/index.vue';
import Friends from './friends/index.vue';
import Contact from './contact/index.vue';
import Footer from '../../components/layout/footer.vue';
import { Icon } from '@iconify/vue';

import { onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';
import type { Observer } from 'gsap/Observer';
import { DebounceTime } from '@personal/shared';
import { useScroll } from '@vueuse/core';
gsap.registerPlugin(ScrollTrigger);

const homeRef = useTemplateRef<HTMLDivElement>('homeRef');
let homeScrollObserver: Observer;
let direction = shallowRef(1);
onMounted(() => {
  if (!homeRef.value) return;

  homeScrollObserver = ScrollTrigger.observe({
    target: homeRef.value,
    lockAxis: true,
    // type: 'wheel,touch,pointer', scroll
    onUp: () => {
      direction.value = -1;
    },
    onDown: () => {
      direction.value = 1;
    }
  });
});

const ShowToTopScrollY = 600;
let toTopIsShow  =false
const toTopShowDuration = DebounceTime.middle / 1000
const { y } = useScroll(homeRef, { behavior: 'smooth', throttle: DebounceTime.middle });
watch(y, (newY) => {
  const selector = gsap.utils.selector(homeRef.value);
  if (newY > ShowToTopScrollY) {
    if (!toTopIsShow) {
      toTopIsShow = true;
      gsap.to(selector('.to-top-icon'), {
        autoAlpha: 1,
        duration: toTopShowDuration,
      });
    }
  } else {
     if (toTopIsShow) {
      toTopIsShow = false;
      gsap.to(selector('.to-top-icon'), {
      autoAlpha: 0,
      duration: toTopShowDuration,
    });
    }
  }
});

const toTop = () => {
  y.value = 0;
};

onUnmounted(() => {
  homeScrollObserver?.kill();
});
</script>


<style lang="scss" scoped>
.to-top-icon {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  bottom: var(--spacing-28);
  right: var(--spacing-28);
  font-size: var(--text-size-48);
  cursor: pointer;
  color: var(--prc-cyan-8);
  transition-property: transform;
  transition-duration: var(--ts-duration-mid);

  &:hover {
    transform: scale(1.1);
  }
}
</style>
