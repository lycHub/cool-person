<template>
  <section class="sec sec-friends">
    <friend-desc ref="galleryDescRef" />
    <friend-wrap />
  </section>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { type TypeWithNull } from '@personal/shared';
import FriendDesc from './friend-text.vue';
import FriendWrap from './friend-img.vue';

let ctx: TypeWithNull<gsap.Context> = null;

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
};

onUnmounted(() => {
  clear();
});
</script>

<style scoped lang="scss">
.sec-friends {
  position: relative;
  padding-block: var(--spacing-48) var(--spacing-56);
  background-color: var(--prc-cream-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10vw 20vw;
}

@media screen and (width >=768px) {
  .sec-friends {
    flex-direction: row;
  }
}
</style>
