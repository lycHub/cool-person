<template>
  <svg
    ref="svgRef"
    :viewBox="initialViewbox()"
    width="1em"
    :height="AspectRatio + 'em'"
    class="spring-mobile"
  >
    <circle cx="200" cy="0" r="6" fill="#9ca3af" />

    <path ref="springRef" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" />

    <g
      ref="mobileRef"
      fill="none"
      style="cursor: grab;"
      @pointerdown="onPointerDown"
      @touchstart="disableNativeAction"
    >
      <path
        fill="url(#SVGIDUMNdqL)"
        d="M-20 0 A6 6 0 0 0 -26 6 v70 A6 6 0 0 0 -20 82 h40 a6 6 0 0 0 6-6 v-70 A6 6 0 0 0 20 0z"
      />
      <path fill="#fff" d="M-10 70 h20 a2 2 0 0 1 0 4 h-20 a2 2 0 0 1 0-4" />
      <defs>
        <radialGradient
          id="SVGIDUMNdqL"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(51.6666 96.5328 -188.5454 99.8482 -26 11)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#06b6d4" />
          <stop offset=".412" stop-color="#22d3ee" />
          <stop offset="1" stop-color="#67e8f9" />
        </radialGradient>
      </defs>
    </g>
  </svg>
</template>

<script setup lang="ts">
import {
  emptyFunc,
  getClientCoordinateFromEvent,
  minmax,
  radiansToDegrees,
  type PointEventType,
  type TypeWithNull,
} from '@personal/shared';
import { isClient, useIntersectionObserver } from '@vueuse/core';
import { onMounted, onUnmounted, shallowReactive, useTemplateRef } from 'vue';
import { logger } from '../utils';

// 正常宽度400
const OneMultipleWidth = 400;
const AspectRatio = 0.75;

const initialViewbox = () => `0 0 ${OneMultipleWidth} ${OneMultipleWidth * AspectRatio}`;

// 物理常量定义
const ANCHOR_X = 200; // 锚点X坐标
const ANCHOR_Y = 0; // 锚点Y坐标
const PENDULUM_LENGTH = 120; // 弹簧自然长度(不受力时的长度)
const SPRING_COILS = 10; // 弹簧圈数

const GRAVITY = 9.8; // 重力加速度
const MASS = 1; // 质量

const VELOCITY_THRESHOLD = 0.0002;

const ANGULAR_DAMPING = 0.96; // 角阻尼系数（增加阻尼，减少振荡时间）
const SPRING_STIFFNESS = 0.3; // 弹簧刚度系数（增加刚度，使弹簧更快回到平衡位置）
const SPRING_DAMPING = 0.8; // 弹簧阻尼系数（增加阻尼，减少弹簧振荡时间）

let animationId: TypeWithNull<number> = null;

// SVG元素引用
const svgRef = useTemplateRef<SVGSVGElement>('svgRef');
const springRef = useTemplateRef<SVGPathElement>('springRef');
const mobileRef = useTemplateRef<SVGGElement>('mobileRef');

const getStaticState = () => ({
  angle: 0, // 当前角度
  angularVelocity: 0, // 角速度
  position: { x: ANCHOR_X, y: ANCHOR_Y + PENDULUM_LENGTH }, // 当前位置
  isDragging: false, // 是否正在拖动
  dragOffset: { x: 0, y: 0 }, // 拖动偏移量
  springLength: PENDULUM_LENGTH, // 弹簧当前长度
  springVelocity: 0, // 弹簧伸缩速度
});

const getHideState = () => ({
  angle: 1.575322570631617,
  angularVelocity: 0,
  position: {
    x: 389.9708499610887,
    y: -0.8598602607531802,
  },
  isDragging: false,
  dragOffset: {
    x: 8.029150038911297,
    y: 60.15634267281348,
  },
  springLength: 189.97279593301374,
  springVelocity: 0,
});

let visible = false;
let state = shallowReactive(getHideState());

let moveEventController: TypeWithNull<AbortController> = null;
let endEventController: TypeWithNull<AbortController> = null;

// 生成弹簧路径的函数
const generateSpringPath = () => {
  // 计算从锚点到当前位置的向量
  const dx = state.position.x - ANCHOR_X;
  const dy = state.position.y - ANCHOR_Y;
  // 弹簧长度
  // const length = Math.sqrt(dx * dx + dy * dy);
  // 计算弹簧角度
  const angle = Math.atan2(dy, dx);

  const amplitude = 8; // 弹簧振幅
  let path = `M ${ANCHOR_X} ${ANCHOR_Y}`; // 路径起始点（锚点）

  // 生成弹簧的螺旋路径
  for (let i = 1; i <= SPRING_COILS; i++) {
    const t = i / SPRING_COILS; // 归一化参数
    // 计算当前圈在直线上的基础位置
    const baseX = ANCHOR_X + dx * t;
    const baseY = ANCHOR_Y + dy * t;

    // 计算垂直于弹簧方向的偏移量
    const perpOffset = (i % 2 === 0 ? 1 : -1) * amplitude;
    const perpX = -Math.sin(angle) * perpOffset;
    const perpY = Math.cos(angle) * perpOffset;

    // 计算当前点的实际坐标
    const pointX = baseX + perpX;
    const pointY = baseY + perpY;

    // 添加路径段
    path += ` L ${pointX} ${pointY}`;
  }

  // 添加路径终点（移动部件位置）
  path += ` L ${state.position.x} ${state.position.y}`;
  return path; // 返回完整路径
};

// 更新物理状态的函数
const updatePhysics = () => {
  // 如果正在拖动，跳过物理计算
  if (state.isDragging) return;

  // 计算重力产生的扭矩（T = −mg * L * sinθ）
  const torque = -(MASS * GRAVITY) * state.springLength * Math.sin(state.angle);
  // 计算转动惯性(I = m * L²)
  const inertia = MASS * state.springLength ** 2;
  // 计算角加速度（牛顿第二定律：τ = I * α，即扭矩等于转动惯量乘以角加速度。）
  const angularAcceleration = torque / inertia;

  // 更新角速度
  state.angularVelocity += angularAcceleration;
  // 应用角阻尼（相当于摩擦力，使角加速度越来越小）
  state.angularVelocity *= ANGULAR_DAMPING;

  // 更新角度
  state.angle += state.angularVelocity;

  // 计算弹簧力（弹簧力遵循胡克定律：F = k * x，其中k是弹簧劲度系数，x是弹簧的形变量[当前长度与自然长度的差值]）
  const springForce = SPRING_STIFFNESS * (PENDULUM_LENGTH - state.springLength);

  // 弹力的加速度
  const sfa = springForce / MASS;

  // 更新弹簧伸缩速度
  state.springVelocity += sfa;
  // 应用弹簧阻尼
  state.springVelocity *= SPRING_DAMPING;
  // 更新弹簧长度
  state.springLength += state.springVelocity;

  // 根据角度和弹簧长度计算新位置
  state.position.x = ANCHOR_X + state.springLength * Math.sin(state.angle);
  state.position.y = ANCHOR_Y + state.springLength * Math.cos(state.angle);
};

const render = () => {
  if (mobileRef.value && springRef.value) {
    const angleDeg = radiansToDegrees(state.angle);
    springRef.value.setAttribute('d', generateSpringPath());
    mobileRef.value.style.transform = `translate(${state.position.x}px, ${state.position.y}px) rotate(${angleDeg}deg)`;
  }
};

const cleanup = () => {
  moveEventController?.abort();
  moveEventController = null;
  endEventController?.abort();
  endEventController = null;
};

const cleanAnimate = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const isMoving = () => {
  const angularSpeed = Math.abs(state.angularVelocity);
  const springSpeed = Math.abs(state.springVelocity);
  // console.log({ angularSpeed, springSpeed });
  return angularSpeed > VELOCITY_THRESHOLD || springSpeed > VELOCITY_THRESHOLD;
};

const animate = () => {
  updatePhysics();
  render();
  // console.log('moving', isMoving());
  if (isMoving()) {
    animationId = requestAnimationFrame(animate);
  } else if (animationId) {
    logger.log('clean ani');
    state = getStaticState();
    cleanAnimate();
    updatePhysics();
    render();
  }
};

const startAnimation = () => {
  if (animationId === null) {
    animationId = requestAnimationFrame(animate);
  }
};

let scale = 1;
let containerSize = {
  width: OneMultipleWidth,
  height: OneMultipleWidth * AspectRatio,
};

let pointerId: TypeWithNull<number> = null;

const disableNativeAction = (event: PointEventType) => {
  event.preventDefault();
  event.stopPropagation();
};

const onPointerDown = (event: PointEventType) => {
  disableNativeAction(event);
  const clientCoordinate = getClientCoordinateFromEvent(event);
  if (state.isDragging || !clientCoordinate) return;
  cleanAnimate();
  state.isDragging = true;
  const target = event.target as SVGAElement;
  const rect = svgRef.value!.getBoundingClientRect();

  const mouseX = (clientCoordinate.clientX - rect.left) * scale;
  const mouseY = (clientCoordinate.clientY - rect.top) * scale;

  // 拖动偏移量
  state.dragOffset.x = mouseX - state.position.x;
  state.dragOffset.y = mouseY - state.position.y;

  pointerId = (event as PointerEvent).pointerId;
  svgRef.value!.setPointerCapture(pointerId);
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

function moveHandler(event: PointerEvent) {
  disableNativeAction(event);
  const clientCoordinate = getClientCoordinateFromEvent(event);
  if (!state.isDragging || !clientCoordinate) return;
  // console.log('moveHandler');
  const rect = svgRef.value!.getBoundingClientRect();

  // 限制边界
  const mouseX = minmax((event.clientX - rect.left) * scale, [0, containerSize.width]);
  const mouseY = minmax((event.clientY - rect.top) * scale, [
    0,
    containerSize.height * AspectRatio,
  ]);

  // 计算新位置
  const posX = mouseX - state.dragOffset.x;
  const posY = mouseY - state.dragOffset.y;

  // 计算从锚点到新位置的向量
  const dx = posX - ANCHOR_X;
  const dy = posY - ANCHOR_Y;

  // 计算距离和角度
  const distance = Math.sqrt(dx * dx + dy * dy);
  const newAngle = Math.atan2(dx, dy);

  state.angularVelocity = 0;
  state.angle = newAngle;
  state.springLength = distance;
  state.springVelocity = 0;
  state.position.x = posX;
  state.position.y = posY;
  animate();
}

const endHandler = () => {
  state.isDragging = false;
  state.springVelocity = 0;
  cleanup();
  if (pointerId) {
    svgRef.value!.releasePointerCapture(pointerId);
    pointerId = null;
  }
  // console.log({ state2: state });
  cleanAnimate();
  startAnimation();
};

const { stop } = isClient
  ? useIntersectionObserver(
      svgRef,
      ([entry]) => {
        // 在部分移动端浏览器（尤其是 iOS Safari）上，SVG 的 intersectionRatio 可能被错误计算为相对 viewport 的比值，
        // 导致只能得到很小的数值。基于矩形面积手动计算可视比例更准确。
        let ratio = entry?.intersectionRatio || 0;
        if (entry) {
          const br = entry.boundingClientRect;
          const ir = entry.intersectionRect;
          const brArea = Math.max(0, br.width) * Math.max(0, br.height);
          const irArea = Math.max(0, ir.width) * Math.max(0, ir.height);
          if (brArea > 0) {
            ratio = Math.min(1, irArea / brArea);
          }
        }
        // console.log({ratio});
        if (ratio >= 0.6) {
          if (!visible) {
            svgRef.value!.style.visibility = 'visible';
            visible = true;
            startAnimation();
          }
        }
      },
      {
        // 使用更细粒度的阈值，确保在比值变化时能收到回调（移动端上不会等到 1 再触发）
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      },
    )
  : {
      stop: emptyFunc,
    };

onMounted(() => {
  const container = svgRef.value;
  if (container) {
    containerSize = {
      width: container.clientWidth,
      height: container.clientHeight,
    };
    scale = OneMultipleWidth / container.clientWidth;
  }
  render();
});

onUnmounted(() => {
  cleanup();
  cleanAnimate();
  stop();
});
</script>

<style lang="scss" scoped>
.spring-mobile {
  visibility: hidden;
  overflow: visible;
  user-select: none;
}
</style>
