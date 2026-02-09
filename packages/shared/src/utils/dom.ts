/* eslint-disable no-console */
import type { ClientCoordinate, TypeWithNull, TypeWithUndefined, PointEventType } from '../typings';

export function removePx(value: string) {
  return value ? +value.slice(0, -2) : 0;
}

export function setStyleProps(dom: HTMLElement, properties: Record<string, string>) {
  const props = Object.entries(properties);
  if (dom && props.length) {
    props.forEach(([key, value]) => {
      dom.style.setProperty(key, value);
    });
  }
}

export function closest(el: HTMLElement, selector: string) {
  let result: TypeWithNull<HTMLElement> = null;
  while (el && !result) {
    if (el?.matches && el.matches(selector)) {
      result = el;
    }
    el = el.parentNode as HTMLElement;
  }
  return result;
}

export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export function changeHtmlTagLang(lang: string) {
  if (canUseDOM()) {
    document.documentElement.lang = lang;
  }
}

function getClientCoordinateFromTouchList(touches: TouchList): TypeWithUndefined<ClientCoordinate> {
  if (touches.length === 0) {
    return undefined;
  }

  const touch = touches.item(0);
  if (!touch) {
    return undefined;
  }

  return {
    clientX: touch.clientX,
    clientY: touch.clientY,
  };
}

export const getClientCoordinateFromEvent = (
  event: PointEventType,
): TypeWithUndefined<ClientCoordinate> => {
  if ('clientX' in event && 'clientY' in event) {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  if ('touches' in event) {
    const touch = getClientCoordinateFromTouchList(event.touches);

    if (touch) {
      return touch;
    }
  }

  // This occurs if the last finger is lifted from the screen.
  if ('changedTouches' in event) {
    const touch = getClientCoordinateFromTouchList(event.changedTouches);

    if (touch) {
      return touch;
    }
  }

  return undefined;
};

export function moveToIndex(
  element: HTMLElement,
  targetIndex: number,
  container?: HTMLElement,
): boolean {
  try {
    const parent = container || (element.parentNode as HTMLElement);
    if (!parent) {
      return false;
    }

    const children = Array.from(parent.children) as HTMLElement[];

    const currentIndex = children.indexOf(element);
    if (currentIndex === -1) {
      return false;
    }

    let normalizedTargetIndex = targetIndex;
    if (targetIndex < 0) {
      normalizedTargetIndex = Math.max(0, children.length + targetIndex);
    }
    normalizedTargetIndex = Math.min(normalizedTargetIndex, children.length - 1);

    if (currentIndex === normalizedTargetIndex) {
      return true;
    }

    if (normalizedTargetIndex > currentIndex) {
      if (normalizedTargetIndex === children.length - 1) {
        parent.appendChild(element);
      } else {
        const referenceElement = children[normalizedTargetIndex + 1]!;
        parent.insertBefore(element, referenceElement);
      }
    } else {
      const referenceElement = children[normalizedTargetIndex]!;
      parent.insertBefore(element, referenceElement);
    }

    return true;
  } catch (error) {
    console.error('移动DOM元素失败:', error);
    return false;
  }
}

export interface Position {
  x: number;
  y: number;
}

/**
 * 计算元素与原点之间的夹角（CSS坐标系）
 *
 * @param elementPoint - 目标元素或坐标点
 * @param originPoint - 原点元素或坐标点，默认为 CSS 坐标系原点 (0, 0)
 * @param options - 配置选项
 * @returns 弧度值
 */
export function calculateRadian(
  elementPoint: Position,
  originPoint: Position = { x: 0, y: 0 },
): number {
  const dx = elementPoint.x - originPoint.x;
  const dy = elementPoint.y - originPoint.y;

  // 处理零向量情况（两点重合）
  if (dx === 0 && dy === 0) {
    return 0;
  }

  return Math.atan2(dy, dx);
}
/**
 * 将弧度转换为度数
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * 将度数转换为弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 判断当前设备width和height哪个更大，如果width > height, 返回horizontal, 否则返回vertical
export function getScreenOrientation() {
  return canUseDOM() ? (window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical') : '';
}
