<template>
  <div class="gallery-desc">
    <div class="gd-text first-text" data-type="first">旷野之息</div>
    <div class="gd-text second-text" data-type="second">美丽海拉鲁</div>
    <div class="gd-text third-text" data-type="third">王国之泪</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.gallery-desc {
  display: inline-block;
  text-align: center;
  margin-inline-start: 16%;

  .gd-text {
    color: var(--prc-beige-3);
    font-size: 10vw;
    font-weight: 700;
  }

  .gd-text:first-child {
    margin-inline-start: 10%;
    color: var(--prc-neutral-900);
  }

  .gd-text:nth-child(2) {
    color: var(--prc-yellow-8);
    margin-block: 6vw;
  }

  .gd-text:last-child {
    margin-inline-end: 10%;
    text-align: start;
    color: var(--prc-neutral-900);
  }
}
</style>
