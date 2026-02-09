<template>
  <section class="sec sec-intro" ref="secIntroRef">
    <div class="intro-text">
      我是海拉鲁大地的守护者。平时总被人叫作“勇者”，其实我只是个热爱探索的普通少年，喜欢攀爬峭壁、收集各种稀奇古怪的材料。我的背包里总是装满弓箭、盾牌和从怪物营地“借”来的武器——没办法，它们总是不太友好。
      作为海拉鲁的旅行者，我经历过两次重大的冒险：一次是从百年沉睡中醒来，拯救了被灾厄盖侬侵蚀的世界；另一次是在探索地下时突然被传送到浮空岛，追寻着神秘的手臂和古老的传说。我不太爱说话——人们总说我是沉默的勇者，但我更习惯用行动表达：用希卡之石解谜，用大师剑斩除邪恶，用滑翔帆掠过湖泊与山谷。
      每当夕阳将海拉鲁城堡染成金色，我总会想起公主的嘱托。我不是天生的英雄，只是愿意为了保护重要的事物而握紧剑柄。如果你在海拉鲁遇见一个戴着绿色帽子、奔跑时会被石头绊倒的青年，那大概就是我了——一个仍在学习如何拯救世界，却总被烹饪和捉虫子分心的勇者。要一起爬山吗？我带了很多精力药水。
    </div>

    <div class="intro-btm cursor-pointer">
      <a class="intro-link">
        <Icon class="ico" icon="zs:arrow-right" />
        my showreel
      </a>

      <div
        class="intro-leave-wrap"
        @mousemove="onRippleMove"
        @mouseleave="onRippleLeave"
        @mousecancel="onRippleLeave"
      >
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
gsap.registerPlugin(SplitText);

const { scroller } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
}>();

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

@media screen and (width >= 1024px) {
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
