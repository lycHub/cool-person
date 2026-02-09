/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { gsap } from 'gsap';
import { getDeviceTypeByUserAgent, type TypeWithNull } from '@personal/shared';

export function useHoverMove({ moveRange }: { moveRange: [number, number] }) {
  let moveMeta: TypeWithNull<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    currentTransformX: number;
    currentTransformY: number;
    target: HTMLDivElement;
  }> = null;

  let moveEventController: TypeWithNull<AbortController> = null;
  let xTo: TypeWithNull<Function> = null;
  let yTo: TypeWithNull<Function> = null;

  const cleanup = () => {
    moveMeta = null;
    moveEventController?.abort();
    moveEventController = null;
  };

  const onRippleEnter = (event: MouseEvent) => {
    const boxEl = event.currentTarget as HTMLDivElement;
    if (!boxEl || moveMeta || getDeviceTypeByUserAgent() !== 'desktop') return;

    const { left, top, width, height } = boxEl.getBoundingClientRect();
    const { clientX, clientY } = event;
    moveMeta = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      currentTransformX: clientX - left - width / 2,
      currentTransformY: clientY - top - height / 2,
      target: boxEl,
    };
    // 将boxEl移动到指针处
    gsap.set(boxEl, {
      x: moveMeta.currentTransformX,
      y: moveMeta.currentTransformY,
    });
    moveEventController = new AbortController();
    boxEl.ownerDocument.addEventListener('mousemove', onRippleMove, {
      signal: moveEventController.signal,
    });
  };

  const onRippleMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    if (!moveMeta) return;

    const { currentX, currentY, target } = moveMeta;
    // 计算与上一次鼠标位置的差值，而不是与初始位置的差值
    const diffX = clientX - currentX;
    const diffY = clientY - currentY;
    const moveX = moveMeta.currentTransformX + diffX;
    const moveY = moveMeta.currentTransformY + diffY;

    const transformer = gsap.utils.pipe(gsap.utils.clamp(...moveRange), gsap.utils.snap(1));

    const x = transformer(moveX);
    const y = transformer(moveY);

    // console.log({ x, y });

    if (!xTo || !yTo) {
      xTo = gsap.quickSetter(target, 'x', 'px');
      yTo = gsap.quickSetter(target, 'y', 'px');
    }
    xTo(x);
    yTo(y);

    moveMeta.currentX = clientX;
    moveMeta.currentY = clientY;
    moveMeta.currentTransformX = x;
    moveMeta.currentTransformY = y;
  };

  const onRippleLeave = (event: MouseEvent) => {
    const boxEl = event.currentTarget as HTMLDivElement;
    if (!boxEl) return;
    const config = {
      x: 0,
      y: 0,
      duration: 0.3,
    };
    gsap.to(boxEl, {
      ...config,
      onComplete: () => {
        gsap.killTweensOf(boxEl);
      },
    });

    cleanup();
  };

  return {
    onRippleEnter,
    onRippleLeave,
  };
}
