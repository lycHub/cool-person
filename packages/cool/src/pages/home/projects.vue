<template>
  <section class="sec sec-projects" ref="secProjectef">
    <div class="project-list" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <project-row v-for="(item, index) of (state.projects || []).slice(0, 5)" v-bind="{ ...item, index }"
        @mouseenter="onMouseEnter($event, item)" />
      <div class="project-pop">
        <img src="" alt="" />
      </div>
    </div>
    <all-project-trigger class="to-all-project">
      <a class="ripple-content">所有作品</a>
    </all-project-trigger>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onUnmounted, useTemplateRef, watch } from 'vue';
import { getDeviceTypeByUserAgent, removePx, type TypeWithNull } from '@personal/shared';
import { publicAssetsPrefix } from '../../utils';
import ProjectRow from '../../components/project-row/index.vue';
import AllProjectTrigger from '../../components/all-project-trigger/index.vue';
import type { ProjectInfo } from '../../typings/data';
import { useApiDataStore } from '../../store';

const secRef = useTemplateRef('secProjectef');

const { scroller } = defineProps<{
  scroller: TypeWithNull<HTMLDivElement>;
}>();

const { state } = useApiDataStore();



let ctx: TypeWithNull<gsap.Context> = null;
let scrollTriggerHandle: TypeWithNull<ScrollTrigger> = null;

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
  scrollTriggerHandle?.kill();
  scrollTriggerHandle = null;
};

onUnmounted(() => {
  clear();
});

const initPinAni = (scrollerVal: TypeWithNull<HTMLDivElement>) => {
  const endTrigger = scrollerVal?.querySelector('.sec-gallery'); // friends
  if (!endTrigger || !secRef.value || scrollTriggerHandle) return;

  scrollTriggerHandle = ScrollTrigger.create({
    id: 'projectPin',
    fastScrollEnd: true,
    scroller: scrollerVal,
    trigger: secRef.value,
    endTrigger: endTrigger,
    start: 'bottom bottom',
    end: 'bottom bottom',
    pin: true,
    pinSpacing: false,
  });
};
watch(() => scroller, initPinAni);

let moveMeta: TypeWithNull<{
  startX: number;
  startY: number;
  realTimeX: number;
  realTimeY: number;
  lastTime: number;
}> = null;

const imgSize = {
  width: '400px',
  height: '260px',
};

const onMouseEnter = (event: MouseEvent, project: ProjectInfo) => {
  if (getDeviceTypeByUserAgent() !== 'desktop') return;
  const secSelector = gsap.utils.selector(secRef.value);
  const targetEl = secSelector('.project-pop')[0];
  if (!targetEl) return;
  const imgEl = targetEl.querySelector('img')! as HTMLImageElement;
  imgEl.src = `${publicAssetsPrefix()}/images/${project.coverPic}`;
  imgEl.alt = project.name;
  if (moveMeta) return;
  moveMeta = {
    startX: event.clientX,
    startY: event.clientY,
    realTimeX: event.clientX,
    realTimeY: event.clientY,
    lastTime: Date.now(),
  };

  const listWrap = secSelector<HTMLDivElement>('.project-list')[0]!;
  const { left, top } = listWrap.getBoundingClientRect();
  const x = moveMeta.startX - left - removePx(imgSize.width) / 2;
  const y = moveMeta.startY - top - removePx(imgSize.height) / 2;
  gsap.set(targetEl, { x, y });
  gsap.to(targetEl, { autoAlpha: 1, scale: 1, duration: 0.3 });
};

let xTo: TypeWithNull<gsap.QuickToFunc> = null;
let yTo: TypeWithNull<gsap.QuickToFunc> = null;
const Duration = 0.6;

const onMouseMove = (event: MouseEvent) => {
  if (!moveMeta) return;
  const secSelector = gsap.utils.selector(secRef.value);
  const listWrap = secSelector<HTMLDivElement>('.project-list')[0]!;
  const targetEl = secSelector('.project-pop')[0]!;
  const currentTime = Date.now();
  moveMeta.realTimeX = event.clientX;
  moveMeta.realTimeY = event.clientY;
  moveMeta.lastTime = currentTime;
  const { left, top } = listWrap.getBoundingClientRect();
  const x = event.clientX - left - removePx(imgSize.width) / 2;
  const y = event.clientY - top - removePx(imgSize.height) / 2;

  if (!xTo || !yTo) {
    xTo = gsap.quickTo(targetEl, 'x', { duration: Duration });
    yTo = gsap.quickTo(targetEl, 'y', { duration: Duration });
  }

  xTo(x);
  yTo(y);
};

const onMouseLeave = () => {
  const secSelector = gsap.utils.selector(secRef.value);
  const targetEl = secSelector('.project-pop')[0]!;
  gsap.to(targetEl, {
    autoAlpha: 0,
    scale: 0,
    duration: 0.3,
    onComplete: () => {
      moveMeta = null;
      gsap.killTweensOf(targetEl);
    },
  });
  xTo = null;
  yTo = null;
};
</script>

<style scoped lang="scss">
.sec-projects {
  padding: 80px var(--spacing-20);

  .project-list {
    position: relative;

    .project-pop {
      content-visibility: auto;
      opacity: 0;
      scale: 0;
      position: absolute;
      z-index: -1;
      pointer-events: none;
      width: v-bind('imgSize.width');
      height: v-bind('imgSize.height');
      left: 0;
      top: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .to-all-project {
    width: 120px;
    margin-inline: auto;
    margin-block-start: var(--spacing-40);
  }
}
</style>
