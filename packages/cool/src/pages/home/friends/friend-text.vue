<template>
  <div class="friend-desc" ref="rootRef">
    <div class="fd-text first-text">波克布林</div>
    <div class="fd-text second-text">海拉鲁美邻</div>
    <div class="fd-text third-text">伊盖队</div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { type TypeWithNull, emptyFunc } from '@personal/shared';
import { isClient, useIntersectionObserver } from '@vueuse/core';
gsap.registerPlugin(SplitText);

const rootRef = useTemplateRef('rootRef');

let ctx: TypeWithNull<gsap.Context> = null;

const { stop } = isClient
  ? useIntersectionObserver(
      rootRef,
      ([entry]) => {
        console.log({
          intersectionRatio: entry?.intersectionRatio,
        });
        const intersectionRatio = entry?.intersectionRatio || 0;
        if (intersectionRatio >= 0.8) {
          startAni();
        }
      },
      {
        threshold: [0.8],
      },
    )
  : {
      stop: emptyFunc,
    };

const clear = () => {
  ctx?.revert();
  ctx = null;
  stop();
};

onUnmounted(() => {
  clear();
});
let aniStatus: 'ready' | 'over' = 'ready';
const tl = gsap.timeline({
  id: 'friendDesc',
  duration: 0.5,
  paused: true,
});

const startAni = () => {
  if (aniStatus === 'ready') {
    tl.play();
    aniStatus = 'over';
  }
};

onMounted(() => {
  if (!rootRef.value) return;
  ctx = gsap.context(() => {
    const splitFirst = SplitText.create('.first-text', {
      type: 'chars',
      charsClass: 'first-char++',
    });

    const splitThird = SplitText.create('.third-text', {
      type: 'chars',
      charsClass: 'third-char++',
    });

    tl.from([splitFirst.chars, splitThird.chars], {
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });

    tl.from(
      '.second-text',
      {
        duration: 0.6,
        transformOrigin: 'center',
        scaleX: 0,
        rotateZ: 0,
        ease: 'back.out(2)',
      },
      '>',
    );
  }, rootRef.value);
});
</script>

<style scoped lang="scss">
.friend-desc {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;

  // max-width: 800px;
  // text-align: center;

  .fd-text {
    // display: inline-block;
    color: var(--prc-beige-3);
    font-size: min(8vw, 90px);
    font-weight: 700;
  }

  .fd-text:nth-child(2) {
    position: relative;
    z-index: 1;
    transform: rotateZ(-3deg);
    color: var(--prc-neutral-900);
    background-color: var(--prc-orange-6);
    overflow: hidden;
    margin-block: -2vw -1vw;
  }
}
</style>
