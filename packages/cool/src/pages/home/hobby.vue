<template>
  <section class="sec sec-hobby h-full" ref="secHobbyRef">
    <!-- 边界 -->
    <div class="content-wrap w-full h-full" v-element-size="onResize">
      <div class="title">My Daily Hobby</div>
      <img class="hobby-item" v-for="item of (state.hobbies || [])" :data-name="item.name" :data-angle="item.angle"
        :src="`${publicAssetsPrefix()}/hobbies/${item.name}.svg`" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import Inertia from 'gsap/InertiaPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import { onUnmounted, useTemplateRef, watch } from 'vue';
import {
  DebounceTime,
  findFirstIntersectionPointWithDecimal,
  numberSort,
  type TypeWithNull,
} from '@personal/shared';
import { publicAssetsPrefix } from '../../utils';
import { vElementSize } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';
import { useApiDataStore } from '../../store';

type HobbyNode = HTMLImageElement & { callback?: () => void };

gsap.registerPlugin(Inertia, Draggable);

const { scroller } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
}>();

const { state } = useApiDataStore();

const secRef = useTemplateRef('secHobbyRef');

let ctx: TypeWithNull<gsap.Context> = null;

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
};

let draggableInstance: Draggable[] = [];

const velocityMultiplier = 0.5;
// 摩擦力
const friction = 0.98;
// 重力
const gravity = 0.8;
// 停止阈值
const stopThreshold = 0.5;
// 反弹系数
const bounceFactor = 0.6;
const epsilon = 0.0001;

const clearCallback = (target: HobbyNode) => {
  if (target?.callback) {
    gsap.ticker.remove(target.callback);
    target.callback = undefined;
  }
};

const moveHobby = ({
  target,
  vx,
  vy,
  maxX,
  maxY,
  minX,
  minY,
}: {
  target: HobbyNode;
  vx: number;
  vy: number;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}) => {
  clearCallback(target);
  target.callback = () => {
    const currentY = gsap.getProperty(target, 'y') as number;
    vx *= friction;
    vy += gravity;
    const speed = Math.sqrt(vx ** 2 + vy ** 2);
    if (speed < stopThreshold + epsilon && vy > 0 && currentY >= maxY - 2) {
      clearCallback(target);
      gsap.set(target, { y: maxY });
      target.dataset.status = 'bottomOut'; // 已触底
      return;
    }
    // console.log('run>>>')

    gsap.set(target, {
      x: `+=${vx}`,
      y: `+=${vy}`,
      modifiers: {
        x: (x) => {
          const numberX = parseFloat(x);
          let result = numberX;
          if (numberX >= maxX) {
            vx *= -bounceFactor;
            result = maxX;
          } else if (numberX <= minX) {
            vx *= -bounceFactor;
            result = minX;
          }
          return result + 'px';
        },
        y: (y) => {
          const numberY = parseFloat(y);
          let result = numberY;
          if (numberY >= maxY) {
            vy *= -bounceFactor;
            result = maxY;
          } else if (numberY <= minY) {
            vy *= -bounceFactor;
            result = minY;
          }
          return result + 'px';
        },
      },
    });
  };
  gsap.ticker.add(target.callback);
};

const initDrag = (hobbies: HTMLImageElement[]) => {
  if (!draggableInstance.length) {
    draggableInstance = Draggable.create(hobbies, {
      id: 'hobbyDraggable',
      bounds: '.content-wrap',
      // edgeResistance: 1,
      // inertia: true,
      onDragStart() {
        gsap.killTweensOf(this.target);
        this.target.dataset.status = 'dragging';
        this.target.dataset.dragged = 'true';
      },
      onDragEnd() {
        const { minX, maxX, minY, maxY, deltaX, deltaY, target } = this;
        let vx = deltaX * velocityMultiplier;
        let vy = deltaY * velocityMultiplier;
        // console.log({ minX, maxX, minY, maxY, })
        moveHobby({ target, vx, vy, maxX, maxY, minX, minY });
      },
    });
  }
};

const refreshAni = ({ width, height }: { width: number; height: number }) => {
  if (!scroller || !secRef.value) return;
  let query = gsap.utils.selector(secRef.value);
  const titleEl = query('.title')[0];
  const hobbies = gsap.utils.toArray<HTMLImageElement>('.hobby-item');
  if (!titleEl || !hobbies?.length) return;
  const { width: titleWidth, height: titleHeight } = titleEl.getBoundingClientRect();
  clear();
  initDrag(hobbies);
  ctx = gsap.context(() => {
    hobbies.forEach((item) => {
      item.dataset.status = 'initial';
      const angle = +item.dataset.angle!;
      const { width: hobbyWidth } = item.getBoundingClientRect();
      const minPoint = findFirstIntersectionPointWithDecimal({
        deg: angle,
        width: titleWidth + hobbyWidth * 1.5,
        height: titleHeight + hobbyWidth * 1.5,
      })!;

      const maxPoint = findFirstIntersectionPointWithDecimal({
        deg: angle,
        width: width - hobbyWidth,
        height: height - hobbyWidth,
      })!;

      const x =
        minPoint.x === maxPoint.x
          ? minPoint.x
          : gsap.utils.random(
            ...(numberSort({ values: [minPoint.x, maxPoint.x] }) as [number, number]),
          );
      const y =
        minPoint.y === maxPoint.y
          ? minPoint.y
          : gsap.utils.random(
            ...(numberSort({ values: [minPoint.y, maxPoint.y] }) as [number, number]),
          );

      item.dataset.x = x.toString();
      item.dataset.y = y.toString();
    });
    // console.log({ hobbies })
    const tw = gsap.to(hobbies, {
      autoAlpha: 1,
      x(_, target) {
        return +target.dataset.x!;
      },
      y(_, target) {
        return +target.dataset.y!;
      },

      scrollTrigger: {
        id: 'hobbyTrigger',
        fastScrollEnd: true,
        toggleActions: 'play complete reverse reset',
        trigger: '.content-wrap',
        scroller,
        start: 'top center',
        end: 'center center',
        scrub: 1,
        onEnterBack() {
          hobbies.forEach((target) => {
            if (!target.dataset.dragged) {
              target.dataset.status = 'initial';
              clearCallback(target);
            }
          });
        },
      },
    });

    ScrollTrigger.create({
      id: 'hobbyWrapTrigger',
      scroller,
      trigger: '.content-wrap',
      end: 'center top+=100',
      fastScrollEnd: true,
      onLeave: () => {
        const inititems = hobbies.filter((item) => item.dataset.status === 'initial');
        // console.log('onLeave', inititems)
        inititems.forEach((target) => {
          moveHobby({
            target,
            vx: 0,
            vy: 0,
            maxX: width / 2,
            maxY: height / 2,
            minX: -width / 2,
            minY: -height / 2,
          });
        });
      },
    });

    return () => {
      tw.kill();
      draggableInstance.forEach((item) => {
        item.kill();
      });
      draggableInstance = [];
    };
  }, scroller);
};

const onResize = useDebounceFn(refreshAni, DebounceTime.middle);

watch(
  () => scroller,
  (newVal) => {
    if (!newVal) return;
    const secNode = secRef.value;
    const contentWrapNode = secNode?.querySelector('.content-wrap');
    if (contentWrapNode) {
      const { width, height } = contentWrapNode.getBoundingClientRect();
      refreshAni({ width, height });
    }
  },
);

onUnmounted(() => {
  clear();
});
</script>

<style scoped lang="scss">
.sec-hobby {
  --mask-color: #000;
  --mask-color-tran: transparent;

  padding: 100px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, var(--prc-yellow-8), var(--prc-orange-8));
  mask:
    radial-gradient(50.39px at 50% 68.75px, var(--mask-color) 99%, var(--mask-color-tran) 101%) calc(50% - 50px) 0 / 100px 51% repeat-x,
    radial-gradient(50.39px at 50% -43.75px, var(--mask-color-tran) 99%, var(--mask-color) 101%) 50% 25px / 100px calc(51% - 25px) repeat-x,
    radial-gradient(50.39px at 50% calc(100% - 68.75px),
    var(--mask-color) 99%,
    var(--mask-color-tran) 101%) calc(50% - 50px) 100% / 100px 51% repeat-x,
    radial-gradient(50.39px at 50% calc(100% + 43.75px),
    var(--mask-color-tran) 99%,
    var(--mask-color) 101%) 50% calc(100% - 25px) / 100px calc(51% - 25px) repeat-x;

  .content-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    // border: 1px solid #923f3f;

    .title {
      position: relative;
      z-index: 1;
      width: 140px;
      font-size: 60px;
      line-height: 1.2;
      text-align: center;
      font-family: var(--special-font-family);

      // background-color: #7fffd45e;
    }

    .hobby-item {
      width: 54px;
      position: absolute;
      cursor: pointer;
      opacity: 0;
    }
  }
}

@media screen and (width >=768px) {
  .sec-hobby {
    padding: 100px 50px;

    .content-wrap .title {
      width: 200px;
      font-size: 84px;
    }
  }
}
</style>
