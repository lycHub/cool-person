<template>
  <div class="gallery-scenes" ref="rootRef">
    <div class="scene-wrap">
      <img
        class="scene-item"
        v-for="item of scenes"
        :key="item.key"
        :src="item.path"
        :width="imgSize.width"
        :height="imgSize.height"
        :alt="item.key"
        :data-angle="item.rotate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scene } from '../../../typings/data';

const { scenes, imgSize } = defineProps<{
  scenes: Scene[];
  imgSize: Pick<DOMRect, 'width' | 'height'>;
}>();
</script>

<style scoped lang="scss">
.gallery-scenes {
  margin-block-start: -20vw;
  padding-block: 8vw;
  overflow: hidden;

  .scene-wrap {
    width: max-content;
    display: flex;
    align-items: center;
    column-gap: 14vw;
    padding-inline: 10vw;

    // background-color: #0ff;

    .scene-item {
      flex-shrink: 0;
      opacity: 0;
    }
  }
}
</style>
