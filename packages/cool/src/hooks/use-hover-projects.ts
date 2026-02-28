import { gsap } from 'gsap';
import { getDeviceTypeByUserAgent, removePx, type TypeWithNull } from '@personal/shared';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { publicAssetsPrefix } from '../utils';

import type { ProjectInfo } from '../typings/data';

export const DefaultProjectImgSize = {
  width: '400px',
  height: '260px',
};

export function useHoverProjects({
  container,
  imgSize = DefaultProjectImgSize,
}: {
  container: MaybeRefOrGetter<TypeWithNull<HTMLElement>>;
  imgSize?: {
    width: string;
    height: string;
  };
}) {
  let moveMeta: TypeWithNull<{
    startX: number;
    startY: number;
    realTimeX: number;
    realTimeY: number;
    lastTime: number;
  }> = null;

  let isLeaving = false;
  const onMouseEnter = (event: MouseEvent, project: ProjectInfo) => {
    if (getDeviceTypeByUserAgent() !== 'desktop') return;
    const secSelector = gsap.utils.selector(toValue(container));
    const targetEl = secSelector('.project-pop')[0];
    if (isLeaving || !targetEl) return;
    const imgEl = targetEl.querySelector('img')! as HTMLImageElement;
    imgEl.src = `${publicAssetsPrefix()}/images/${project.coverPic}`;
    imgEl.alt = project.name;
    moveMeta = {
      startX: event.clientX,
      startY: event.clientY,
      realTimeX: event.clientX,
      realTimeY: event.clientY,
      lastTime: Date.now(),
    };

    const listWrap = secSelector<HTMLDivElement>('.project-list')[0]!;
    const { left, top } = listWrap.getBoundingClientRect();
    const x = moveMeta.startX - left - removePx(imgSize.width) / 2;
    const y = moveMeta.startY - top - removePx(imgSize.height) / 2;
    gsap.set(targetEl, { x, y });
    gsap.to(targetEl, { autoAlpha: 1, scale: 1, duration: 0.3 });
  };

  let xTo: TypeWithNull<gsap.QuickToFunc> = null;
  let yTo: TypeWithNull<gsap.QuickToFunc> = null;
  const Duration = 0.6;

  const onMouseMove = (event: MouseEvent) => {
    if (!moveMeta) return;
    const secSelector = gsap.utils.selector(toValue(container));
    const listWrap = secSelector<HTMLDivElement>('.project-list')[0]!;
    const targetEl = secSelector('.project-pop')[0]!;
    const currentTime = Date.now();
    moveMeta.realTimeX = event.clientX;
    moveMeta.realTimeY = event.clientY;
    moveMeta.lastTime = currentTime;
    const { left, top } = listWrap.getBoundingClientRect();
    const x = event.clientX - left - removePx(imgSize.width) / 2;
    const y = event.clientY - top - removePx(imgSize.height) / 2;

    if (!xTo || !yTo) {
      xTo = gsap.quickTo(targetEl, 'x', { duration: Duration });
      yTo = gsap.quickTo(targetEl, 'y', { duration: Duration });
    }

    xTo(x);
    yTo(y);
  };

  const onMouseLeave = () => {
    isLeaving = true;
    const secSelector = gsap.utils.selector(toValue(container));
    const targetEl = secSelector('.project-pop')[0]!;
    gsap.to(targetEl, {
      autoAlpha: 0,
      scale: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.killTweensOf(targetEl);
        moveMeta = null;
        xTo = null;
        yTo = null;
        isLeaving = false;
      },
    });
  };

  return { imgSize, onMouseEnter, onMouseMove, onMouseLeave };
}
