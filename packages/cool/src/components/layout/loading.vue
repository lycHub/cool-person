<template>
  <div class="loading-wrapper" ref="loadingWrapperRef">
    <svg class="hexagon-grid" width="100%" height="100%" ref="loadingRef">
      <hex-item
        :class="clsx('hexagon', { centered: hex.centered })"
        v-for="hex in hexagons"
        :key="hex.key"
        :data="hex"
        :progress="progress"
        :polylineStroke="`rgb(${currColor})`"
        stroke-width="2"
        fill="rgb(255 255 255 / 1%)"
        stroke="rgb(34 127 135 / 4%)"
      />

      <defs>
        <clipPath id="hexagon-clip">
          <polygon :points="centerPoints" />
        </clipPath>
      </defs>

      <g class="loading-mask" clip-path="url(#hexagon-clip)">
        <rect
          :x="maskData.x"
          :y="maskData.y"
          :width="maskData.width"
          :height="maskData.height"
          fill="none"
          :transform="`scale(1 0)`"
          :transform-origin="maskData.transformOrigin"
        />
        <text
          :x="maskData.textX"
          :y="maskData.textY"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white"
          font-size="36"
          font-weight="bold"
          pointer-events="none"
        >
          {{ progress }}%
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { canUseDOM, DebounceTime, type TypeWithNull } from '@personal/shared';
import { useElementSize, useThrottleFn } from '@vueuse/core';
import clsx from 'clsx';
import { onUnmounted, useTemplateRef, watch, shallowReactive, shallowRef, onMounted } from 'vue';
import HexItem, { type HexagonItem } from './hex-item.vue';

const { direction, progress, trigger } = defineProps<{
  direction: 'right' | 'down';
  progress: number;
  trigger: 'initial' | 'router';
}>();

const emit = defineEmits(['onHide']);

const loadingWrapperRef = useTemplateRef('loadingWrapperRef');
const loadingRef = useTemplateRef('loadingRef');
const { width, height, stop } = useElementSize(loadingWrapperRef);

const getHexagonPoints = (cx: number, cy: number, size: number): [number, number][] => {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
};

/**
 * 生成完整的六边形网格
 * 根据计算出的行列数，为每个位置生成一个六边形的坐标点数据
 * 处理了六边形网格的交错排列：偶数列和奇数列在垂直方向上偏移半个六边形高度
 * @returns 包含所有六边形坐标点和唯一标识的数组
 */
const hexagons = shallowRef<HexagonItem[]>([]);
const centerPoints = shallowRef('');

let maskData = shallowReactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  textX: 0,
  textY: 0,
  transformOrigin: '',
});

const transformer = gsap.utils.pipe(
  gsap.utils.clamp(4, 100),
  gsap.utils.mapRange(4, 100, 0.1, 1),
  gsap.utils.snap(0.1),
);

let ctx: TypeWithNull<gsap.Context> = null;

const Colors = ['185, 52, 52', '166, 131, 42'];
const ShadowColor = '52, 211, 220';

const currColor = shallowRef(Colors[0]);

watch([() => progress, hexagons], ([newVal, currHexagons]) => {
  // console.log('wat progress', newVal)
  if (!loadingWrapperRef.value || !currHexagons.length) return;
  ctx = gsap.context(() => {
    const opacity = transformer(newVal);
    const colorIndex = Math.round(opacity);
    currColor.value = Colors[colorIndex];
    gsap.to('.hexagon', {
      duration: DebounceTime.middle / 1000,
      stroke: `rgba(${currColor.value}, ${opacity})`,
    });

    gsap.to('.loading-mask rect', {
      duration: DebounceTime.middle / 1000,
      attr: {
        transform: `scale(1 ${opacity})`,
        fill: `rgb(${currColor.value})`,
      },
    });
    if (newVal >= 100) {
      currColor.value = ShadowColor;
      const rgbShadowColor = `rgb(${ShadowColor})`;
      gsap.to('.loading-mask rect', {
        duration: DebounceTime.middle / 1000,
        attr: {
          fill: `rgb(${currColor.value})`,
        },
      });
      gsap.to('.hexagon', {
        duration: DebounceTime.slow / 1000,
        // strokeWidth: 3,
        stroke: rgbShadowColor,
        filter: `drop-shadow(2px 2px 2px ${rgbShadowColor}) drop-shadow(-2px -2px 2px ${rgbShadowColor})`,
        onComplete() {
          requestAnimationFrame(() => {
            gsap.to(['.loading-mask', '.hexagon-border'], {
              duration: DebounceTime.middle / 1000,
              scale: 0,
              autoAlpha: 0,
              transformOrigin: 'center',
            });
            gsap.to('.hexagon', {
              scale: 0,
              duration: DebounceTime.normal / 1000,
              transformOrigin: 'center',
              stagger: {
                each: 0.01,
                from: 'random',
              },
              onComplete() {
                gsap.to(loadingWrapperRef.value, {
                  duration: DebounceTime.quick / 1000,
                  autoAlpha: 0,
                  onComplete() {
                    emit('onHide');
                  },
                });
              },
            });
          });
        },
      });
    }
  }, loadingWrapperRef.value);
});

const handleResize = useThrottleFn(
  (width: number, height: number) => {
    console.log('wat size', width, height);
    if (!width || !height) return;
    /**
     * 计算六边形的基础大小
     * 根据窗口的最小维度（宽度或高度）动态调整
     * 确保六边形大小至少为20px，以保证视觉效果和交互可用性
     * @returns 六边形的基础大小（px）
     */
    const minDimension = Math.min(width, height);
    const hexSize = Math.max(40, minDimension / 10);

    /**
     * 计算六边形的宽度
     * 六边形的宽度是基础大小的2倍（从一个顶点到对面顶点的距离）
     * @returns 六边形的宽度（px）
     */
    const hexWidth = hexSize * 2;

    /**
     * 计算六边形的高度
     * 六边形的高度是基础大小乘以√3（从顶部边到底部边的垂直距离）
     * 这是正六边形的几何特性，保证了六边形之间的无缝排列
     * @returns 六边形的高度（px）
     */
    const hexHeight = Math.sqrt(3) * hexSize;

    /**
     * 计算网格的行数
     * 直接根据窗口高度和六边形高度计算所需的行数
     * 加2是为了确保边缘有额外的六边形，避免窗口边缘出现空白
     * @returns 网格的行数
     */
    const rows = Math.ceil(height / hexHeight) + 2;

    /**
     * 计算网格的列数
     * 考虑到六边形网格的交错排列特性，水平方向上每个六边形的实际占用宽度为hexWidth * 0.75
     * 加2是为了确保边缘有额外的六边形，避免窗口边缘出现空白
     * @returns 网格的列数
     */
    const cols = Math.ceil(width / (hexWidth * 0.75)) + 2;

    // console.log({
    //   hexSize: hexSize,
    //   hexWidth: hexWidth,
    //   hexHeight: hexHeight,
    // });

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // 计算当前六边形的X坐标偏移
        // 每个六边形水平间隔为hexWidth * 0.75（由于交错排列）
        const xOffset = col * hexWidth * 0.75;

        // 计算当前六边形的Y坐标偏移
        // 奇数列需要额外偏移半个六边形高度，实现交错排列效果
        const yOffset = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

        // 生成当前六边形的六个顶点坐标
        const points = getHexagonPoints(xOffset, yOffset, hexSize);

        const centered = row === Math.round((rows - 2) / 2) && col === Math.round((cols - 2) / 2);
        if (centered) {
          const x = xOffset - hexWidth / 2;
          const y = yOffset - hexHeight / 2;
          maskData = {
            width: hexWidth,
            height: hexHeight,
            x,
            y,
            textX: x + hexWidth / 2,
            textY: y + hexHeight / 2,
            transformOrigin: `${x} ${y + hexHeight}`,
          };
          // console.log({ maskData });
          centerPoints.value = points.map((p) => p.join(',')).join(' ');
        }
        hexagons.value.push({
          key: `${row}-${col}`,
          points,
          centered,
        });
      }
    }
  },
  DebounceTime.middle,
  true,
);

watch([width, height], ([newWidth, newHeight]) => {
  if (!canUseDOM()) return;
  console.log({ newWidth, newHeight });
  handleResize(newWidth, newHeight);
});

const allAniCls = {
  common: 'animate__animated',
  down: 'animate__fadeInDown',
  right: 'animate__fadeInRight',
};

onMounted(() => {
  if (!loadingWrapperRef.value || !loadingRef.value) return;
  const aniCls = direction === 'down' ? allAniCls.down : allAniCls.right;
  if (trigger === 'initial') {
    loadingRef.value?.classList.add(allAniCls.common, aniCls);
  } else {
    loadingWrapperRef.value.classList.add(allAniCls.common, aniCls);
  }
});

onUnmounted(() => {
  stop();
  ctx?.revert();
});
</script>

<style lang="scss">
.loading-wrapper {
  --animate-duration: 1s;

  position: absolute;
  inset: 0;
  z-index: 6;
  background: #1a1a2e;
}
</style>
