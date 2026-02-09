<template>
  <div class="rotate-bg-shape">
    <div class="bg-shape"></div>
    <div class="bg-shape"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.rotate-bg-shape {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(88px);
  }

  .bg-shape {
    position: absolute;
    width: 40%;
    height: 30vh;
    opacity: 0.7;
    border-radius: 95px;
    animation-duration: 20s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    transform: translateY(-50%) rotate(487.606deg);
  }

  .bg-shape:first-child {
    inset-block-start: 30%;
    background-color: var(--prc-success);
    animation-name: shape-animation-one;
    left: 8vw;
  }

  .bg-shape:last-child {
    inset-block-start: 70%;
    background-color: var(--prc-info);
    animation-name: shape-animation-two;
    right: 8vw;
  }
}
</style>
