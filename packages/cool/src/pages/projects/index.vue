<template>
  <div class="page-root projects" ref="pageRef">
      <div class="project-list" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <project-row v-for="(item, index) of (state.projects || [])" v-bind="{ ...item, index }"
        @mouseenter="onMouseEnter($event, item)" />
      <div class="project-pop">
        <img src="" alt="" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useApiDataStore } from '../../store';
import ProjectRow from '../../components/project-row/index.vue';
import Footer from '../../components/layout/footer.vue';
import { useHoverProjects } from '../../hooks';

const pageRef = useTemplateRef<HTMLDivElement>('pageRef');
const { state } = useApiDataStore();


const { imgSize,onMouseEnter, onMouseMove, onMouseLeave } = useHoverProjects({ container: pageRef });

</script>

<style lang="scss" scoped>
.projects {
  padding-block-start: var(--header-height);
  
  .project-list {
    position: relative;
    padding-inline: var(--spacing-20);

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
}
</style>
