<template>
  <section class="sec sec-contact" ref="secContact">
    <div class="sc-title">
      <h3>contact me</h3>
    </div>
    <div class="sc-methods">
      <a
        class="scm"
        href="mailto:1120805364@qq.com"
        :ref="(el) => addTextRef(el as HTMLAnchorElement)"
        >1120805364@qq.com</a
      >
      <a class="scm" href="tel:15079010174" :ref="(el) => addTextRef(el as HTMLAnchorElement)"
        >15079010174</a
      >
      <spring-mobile class="mobile-svg" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { type TypeWithNull } from '@personal/shared';
import { useJumpText } from '../../../hooks';
import SpringMobile from '../../../components/spring-mobile.vue';

const jumpTextEls = ref<HTMLAnchorElement[]>([]);
const addTextRef = (el: TypeWithNull<HTMLAnchorElement>) => {
  if (el && !jumpTextEls.value.includes(el)) {
    jumpTextEls.value.push(el);
  }
};

let ctx: TypeWithNull<gsap.Context> = null;

useJumpText({ target: jumpTextEls.value });

const clear = () => {
  // 内部会先调用kill
  ctx?.revert();
  ctx = null;
  jumpTextEls.value = [];
};

onUnmounted(() => {
  clear();
});
</script>

<style scoped lang="scss">
.sec-contact {
  --svg-width: 400px;
  --border-size: 6px;

  padding: var(--spacing-56) var(--spacing-20);

  .sc-title {
    font-size: min(6vw, 54px);
    font-weight: var(--text-bold-700);
    text-align: center;
    text-transform: uppercase;
  }

  .sc-methods {
    position: relative;
    width: max-content;
    padding-block: var(--spacing-20) calc(0.75 * var(--svg-width));
    text-align: center;
    margin-inline: auto;

    .scm {
      position: relative;
      display: block;
      margin-inline: auto;
      width: fit-content;
      padding-block: var(--spacing-12);
      font-size: min(8vw, 64px);

      // border-bottom: var(--border-size) solid;
      overflow: hidden;

      &::before,
      &::after {
        display: block;
        content: ' ';
        position: absolute;
        inset-inline: 0;
        inset-block-end: 0;
        height: var(--border-size);
      }

      &::before {
        background-color: var(--prc-neutral-900);
      }

      &::after {
        background-color: var(--prc-neutral-100);
        transform: scale(0);
        transform-origin: right;
        transition: transform 0.6s;
      }
    }

    .scm:hover::after {
      transform-origin: left;
      transform: scale(1);
    }

    .mobile-svg {
      // border: 1px solid #666;
      font-size: var(--svg-width);
      position: absolute;
      right: 0;
    }
  }
}
</style>
