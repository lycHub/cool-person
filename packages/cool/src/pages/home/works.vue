<template>
  <section class="sec sec-works" ref="secWorksRef">
    <div class="current-status">
      <p>Located in Jx Nanchang</p>
      <p>CURRENTLY AVAILABLE FOR FREELANCE WORLDWIDE 🌎</p>
    </div>

    <div class="stacks">
      <p class="title">My Amazing Stacks</p>
      <div class="stack-list" @mouseenter="pauseTween" @mouseleave="playTween">
        <div class="list-wrapper">
          <ripple-box
            v-for="item of stackOptions"
            :key="item.label"
            class="stack-box cursor-pointer"
            :ripple-bg-color="item.rippleColor"
          >
            <span class="ripple-content">{{ item.label }}</span>
          </ripple-box>
          <ripple-box
            v-for="item of stackOptions"
            :key="item.label"
            class="stack-box cursor-pointer"
            :ripple-bg-color="item.rippleColor"
          >
            <span class="ripple-content">{{ item.label }}</span>
          </ripple-box>
          <ripple-box
            v-for="item of stackOptions"
            :key="item.label"
            class="stack-box cursor-pointer"
            :ripple-bg-color="item.rippleColor"
          >
            <span class="ripple-content">{{ item.label }}</span>
          </ripple-box>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DebounceTime } from '@personal/shared';
import { isClient, useDebounceFn, useResizeObserver } from '@vueuse/core';
import { gsap } from 'gsap';
import { onUnmounted, useTemplateRef, watch } from 'vue';
import RippleBox from '../../components/ripple-box/index.vue';
import { getStackOptions } from '../../utils';

type Direction = 'left' | 'right';

const { direction } = defineProps<{
  direction: number;
}>();

// todo: 换数组
const boxLen = 11;
const BoxGap = 16;
const StepLen = 4;
const secRef = useTemplateRef<HTMLElement>('secWorksRef');

let currDirection: Direction = 'left';
let currentX = 0;
let moveCallback: () => void;

const stackOptions = getStackOptions();
// console.log({ stackOptions });

const moveStackBoxes = () => {
  const boxQSelector = gsap.utils.selector(secRef.value);
  const stackList = boxQSelector('.stack-list')?.[0] as HTMLElement;
  const listWrapper = stackList.querySelector('.list-wrapper') as HTMLElement;
  const stackBoxes = listWrapper.querySelectorAll<HTMLDivElement>('.stack-box');
  if (!stackBoxes[0]) {
    return;
  }
  const visibleWidth = stackList.clientWidth;
  const boxWidth = stackBoxes[0].offsetWidth;

  const totalWidth = (boxWidth + BoxGap) * boxLen;
  const isLeft = currDirection === 'left'; // 负数
  currentX = currentX || -totalWidth;
  // console.log('currentX', currDirection, currentX);
  gsap.set(listWrapper, {
    x: currentX,
  });
  const step = isLeft ? -StepLen : StepLen;
  clear();
  moveCallback = () => {
    gsap.set(listWrapper, {
      x: `+=${step}`,
      modifiers: {
        x: (x) => {
          const numberX = +x.slice(0, -2);
          let result = numberX;
          if (isLeft) {
            if (numberX <= -totalWidth * 2) {
              result = -totalWidth;
            }
          } else {
            if (numberX >= -(totalWidth - visibleWidth)) {
              result = -(totalWidth * 2 - visibleWidth);
            }
          }
          // console.log('object', result, numberX);
          currentX = result;
          return result + 'px';
        },
      },
    });
  };
  gsap.ticker.add(moveCallback);
};

const debouncedFn = useDebounceFn(() => {
  const boxQSelector = gsap.utils.selector(secRef.value);
  const stacksEls = boxQSelector('.stacks') as HTMLElement[];
  if (stacksEls[0]) {
    moveStackBoxes();
  }
}, DebounceTime.middle);

if (isClient) {
  useResizeObserver(secRef, debouncedFn);
}

const clear = () => {
  gsap.ticker.remove(moveCallback);
};
onUnmounted(() => {
  clear();
});

const changeDirection = (event: 'left' | 'right') => {
  if (currDirection !== event) {
    currDirection = event;
    moveStackBoxes();
  }
};

watch(
  () => direction,
  (newVal) => {
    changeDirection(newVal === 1 ? 'left' : 'right');
  },
);

const pauseTween = () => {
  gsap.ticker.remove(moveCallback);
};

const playTween = () => {
  moveStackBoxes();
};
</script>

<style scoped lang="scss">
.sec-works {
  --skew-angle: 5deg;
  --background: linear-gradient(45deg, var(--prc-cyan-8), var(--prc-purple-8), var(--prc-red-8));

  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-36);
  padding: 100px var(--spacing-20);

  &::after {
    content: '';
    background: var(--background);
    position: absolute;
    z-index: -1;
    inset: 0;
    transform: skewY(var(--skew-angle));
  }

  .current-status {
    max-width: 400px;
    flex-shrink: 0;
    font-size: var(--text-size-30);

    p:first-child {
      margin-block-end: var(--spacing-16);
    }
  }

  .stacks {
    flex-grow: 1;
    overflow: hidden;
    max-width: 450px;

    .title {
      color: var(--prc-neutral-700);
      margin-block-end: var(--spacing-16);
    }

    .stack-list {
      white-space: nowrap;

      .list-wrapper {
        width: max-content;
        display: flex;
        column-gap: var(--spacing-16);
        font-family: var(--special-font-family);
        font-size: var(--text-size-30);

        .stack-box {
          width: 120px;
          aspect-ratio: 1;
          flex-shrink: 0;
          border: var(--border-size-1) solid var(--prc-neutral-600);
          text-align: center;
          line-height: 120px;
          padding-inline: var(--spacing-4);
        }
      }
    }
  }
}
</style>
