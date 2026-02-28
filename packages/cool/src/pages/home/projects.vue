<template>
  <section class="sec sec-projects" ref="secProjectef">
    <div class="project-list" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <project-row
        v-for="(item, index) of (state.projects || []).slice(0, 5)"
        v-bind="{ ...item, index }"
        @mouseenter="onMouseEnter($event, item)"
      />
      <div class="project-pop">
        <img src="" alt="" />
      </div>
    </div>
    <all-project-trigger class="to-all-project">
      <custom-link class="ripple-content" to="../projects">所有作品</custom-link>
    </all-project-trigger>
  </section>
</template>

<script setup lang="ts">
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onUnmounted, useTemplateRef, watch } from 'vue';
import { type TypeWithNull } from '@personal/shared';
import ProjectRow from '../../components/project-row/index.vue';
import AllProjectTrigger from '../../components/all-project-trigger/index.vue';
import { useApiDataStore } from '../../store';
import { useHoverProjects } from '../../hooks';
import CustomLink from '../../components/custom-link/index.vue';

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
    end: 'top top',
    pin: true,
    pinSpacing: false,
    // markers: true,
  });
};
watch(() => scroller, initPinAni);

const { imgSize, onMouseEnter, onMouseMove, onMouseLeave } = useHoverProjects({
  container: secRef,
});
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
