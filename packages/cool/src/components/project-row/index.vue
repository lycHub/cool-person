<template>
  <custom-link class="project-row" :to="link" target="_blank">
    <div class="serial">{{ index.toString().padStart(2, '0') }}</div>
    <div class="name-desc">
      <div class="name">{{ name }}</div>
      <div class="desc">{{ description }}</div>
    </div>
    <div class="time">{{ formatDate(startTime) }} ~ {{ formatDate(endTime) }}</div>
  </custom-link>
</template>

<script setup lang="ts">
import { formatDate } from '@personal/shared';
import CustomLink from '../../components/custom-link/index.vue';
import type { ProjectInfo } from '../../typings/data';

const { name, description, link, startTime, endTime, index } = defineProps<
  ProjectInfo & { index: number }
>();
</script>

<style lang="scss" scoped>
.project-row {
  position: relative;
  padding: var(--spacing-20) var(--spacing-0);
  display: flex;
  flex-direction: column;
  column-gap: var(--spacing-26);
  border-bottom: var(--border-size-1) solid var(--prc-neutral-900);

  // transition-property: color;
  // transition-duration: 3s;

  &::after {
    position: absolute;
    content: '';
    inset: 0;
    z-index: -1;
    background-color: var(--prc-neutral-900);
    clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
    transition: clip-path var(--ts-duration-mid) ease-in-out;
  }

  .serial {
    font-size: var(--text-size-48);
    flex-shrink: 0;
    -webkit-text-stroke: var(--border-size-2) var(--prc-orange-6);
    -webkit-text-fill-color: transparent;
  }

  .name-desc {
    flex-grow: 1;

    .name {
      font-size: var(--text-size-30);
      margin-block-end: var(--spacing-4);
      font-weight: var(--text-bold-700);
    }

    .desc {
      font-size: var(--text-size-12);
    }
  }

  .time {
    align-self: self-end;
    flex-shrink: 0;
    font-size: var(--text-size-12);
  }
}

.project-row:hover {
  color: var(--prc-neutral-50);

  &::after {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  .serial {
    -webkit-text-stroke-color: transparent;
    -webkit-text-fill-color: var(--prc-orange-6);
  }
}

@media screen and (width >=768px) {
  .project-row {
    flex-direction: row;
    align-items: center;

    .serial {
      font-size: var(--text-size-64);
    }

    .name-desc .desc,
    .time {
      font-size: var(--text-size-14);
    }
  }
}
</style>
