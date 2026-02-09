<template>
  <section class="sec sec-profile" ref="secProfileRef">
    <div class="profile">
      <!-- tufang,delong -->
      <img
        class="profile-pic"
        :src="publicAssetsPrefix() + '/images/linke-2.png'"
        alt="林克"
        width="300"
      />

      <div class="profile-text">
        <div class="info">
          <div class="position">海拉鲁发明家</div>
          <div class="contract">
            <p class="name">林克</p>
            <contact-icons class="icons" />
          </div>
        </div>
        <div class="func">
          <p>Freelance</p>
          <p>Designer &</p>
          <p>
            <i>Developer</i>
          </p>
        </div>
      </div>
      <down-arrows class="down-arrows" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { isClient, useMouseInElement } from '@vueuse/core';
import { gsap } from 'gsap';
import { shallowRef, useTemplateRef, watch } from 'vue';
import DownArrows from '../../components/down-arrows/index.vue';
import { publicAssetsPrefix } from '../../utils';

import ContactIcons from '../../components/contact-icons/index.vue';

const secProfileRef = useTemplateRef<HTMLElement>('secProfileRef');
const { elementX, elementY, elementWidth, elementHeight } = isClient
  ? useMouseInElement(secProfileRef, {
      // touch: false,
    })
  : {
      elementX: shallowRef(0),
      elementY: shallowRef(0),
      elementWidth: shallowRef(0),
      elementHeight: shallowRef(0),
    };

const moveEl = ({
  targetEl,
  xPercent,
  yPercent,
  range,
}: {
  targetEl: HTMLElement;
  xPercent: number;
  yPercent: number;
  range: [number, number];
}) => {
  const transformer = gsap.utils.pipe(
    // clamp between 0 and 100
    gsap.utils.clamp(0, 100),

    // then map to the corresponding position on the width of the screen
    gsap.utils.mapRange(0, 100, ...range),

    gsap.utils.snap(1),
  );

  const x = transformer(xPercent);
  const y = transformer(yPercent);

  gsap.set(targetEl, {
    x,
    y,
  });
};

const onMouseMove = ({ pointX, pointY }: { pointX: number; pointY: number }) => {
  const xPercent = Math.round((pointX / elementWidth.value) * 100);
  const yPercent = Math.round((pointY / elementHeight.value) * 100);
  const boxQSelector = gsap.utils.selector(secProfileRef.value);
  const picEl = boxQSelector('.profile-pic') as HTMLElement[];
  if (picEl[0]) {
    moveEl({
      xPercent,
      yPercent,
      range: [20, -20],
      targetEl: picEl[0],
    });
  }
  // position
  const positionEl = boxQSelector('.position') as HTMLElement[];
  if (positionEl[0]) {
    moveEl({
      xPercent,
      yPercent,
      range: [-20, 20],
      targetEl: positionEl[0],
    });
  }

  const contractEl = boxQSelector('.contract') as HTMLElement[];
  if (contractEl[0]) {
    moveEl({
      xPercent,
      yPercent,
      range: [-10, 10],
      targetEl: contractEl[0],
    });
  }

  const funcEl = boxQSelector('.func') as HTMLElement[];
  if (funcEl[0]) {
    moveEl({
      xPercent,
      yPercent,
      range: [-34, 34],
      targetEl: funcEl[0],
    });
  }
};

watch([elementX, elementY], ([newElementX, newElementY]) => {
  onMouseMove({
    pointX: +newElementX!,
    pointY: +newElementY!,
  });
});
</script>

<style scoped lang="scss">
.sec-profile {
  height: calc(100% + 70px);
  overflow: hidden;

  .profile {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .profile-pic {
      position: absolute;
      filter: brightness(0.4);
    }

    .profile-text {
      position: absolute;
      mix-blend-mode: difference;
      color: var(--prc-neutral-500);
      display: flex;
      flex-direction: column;
      row-gap: var(--spacing-30);
      white-space: nowrap;

      .info {
        order: 2;

        .position {
          font-size: var(--text-size-30);
        }

        .contract {
          font-size: var(--text-size-22);
        }
      }

      .func {
        font-size: 60px;
        line-height: 1.2;
        order: 1;
        font-family: var(--special-font-family);

        // letter-spacing: -2px;
      }
    }

    .down-arrows {
      position: absolute;
      bottom: 10%;
    }
  }
}

@media screen and (width >= 640px) {
  .sec-profile .profile .profile-text {
    flex-direction: row;
    gap: 0 var(--spacing-30);

    .info {
      order: 1;
      align-self: flex-end;
      text-align: right;
    }

    .func {
      order: 2;
    }
  }
}

@media screen and (width >= 768px) {
  .sec-profile .profile {
    img {
      margin-inline-end: 130px;
    }

    .profile-text {
      margin-inline-start: 130px;

      .func {
        font-size: 80px;
      }
    }
  }
}
</style>
