<template>
  <div class="contact-icons">
    <custom-link v-for="value of (state.contactWays || [])" class="link" :to="value.link" :title="value.name"
      target="_blank">
      <icon :class="clsx('ico ico-' + value.key)" :icon="'zs-' + value.icon" />
    </custom-link>
  </div>
</template>

<script setup lang="ts">
import clsx from 'clsx';
import { Icon } from '@iconify/vue';
import CustomLink from '../custom-link/index.vue';
import { useApiDataStore } from '../../store';

const { state } = useApiDataStore();

</script>

<style lang="scss" scoped>
.contact-icons {
  --contact-icon-text-size: inherit;

  font-size: var(--contact-icon-text-size);

  .link {
    margin-inline: var(--spacing-4);
    cursor: pointer;
    transition-property: color, transform;
    transition-duration: var(--ts-duration-mid);

    &:hover {
      color: var(--prc-cyan-8);
      transform: scale(1.2);
    }
  }
}
</style>
