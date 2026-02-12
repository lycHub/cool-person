<template>
  <div class="layout">
    <rotate-bg-shape />
    <layout-header :menuStatus="menuStatus" @onClickMenu="toggleMenu" />
    <slot />
    <DrawerRoot handle-only direction="right" :open="drawerOpen" z-index="3">
      <DrawerOverlay class="drawer-overlay" @click="onDrawerChange(false)" />
      <DrawerContent class="drawer-content">
        <Menu @onClickLink="onDrawerChange(false)" />
      </DrawerContent>
    </DrawerRoot>

    <loading
      v-if="loadingVisible"
      class="full-loading"
      :direction="loadingStore.state.direction"
      :progress="progress"
      :trigger="loadingStore.state.trigger"
      @onHide="onHideLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, watch, type Component, type PublicProps } from 'vue';
import type { MenuStatus } from '../menu-btn/index.vue';
import RotateBgShape from '../RotateBgShape/index.vue';
import LayoutHeader from './header.vue';
import Menu from './menu.vue';
import loading from './loading.vue';
import { isClient, useInterval } from '@vueuse/core';
import { useLoadingStore } from '../../store';
import { emptyFunc } from '@personal/shared';
import type { DrawerRootProps } from 'vaul-vue';
import { useHead, useSeoMeta } from '@unhead/vue';
import { getSeoMeta } from '../../utils';

let DrawerRoot: Component<DrawerRootProps> = { render: emptyFunc };
let DrawerOverlay: Component<PublicProps> = { render: () => emptyFunc };
let DrawerContent: Component<PublicProps> = { render: () => emptyFunc };

if (isClient) {
  import('vaul-vue').then((mod) => {
    DrawerRoot = mod.DrawerRoot;
    DrawerOverlay = mod.DrawerOverlay;
    DrawerContent = mod.DrawerContent;
  });
}

useHead({
  title: '首页',
});

useSeoMeta(getSeoMeta());

const drawerOpen = shallowRef(false);

const menuStatus = shallowRef<MenuStatus>('inactive');

const onDrawerChange = (event: boolean) => {
  console.log('onDrawerChange', event);
  drawerOpen.value = event;
  menuStatus.value = event ? 'active' : 'inactive';
};

const toggleMenu = () => {
  onDrawerChange(!drawerOpen.value);
};

const loadingStore = useLoadingStore();

const loadingVisible = shallowRef(false);

const progress = shallowRef(0);
const { pause, reset, resume } = useInterval(loadingStore.state.speed, {
  controls: true,
  callback(count) {
    progress.value = count;
    if (count >= 100) {
      pause();
    }
  },
});

watch(
  () => loadingStore.state.status,
  (newVal) => {
    console.log('watch loadingStore.state.status', newVal);
    if (newVal === 'loading') {
      resume();
      loadingVisible.value = true;
    }
  },
);

const showLoading = () => {
  loadingStore.changeState({
    status: 'loading',
    speed: 30,
    initialed: true,
  });
};

const onHideLoading = () => {
  loadingStore.reset();
  loadingVisible.value = false;
  reset();
  progress.value = 0;
};

onMounted(() => {
  showLoading();
});
</script>

<style lang="scss">
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.drawer-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(4px);
  background-color: rgb(0 0 0 / 50%);
  z-index: 1;
}

.drawer-content {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  width: min(100%, 800px);
  z-index: 4;
}
</style>
