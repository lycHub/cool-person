<template>
  <div class="friend-wrap">
    <div ref="imgWrapRef" class="friend-imgs">
      <img
        v-for="item of friendData"
        class="friend-item"
        :src="`${publicAssetsPrefix()}/images/${item}`"
        :alt="item"
        @pointerdown="onDragStart"
        @click="clickSwitchImg(item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';
import { onMounted, ref, useTemplateRef } from 'vue';
import { Friends, publicAssetsPrefix } from '../../../utils';
import {
  getClientCoordinateFromEvent,
  moveToIndex,
  type PointEventType,
  type TypeWithNull,
} from '@personal/shared';
gsap.registerPlugin(Draggable);

const DragConfig: {
  staticAngle: number;
  angleRange: [number, number];
  staticScale: number;
  scaleRange: [number, number];
  minDragDistance: number;
  minSwitchAngle: number;
} = {
  staticAngle: 20,
  angleRange: [-40, 40],
  staticScale: 0.8,
  scaleRange: [0.7, 1],
  minDragDistance: 4,
  minSwitchAngle: 15,
};

const DefaultDragMeta = {
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  currentAngle: 0,
  draggingTarget: null,
};

let DragMeta: {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  currentAngle: number;
  draggingTarget: TypeWithNull<HTMLImageElement>;
  leftTarget?: HTMLImageElement;
  rightTarget?: HTMLImageElement;
} = { ...DefaultDragMeta };

const imgWrapRef = useTemplateRef<HTMLDivElement>('imgWrapRef');
let imgItemsRef: HTMLImageElement[] = [];

let moveEventController: TypeWithNull<AbortController> = null;
let endEventController: TypeWithNull<AbortController> = null;
let switchTl: TypeWithNull<gsap.core.Timeline> = null;

const friendData = ref<string[]>(Friends);

const cleanup = () => {
  moveEventController?.abort();
  moveEventController = null;
  endEventController?.abort();
  endEventController = null;
};

const MidIndex = Math.floor(friendData.value.length / 2);

let activeFriend = friendData.value[MidIndex]!;

const getTransformOrigin = (dir: 'left' | 'right') => `bottom ${dir}`;

const refreshImgLayout = () => {
  imgItemsRef = gsap.utils.toArray<HTMLImageElement>('.friend-item');
  // console.log({ imgItemsRef: imgItemsRef.map((item) => item.alt) });
  if (!imgItemsRef.length) {
    return;
  }
  imgItemsRef.forEach((img, index, arr) => {
    if (index < MidIndex) {
      gsap.set(img, {
        transformOrigin: getTransformOrigin('left'),
        rotateZ: -DragConfig.staticAngle,
        scale: DragConfig.staticScale,
        zIndex: index,
      });
    } else if (index > MidIndex) {
      gsap.set(img, {
        transformOrigin: getTransformOrigin('right'),
        rotateZ: DragConfig.staticAngle,
        scale: DragConfig.staticScale,
        zIndex: arr.length - 1 - index,
      });
    } else {
      gsap.set(img, {
        rotateZ: 0,
        scale: 1,
        zIndex: index,
      });
    }
  });
};

onMounted(() => {
  refreshImgLayout();
});

const onDragStart = (event: PointEventType) => {
  event.preventDefault();
  event.stopPropagation();
  const clientCoordinate = getClientCoordinateFromEvent(event);
  if (!imgItemsRef.length || DragMeta.draggingTarget || !clientCoordinate) {
    return;
  }

  if (event.type === 'pointerdown' && (event as PointerEvent).button !== 0) {
    return;
  }

  const target = event.target as HTMLImageElement;
  // console.log({
  //   draggingTarget: DragMeta.draggingTarget,
  //   target: target?.alt,
  //   active: activeFriend,
  // });
  if (DragMeta.draggingTarget || target?.alt !== activeFriend || switchTl?.isActive) {
    return;
  }

  DragMeta.startX = clientCoordinate.clientX;
  DragMeta.startY = clientCoordinate.clientY;
  DragMeta.currentX = clientCoordinate.clientX;
  DragMeta.currentY = clientCoordinate.clientY;
  DragMeta.draggingTarget = target;
  DragMeta.leftTarget = target.previousElementSibling as HTMLImageElement;
  DragMeta.rightTarget = target.nextElementSibling as HTMLImageElement;

  imgWrapRef.value!.setPointerCapture((event as PointerEvent).pointerId);
  moveEventController = new AbortController();
  endEventController = new AbortController();
  target.ownerDocument.addEventListener('pointermove', moveHandler, {
    signal: moveEventController.signal,
  });
  target.ownerDocument.addEventListener('pointerup', endHandler, {
    signal: endEventController.signal,
  });
  target.ownerDocument.addEventListener('pointercancel', endHandler, {
    signal: endEventController.signal,
  });
};

const angleTransformer = gsap.utils.pipe(gsap.utils.clamp(...DragConfig.angleRange));

const scaleTransformer = gsap.utils.pipe(
  gsap.utils.mapRange(
    0,
    DragConfig.angleRange[1],
    ...(DragConfig.scaleRange.slice().reverse() as [number, number]),
  ),
);

const leftAngleTransformer = gsap.utils.pipe(gsap.utils.clamp(-DragConfig.staticAngle, 0));

const leftScaleTransformer = gsap.utils.pipe(
  gsap.utils.mapRange(-DragConfig.staticAngle, 0, DragConfig.staticScale, 1),
);

const rightAngleTransformer = gsap.utils.pipe(gsap.utils.clamp(0, DragConfig.staticAngle));

const rightScaleTransformer = gsap.utils.pipe(
  gsap.utils.mapRange(0, DragConfig.staticAngle, 1, DragConfig.staticScale),
);

function moveHandler(event: PointEventType) {
  event.preventDefault();
  event.stopPropagation();
  const { draggingTarget, leftTarget, rightTarget, currentAngle, currentX } = DragMeta;
  const clientCoordinate = getClientCoordinateFromEvent(event);
  if (!clientCoordinate || !draggingTarget) {
    return;
  }

  const diffX = clientCoordinate.clientX - currentX;

  if (Math.abs(diffX) <= DragConfig.minDragDistance) return;

  const newAngle = angleTransformer(currentAngle + diffX * 0.6);
  const inLeft = newAngle < 0;
  const transformOrigin = inLeft ? getTransformOrigin('left') : getTransformOrigin('right');
  const newScale = scaleTransformer(Math.abs(newAngle));

  gsap.set(draggingTarget, {
    rotateZ: newAngle,
    scale: newScale,
    transformOrigin,
    zIndex: imgItemsRef.length,
  });

  DragMeta.currentX = clientCoordinate.clientX;
  DragMeta.currentY = clientCoordinate.clientY;
  DragMeta.currentAngle = newAngle;

  if (leftTarget) {
    const leftImgCurrAngle = gsap.getProperty(leftTarget, 'rotateZ') as number;
    const leftImgNewAngle = leftAngleTransformer(leftImgCurrAngle + diffX * 0.2);
    const leftImgNewScale = leftScaleTransformer(leftImgNewAngle);
    // console.log({ leftImgNewAngle, leftImgNewScale });
    gsap.set(leftTarget, {
      rotateZ: leftImgNewAngle,
      scale: leftImgNewScale,
      transformOrigin: getTransformOrigin('left'),
      zIndex: inLeft ? imgItemsRef.length - 2 : imgItemsRef.length - 1,
    });
  }

  if (rightTarget) {
    const rightImgCurrAngle = gsap.getProperty(rightTarget, 'rotateZ') as number;
    const rightImgNewAngle = rightAngleTransformer(rightImgCurrAngle + diffX * 0.2);
    const rightImgNewScale = rightScaleTransformer(rightImgNewAngle);
    // console.log({ rightImgNewAngle, rightImgNewScale });
    gsap.set(rightTarget, {
      rotateZ: rightImgNewAngle,
      scale: rightImgNewScale,
      transformOrigin: getTransformOrigin('right'),
      zIndex: inLeft ? imgItemsRef.length - 1 : imgItemsRef.length - 2,
    });
  }

  imgItemsRef.forEach((img, index, arr) => {
    if (![draggingTarget.alt, leftTarget?.alt, rightTarget?.alt].includes(img.alt)) {
      const zIndex = index < MidIndex ? index : arr.length - 1 - index;
      gsap.set(img, {
        zIndex,
      });
    }
  });
}

function aniCompleteFunc() {
  DragMeta = { ...DefaultDragMeta };
  refreshImgLayout();
  switchTl?.kill();
  switchTl = null;
}

function endHandler(event: PointEventType) {
  const { draggingTarget, leftTarget, rightTarget } = DragMeta;
  // console.log('end', { draggingTarget, nextTarget });
  if (!imgWrapRef.value || !draggingTarget || !leftTarget || !rightTarget) return;
  event.preventDefault();
  event.stopPropagation();
  cleanup();
  imgWrapRef.value.releasePointerCapture((event as PointerEvent).pointerId);
  const draggingTargetAngle = gsap.getProperty(draggingTarget, 'rotateZ') as number;
  const needSwitch = Math.abs(draggingTargetAngle) > DragConfig.minSwitchAngle;
  // console.log('end>>', draggingTargetAngle);
  const inLeft = draggingTargetAngle < 0;
  const newActiveTarget = inLeft ? rightTarget : leftTarget;

  if (needSwitch) {
    clickSwitchImg(newActiveTarget.alt);
  } else {
    switchTl = gsap.timeline({
      id: 'friendSwitchTl',
      duration: 0.3,
      onComplete() {
        aniCompleteFunc();
      },
    });
    switchTl.to(rightTarget, {
      rotateZ: DragConfig.staticAngle,
      scale: DragConfig.staticScale,
    });

    switchTl.to(
      leftTarget,
      {
        rotateZ: -DragConfig.staticAngle,
        scale: DragConfig.staticScale,
      },
      '<',
    );
    switchTl.to(
      draggingTarget,
      {
        rotateZ: 0,
        scale: 1,
      },
      '<',
    );
  }
}

function clickSwitchImg(targetKey: string) {
  if (targetKey === activeFriend || switchTl?.isActive) return;
  const targetIndex = imgItemsRef.findIndex((item) => item.alt === targetKey);
  const target = imgItemsRef[targetIndex]!;

  const leftTarget = target.previousElementSibling as HTMLImageElement;
  const rightTarget = target.nextElementSibling as HTMLImageElement;
  if (!leftTarget || !rightTarget) return;
  const isClickLeft = targetIndex < MidIndex;
  // console.log('isClickLeft', isClickLeft, target.alt);
  switchTl = gsap.timeline({
    id: 'friendSwitchTl',
    duration: 0.3,
    onComplete() {
      const fromIndex = isClickLeft ? friendData.value.length - 1 : 0;
      const newIndex = isClickLeft ? 0 : friendData.value.length - 1;
      activeFriend = target.alt;
      // console.log({
      //   fromIndex,
      //   newIndex,
      // });
      moveToIndex(imgItemsRef[fromIndex]!, newIndex);
      aniCompleteFunc();
    },
  });

  switchTl.to(target, {
    rotateZ: 0,
    scale: 1,
    zIndex: imgItemsRef.length + 1,
    transformOrigin: isClickLeft ? getTransformOrigin('left') : getTransformOrigin('right'),
  });

  if (isClickLeft) {
    switchTl.to(
      rightTarget,
      {
        rotateZ: DragConfig.staticAngle,
        scale: DragConfig.staticScale,
        transformOrigin: getTransformOrigin('right'),
      },
      '<',
    );
  } else {
    switchTl.to(
      leftTarget,
      {
        rotateZ: -DragConfig.staticAngle,
        scale: DragConfig.staticScale,
        transformOrigin: getTransformOrigin('left'),
      },
      '<',
    );
  }
}
</script>

<style scoped lang="scss">
.friend-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;

  .friend-imgs {
    position: relative;
    width: min(50vw, 300px);
    aspect-ratio: 1 / 1.4;

    // overflow: hidden;
    user-select: none;
    touch-action: none;

    .friend-item {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
