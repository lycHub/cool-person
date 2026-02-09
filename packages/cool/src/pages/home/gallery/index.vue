<template>
  <section class="sec sec-gallery" ref="secGalleryRef" v-element-size="onResize">
    <gallery-desc />
    <gallery-scenes :scenes="scenes" :img-size="imgSize" />
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onMounted, onUnmounted, shallowReactive, useTemplateRef } from 'vue';
import { DebounceTime, type TypeWithNull } from '@personal/shared';
import GalleryDesc from './gallery-desc.vue';
import GalleryScenes from './gallery-scenes.vue';
import { vElementSize } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';
import { publicAssetsPrefix, Sceneries } from '../../../utils';

type GalleryImageElementType = HTMLImageElement & { showStatus: string };

gsap.registerPlugin(ScrollTrigger);
const { scroller, direction } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
  direction: number;
}>();

const AspectRatio = 1.36;
const Angle = 8;
const TextResistance = 0.94;
const MaxImgWidth = 600;

const secRef = useTemplateRef<HTMLElement>('secGalleryRef');

const scenes = Sceneries.map((item, index) => {
  const isOdd = index % 2 === 0;
  return {
    key: item,
    path: `${publicAssetsPrefix()}/images/${item}`,
    rotate: isOdd ? -Angle : Angle,
  };
});

const imgSize = shallowReactive({
  width: 0,
  height: 0,
});

let ctx: TypeWithNull<gsap.Context> = null;
let observer: TypeWithNull<IntersectionObserver> = null;

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
  observer?.disconnect();
  observer = null;
};

let imgAnimating = false;

const imgAniConfig = {
  duration: 0.5,
  ease: 'power3.inOut',
};
const threshold = [0, 0.25, 0.5, 0.75, 1];

onMounted(() => {});

onUnmounted(() => {
  clear();
});

function refreshObserver() {
  const wrapper = secRef.value?.querySelector('.gallery-scenes');
  const sceneImgs = secRef.value?.querySelectorAll<GalleryImageElementType>('.scene-item');
  if (!sceneImgs?.length) return;
  const hideThreshold = Math.floor(wrapper!.clientWidth / 2);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const intersectionRatio = gsap.utils.snap(threshold, entry.intersectionRatio);
        const target = entry.target as GalleryImageElementType;

        // console.log({
        //   key: target.alt,
        //   dir: direction,
        //   intersectionRatio,
        //   isIntersecting: entry.isIntersecting,
        //   intersectionRect: entry.intersectionRect,
        // });
        if (imgAnimating) return;
        const hideX = -Math.round(imgSize.width / 2);
        const hideY = Math.round(imgSize.height / 2);
        const isMoveToLeft = direction === 1;
        const currentStatus = target.showStatus;
        if (isMoveToLeft) {
          if (intersectionRatio >= 0.5 && !currentStatus) {
            imgAnimating = true;
            target.showStatus = 'inView';
            const angle = +target.dataset.angle!;
            // console.log({
            //   hideX,
            //   hideY,
            // });
            gsap.fromTo(
              target,
              {
                ...imgAniConfig,
                x: hideX,
                y: hideY,
                autoAlpha: 0,
              },
              {
                ...imgAniConfig,
                x: 0,
                y: 0,
                autoAlpha: 1,
                rotateZ: angle,
                onComplete: () => {
                  imgAnimating = false;
                },
              },
            );
          }
        } else {
          if (
            intersectionRatio <= 0.5 &&
            currentStatus === 'inView' &&
            entry.intersectionRect.left >= hideThreshold
          ) {
            imgAnimating = true;
            target.showStatus = '';
            gsap.to(target, {
              ...imgAniConfig,
              x: hideX,
              y: hideY,
              rotateZ: 0,
              autoAlpha: 0,
              onComplete: () => {
                imgAnimating = false;
              },
            });
          }
        }
        // 每个条目描述一个目标元素观测点的交叉变化：
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
      });
    },
    {
      root: wrapper,
      // rootMargin: '0px',
      threshold,
    },
  );
  sceneImgs.forEach((item) => {
    observer!.observe(item);
  });
}

const refreshAni = (winWidth: number) => {
  ctx = gsap.context(() => {
    const container = secRef.value!.querySelector('.scene-wrap')! as HTMLDivElement;

    const textNodes = gsap.utils.toArray<HTMLDivElement>(
      secRef.value!.querySelectorAll('.gallery-desc .gd-text'),
    );
    const ySetter = gsap.quickSetter(textNodes, 'y', 'px');

    const moveDistance = Math.round(container.offsetWidth - winWidth);
    const containerTween = gsap.to(container, {
      id: 'galleryContainerTween',
      x: -moveDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        scroller,
        pin: true,
        scrub: 0.1,
        start: 'bottom bottom',
        fastScrollEnd: true,
        end: `+=${moveDistance}`,
        onUpdate(self) {
          const moveDistance = (self.end - self.start) * self.progress * TextResistance;
          ySetter(moveDistance);
        },
        onLeave() {
          const imgItems = gsap.utils
            .toArray<GalleryImageElementType>(container.querySelectorAll('.scene-item'))
            .filter((item) => !item.showStatus);
          if (imgItems.length) {
            imgAnimating = true;
            imgItems.forEach((item) => {
              item.showStatus = 'inView';
            });
            gsap.to(imgItems, {
              ...imgAniConfig,
              x: 0,
              y: 0,
              autoAlpha: 1,
              rotateZ(_, target) {
                const angle = +target.dataset.angle!;
                return angle;
              },
              onComplete: () => {
                imgAnimating = false;
              },
            });
          }
        },
      },
    });

    const distance = {
      first: Math.round(winWidth / 4),
      second: -Math.round(winWidth / 5),
      third: Math.round(winWidth / 4),
    };

    gsap.to(textNodes, {
      id: 'galleryTextTween',
      x(_, target) {
        const type = target.dataset.type! as keyof typeof distance;
        return distance[type];
      },
      scrollTrigger: {
        scroller,
        trigger: textNodes[0],
        endTrigger: secRef.value,
        start: 'top bottom',
        end: containerTween.scrollTrigger!.end,
        scrub: 0.1,
        fastScrollEnd: true,
      },
    });
  }, secRef.value!);
};

const refreshImgs = ({ width }: { width: number; height: number }) => {
  if (!secRef.value) return;
  clear();
  const imgWidth = Math.min(Math.round(width / 1.4), MaxImgWidth);
  imgSize.width = imgWidth;
  imgSize.height = Math.round(imgWidth / AspectRatio);
  refreshObserver();
  refreshAni(width);
};

const onResize = useDebounceFn(refreshImgs, DebounceTime.middle);
</script>

<style scoped lang="scss">
.sec-gallery {
  position: relative;
  padding-block: var(--spacing-20) var(--spacing-56);
  background-color: var(--prc-cream-3);
}
</style>
