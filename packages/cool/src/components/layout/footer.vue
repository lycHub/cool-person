<template>
  <footer class="sec sec-footer">
    <contact-icons class="c-icos" />
    <div class="beians">
      <!--  <a class="beian-link" href="//beian.mps.gov.cn/#/query/webSearch?code=你的公安备案号" target="_blank"
        rel="noopener noreferrer">
        <img :src="`${publicAssetsPrefix()}/images/police.png`" alt="police" />
        沪公网安备XXXXXXXXXXXX号
      </a>
      <span class="v-line">|</span> -->
      <a class="beian-link" href="//beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
        赣ICP备2026003402号-1
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import ContactIcons from '../../components/contact-icons/index.vue';
// import { publicAssetsPrefix } from '../../utils';
</script>

<style scoped lang="scss">
.sec-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-8) var(--spacing-20);


  .beians {
    font-size: var(--text-size-14);

    .beian-link {
      color: var(--prc-info);

      img {
        width: 16px;
        vertical-align: sub;
      }
    }

    .v-line {
      margin: 0 var(--spacing-10);
    }
  }

  .c-icos {
    font-size: var(--text-size-20);
  }
}
</style>
