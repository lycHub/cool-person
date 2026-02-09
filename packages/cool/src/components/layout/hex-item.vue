<template>
  <polygon class="hexagon" :points="backgroundPoints" v-bind="$attrs" />
  <template v-if="data.centered">
    <polyline ref="topBorderRef" class="hexagon-border" :points="topPoints" fill="none" stroke-width="4"
      stroke-linecap="round" :stroke="polylineStroke" />

    <polyline ref="bottomBorderRef" class="hexagon-border" :points="bottomPoints" fill="none" stroke-width="4"
      stroke-linecap="round" :stroke="polylineStroke" />
  </template>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

import { onMounted, useTemplateRef, watch, computed } from 'vue';
import { DebounceTime } from '@personal/shared';

export interface HexagonItem {
  key: string;
  points: [number, number][];
  centered: boolean;
}

gsap.registerPlugin(DrawSVGPlugin);

const {
  data,
  progress = 0,
  polylineStroke,
} = defineProps<{
  data: HexagonItem;
  progress: number;
  polylineStroke: string;
}>();

const topBorderRef = useTemplateRef<SVGPolygonElement>('topBorderRef');
const bottomBorderRef = useTemplateRef<SVGPolygonElement>('bottomBorderRef');

const backgroundPoints = computed(() => {
  return data.points.map((p) => p.join(',')).join(' ');
});

const topPoints = computed(() => {
  return data.points
    .slice(0, 4)
    .map((p) => p.join(','))
    .join(' ');
});

const bottomPoints = computed(() => {
  return [data.points[3], data.points[4], data.points[5], data.points[0]]
    .map((p) => p!.join(','))
    .join(' ');
});

const updateBorders = (progressVal: number) => {
  if (!topBorderRef.value || !bottomBorderRef.value) return;
  gsap.to([topBorderRef.value, bottomBorderRef.value], {
    drawSVG: progressVal + '%',
    duration: DebounceTime.normal / 1000,
    ease: 'power1.inOut',
  });
};

onMounted(() => {
  if (topBorderRef.value && bottomBorderRef.value) {
    gsap.set([topBorderRef.value, bottomBorderRef.value], {
      drawSVG: '0%',
    });
  }
});

watch(
  () => progress,
  (newVal) => {
    updateBorders(newVal);
  },
);
</script>
