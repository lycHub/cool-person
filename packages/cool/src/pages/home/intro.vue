<template>
  <section class="sec sec-intro" ref="secIntroRef">
    <div class="intro-text">
      {{ state.intro }}
    </div>

    <div class="intro-btm cursor-pointer">
      <a class="intro-link">
        <Icon class="ico" icon="zs:arrow-right" />
        my showreel
      </a>

      <div class="intro-leave-wrap" @mousemove="onRippleMove" @mouseleave="onRippleLeave" @mousecancel="onRippleLeave">
        <ripple-box class="intro-ripple-box" ripple-bg-color="var(--prc-primary-700)">
          <a class="ripple-content">
            <Icon class="ico" icon="zs:arrow-right" />
            my showreel
          </a>
        </ripple-box>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import RippleBox from '../../components/ripple-box/index.vue';
import { onUnmounted, useTemplateRef, watch } from 'vue';
import type { TypeWithNull } from '@personal/shared';
import { useApiDataStore } from '../../store';
gsap.registerPlugin(SplitText);

const { scroller } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
}>();

const { state } = useApiDataStore();

const secRef = useTemplateRef('secIntroRef');

const onRippleMove = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  const targetEl = event.currentTarget as HTMLDivElement;
  const innerCircleEl = targetEl.querySelector('.intro-ripple-box') as HTMLDivElement;
  const rippleContent = targetEl.querySelector('.ripple-content') as HTMLAnchorElement;
  if (!rippleContent) return;

  const { left, top, width, height } = targetEl.getBoundingClientRect();
  const { width: innerCircleWidth } = innerCircleEl.getBoundingClientRect();
  const diffRadius = width - innerCircleWidth;
  const xCoor = clientX - left - width / 2;
  const yCoor = clientY - top - height / 2;
  const originDistance = Math.sqrt(xCoor ** 2 + yCoor ** 2);

  const radians = Math.atan2(yCoor, xCoor);

  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  const moveX = cos * originDistance;
  const moveY = sin * originDistance;

  const transformer = gsap.utils.pipe(
    gsap.utils.clamp(-diffRadius, diffRadius),
    gsap.utils.mapRange(-diffRadius, diffRadius, -20, 20),
    gsap.utils.snap(1),
  );

  const x = transformer(moveX);
  const y = transformer(moveY);
  // console.log({ moveX, moveY, x, y });
  gsap.set(innerCircleEl, {
    x,
    y,
  });

  const contentTransformer = gsap.utils.pipe(
    gsap.utils.clamp(-diffRadius, diffRadius),
    gsap.utils.mapRange(-diffRadius, diffRadius, -6, 6),
    gsap.utils.snap(1),
  );

  const contentX = contentTransformer(moveX);
  const contentY = contentTransformer(moveY);

  gsap.set(rippleContent, {
    x: contentX,
    y: contentY,
  });
};

const onRippleLeave = (event: MouseEvent) => {
  const targetEl = event.currentTarget as HTMLDivElement;
  const innerCircleEl = targetEl.querySelector('.intro-ripple-box') as HTMLDivElement;
  const rippleContent = targetEl.querySelector('.ripple-content') as HTMLAnchorElement;
  if (!rippleContent) return;
  const config = {
    x: 0,
    y: 0,
    duration: 0.3,
  };
  gsap.to(innerCircleEl, {
    ...config,
    onComplete: () => {
      gsap.killTweensOf(innerCircleEl);
    },
  });
  gsap.to(rippleContent, {
    ...config,
    onComplete: () => {
      gsap.killTweensOf(rippleContent);
    },
  });
};

let ctx: TypeWithNull<gsap.Context> = null;

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
};

const introTextAni = () => {
  if (!secRef.value || !scroller) return;
  clear();
  ctx = gsap.context(() => {
    const split = SplitText.create('.intro-text', {
      type: 'chars',
      charsClass: 'char++',
    });

    // return;
    gsap.from(split.chars, {
      id: 'introText',
      '-webkit-text-stroke-color': 'var(--prc-neutral-900)',
      '-webkit-text-fill-color': 'transparent',
      autoAlpha: 0.2,
      stagger: 0.02,
      scrollTrigger: {
        id: 'introTextScroll',
        fastScrollEnd: true,
        toggleActions: 'play complete reverse reset',
        trigger: '.intro-text',
        scroller,
        start: 'top bottom-=96',
        end: 'bottom bottom-=100',
        scrub: 1,
      },
    });
    return () => {
      split.revert();
    };
  }, secRef.value);
};

watch(
  () => scroller,
  () => {
    introTextAni();
  },
);

onUnmounted(() => {
  clear();
});
</script>

<style scoped lang="scss">
.sec-intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-40);
  padding: 100px var(--spacing-20);

  .intro-text {
    font-size: var(--text-size-32);
    color: transparent;
    -webkit-text-stroke: 1px var(--prc-orange-6);
    -webkit-text-fill-color: var(--prc-orange-6);
    font-style: italic;
  }

  .intro-btm {
    text-align: center;
    text-transform: uppercase;
    width: 100%;
    flex-shrink: 0;

    .intro-link {
      display: block;
      padding: var(--spacing-16);
      border-radius: 100vw;
      font-size: var(--text-size-18);
      background-color: var(--prc-primary-600);
      color: var(--prc-primary-50);

      .ico {
        font-size: var(--text-size-26);
        vertical-align: bottom;
      }
    }

    .intro-leave-wrap {
      display: none;
      width: 220px;
      aspect-ratio: 1;
      align-items: center;
      justify-content: center;
      font-size: var(--text-size-14);
      color: var(--prc-neutral-50);
      border-radius: 50%;

      .intro-ripple-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140px;
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: var(--prc-neutral-800);

        // &:hover {
        //   color: #fff;
        // }

        .ico {
          font-size: var(--text-size-22);
          vertical-align: bottom;
        }
      }
    }
  }
}

@media screen and (width >=1024px) {
  .sec-intro {
    flex-direction: row;

    .intro-text {
      // font-size: var(--text-size-32);
      line-height: 1.5;
    }

    .intro-btm {
      width: auto;

      .intro-link {
        display: none;
      }

      .intro-leave-wrap {
        display: flex;
      }
    }
  }
}
</style>
