<template>
  <div class="layout-menu h-full" ref="menuRef">
    <drawer-title class="drawer-title none" />
    <div class="layout-menu-items">
      <drawer-description
        v-for="value of MenuItems"
        :key="value.key"
        as-child
        @click="$emit('onClickLink')"
      >
        <custom-link
          class="menu-item"
          exact-active-class="exact-active"
          :data-text="value.nameEn"
          :to="value.link"
        >
          {{ value.nameEn }}
        </custom-link>
      </drawer-description>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { DrawerDescription, DrawerTitle } from 'vaul-vue';
import { MenuItems } from '../../utils';
import CustomLink from '../custom-link/index.vue';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import type { TypeWithNull } from '@personal/shared';

defineEmits(['onClickLink']);

let ctx: TypeWithNull<gsap.Context> = null;
const menuRef = useTemplateRef('menuRef');

onMounted(() => {
  if (!menuRef.value) return;
  ctx = gsap.context(() => {
    gsap.from('.menu-item', {
      autoAlpha: 0,
      xPercent: 100,
      duration: 0.8,
      stagger: 0.4,
    });
  }, [menuRef.value]);
});
onUnmounted(() => {
  ctx?.revert();
  ctx = null;
});
</script>

<style lang="scss">
.layout-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(10vw, 96px);
  background-color: var(--prc-neutral-100);

  &-items {
    // text-align: center;
    text-transform: uppercase;
    font-weight: var(--text-bold-700);

    .menu-item {
      position: relative;
      display: block;
      margin-block: var(--spacing-20);
      color: transparent;
      -webkit-text-stroke: 1px var(--prc-neutral-900);
    }

    .menu-item::after {
      position: absolute;
      display: block;
      content: attr(data-text);
      inset-block: 0;
      -webkit-text-stroke: 1px var(--prc-cyan-8);
      -webkit-text-fill-color: var(--prc-cyan-8);
      width: 0;
      overflow: hidden;
      transition: all var(--ts-duration-slow);
    }

    .menu-item:hover::after,
    .menu-item.exact-active::after {
      width: 100%;
      filter: drop-shadow(0 0 18px var(--prc-cyan-8));
    }
  }
}
</style>
