import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { onMounted, onUnmounted, type MaybeRefOrGetter } from 'vue';
import {
  isClient,
  useIntersectionObserver,
  type MaybeComputedElementRef,
  type MaybeElement,
} from '@vueuse/core';
import { emptyFunc, closest } from '@personal/shared';

import { unRefNodes } from '../utils';

gsap.registerPlugin(SplitText);

type JumpElement = HTMLElement & {
  splitNode?: SplitText;
};

interface Props {
  target: MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]> | MaybeComputedElementRef[];
}

export function useJumpText({ target }: Props) {
  let animating = false;
  const { stop } = isClient
    ? useIntersectionObserver(
        target,
        (entries) => {
          entries.forEach((entry) => {
            const node = entry.target as JumpElement;
            const status = node.dataset.status;
            const intersectionRatio = Math.round(entry.intersectionRatio);
            if (intersectionRatio === 1) {
              if (status === 'visible') {
                return;
              }
              animating = true;
              node.dataset.status = 'visible';
              if (!node.splitNode) {
                node.splitNode = SplitText.create(node, {
                  type: 'chars',
                  charsClass: 'jump-char++',
                });
              }

              gsap.from(node.splitNode.chars, {
                yPercent: 100,
                stagger: 0.06,
                duration: 0.6,
                ease: 'back.out(2)',
                onComplete() {
                  animating = false;
                },
              });
            } else if (intersectionRatio === 0) {
              if (status !== 'visible') {
                return;
              }
              node.dataset.status = '';
            }
          });
        },
        {
          threshold: [0, 1],
        },
      )
    : {
        stop: emptyFunc,
      };

  const hoverAniConfig = {
    duration: 0.4,
    ease: 'back.out(2)',
  };

  let nodes: JumpElement[] = [];

  onMounted(() => {
    nodes = unRefNodes(target);
    if (nodes.length) {
      nodes.forEach((node) => {
        node.addEventListener('mouseover', (event) => {
          if (animating) return;
          const target = event.target as JumpElement;
          const charNode = closest(target, '.jump-char');
          if (charNode) {
            charNode.dataset.status = 'animating';
            gsap.to(charNode, {
              ...hoverAniConfig,
              y: -10,
              onComplete: () => {
                charNode.dataset.status = 'up';
              },
            });
          }
        });
        node.addEventListener('mouseout', () => {
          if (animating) return;
          const chars = node.querySelectorAll<JumpElement>('.jump-char');
          if (chars.length) {
            gsap.utils.toArray<JumpElement>(chars).forEach((charNode) => {
              gsap.to(charNode, {
                ...hoverAniConfig,
                y: 0,
                onComplete: () => {
                  charNode.dataset.status = '';
                },
              });
            });
          }
        });
      });
    }
  });

  onUnmounted(() => {
    stop();
    nodes.forEach((node) => {
      node.splitNode?.revert();
    });
  });

  return {};
}
