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

import { onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue';
import type { Observer } from 'gsap/Observer';
gsap.registerPlugin(ScrollTrigger);

const homeRef = useTemplateRef<HTMLDivElement>('homeRef');
let homeScrollObserver: Observer;
let direction = shallowRef(1);
onMounted(() => {
  if (!homeRef.value) return;

  homeScrollObserver = ScrollTrigger.observe({
    target: homeRef.value,
    // type: 'wheel,touch,pointer', scroll
    onUp: () => {
      direction.value = -1;
    },
    onDown: () => {
      direction.value = 1;
    },
  });
});

onUnmounted(() => {
  homeScrollObserver?.kill();
});
</script>
