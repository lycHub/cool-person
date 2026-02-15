<template>
  <section class="sec sec-gallery" ref="secGalleryRef" v-element-size="onResize">
    <gallery-desc />
    <gallery-scenes :scenes="scenes" :img-size="imgSize" />
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { computed, onMounted, onUnmounted, shallowReactive, useTemplateRef } from 'vue';
import { DebounceTime, type TypeWithNull } from '@personal/shared';
import GalleryDesc from './gallery-desc.vue';
import GalleryScenes from './gallery-scenes.vue';
import { vElementSize } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';
import { publicAssetsPrefix } from '../../../utils';
import { useApiDataStore } from '../../../store';


gsap.registerPlugin(ScrollTrigger);
const { scroller } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
}>();

const AspectRatio = 1.36;
const Angle = 8;
const TextResistance = 0.94;
const MaxImgWidth = 600;

const secRef = useTemplateRef<HTMLElement>('secGalleryRef');

const { state } = useApiDataStore();

const scenes = computed(() => {
  return (state.sceneries || []).map((item, index) => {
    const isOdd = index % 2 === 0;
    return {
      key: item,
      path: `${publicAssetsPrefix()}/images/${item}`,
      rotate: isOdd ? -Angle : Angle,
    };
  });
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

onMounted(() => { });

onUnmounted(() => {
  clear();
});



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
