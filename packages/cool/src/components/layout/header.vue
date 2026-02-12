<template>
  <header className="common-header">
    <div class="common-header-left">
      <custom-link to="/">
        <logo />
      </custom-link>
    </div>
    <div class="common-header-right">
      <theme-btn class="theme-trigger" :status="currentTheme" @click="toggleTheme" />
      <menu-btn class="menu-trigger" :status="menuStatus" @click="$emit('onClickMenu')" />
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  getClientCoordinateFromEvent,
  ThemeValue,
  type PointEventType,
  type Theme,
} from '@personal/shared';
import { useToggle, type ConfigurableWindow } from '@vueuse/core';
import { onMounted } from 'vue';
import { storage, StorageKeys, ThemeToggleDuration, toggleStorage } from '../../utils';
import ThemeBtn from '../theme-btn/index.vue';
import MenuBtn, { type MenuStatus } from '../menu-btn/index.vue';
import Logo from '../logo/index.vue';
import CustomLink from '../custom-link/index.vue';

export interface UsePreferredDarkProps extends ConfigurableWindow {}

const DefaultTheme = ThemeValue.dark;
const [currentTheme, toggle] = useToggle(DefaultTheme, {
  truthyValue: ThemeValue.dark,
  falsyValue: ThemeValue.light,
});

const { menuStatus } = defineProps<{
  menuStatus: MenuStatus;
}>();

const emit = defineEmits(['onClickMenu']);

const getInitialTheme = async () => {
  const storageTheme = await storage.getItem<Theme>(StorageKeys.theme);
  if (storageTheme) {
    return storageTheme;
  }
  return DefaultTheme;
};

onMounted(async () => {
  const theme = await getInitialTheme();
  toggle(theme);
});

const toggleTheme = (event: PointEventType) => {
  const coor = getClientCoordinateFromEvent(event);
  if (!coor) return;
  // const isDark = currentTheme.value === ThemeValue.dark;
  const isDark = document.documentElement.classList.contains(ThemeValue.dark);
  const newVal = isDark ? ThemeValue.light : ThemeValue.dark;
  const html = document.documentElement;

  const updateData = () => {
    html.classList.remove(newVal === 'dark' ? ThemeValue.light : ThemeValue.dark);
    html.classList.add(newVal);
    toggleStorage(StorageKeys.theme, newVal);
  };

  if (document.startViewTransition) {
    const { clientX: x, clientY: y } = coor;
    html.style.setProperty('--theme-tirgger-position', `${x}px ${y}px`);
    html.style.setProperty('--theme-tirgger-duration', `${ThemeToggleDuration}ms`);
    //  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    //  console.log('endRadius', endRadius)
    const transition = document.startViewTransition(() => {
      updateData();
    });
    transition.finished.then(() => {
      toggle();
    });
  } else {
    updateData();
    toggle();
  }
};
</script>

<style scoped lang="scss">
.common-header {
  --theme-tirgger-position: 50% 50%;

  position: absolute;
  top: 0;
  width: 100%;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-12) var(--spacing-16);

  &-right {
    display: flex;
    align-items: center;
    font-size: var(--text-size-60);
  }
}

@media screen and (width >=768px) {
  .common-header {
    padding: var(--spacing-30) var(--spacing-40);
  }
}
</style>
