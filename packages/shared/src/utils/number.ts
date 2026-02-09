import { Decimal } from 'decimal.js';

export function minmax(value: number, range: [number, number]) {
  const validValue = value || 0;
  return Math.max(Math.min(validValue, range[1]), range[0]);
}

export function calculatePercentage(value: number, total: number): number {
  if (
    typeof value !== 'number' ||
    typeof total !== 'number' ||
    isNaN(value) ||
    isNaN(total) ||
    total <= 0 ||
    value < 0
  ) {
    return 0;
  }

  if (value > total) {
    return 100;
  }

  const percentage = Math.round((value / total) * 100);

  return Math.min(100, Math.max(0, percentage));
}

export function safeAdd(numbers: number[]) {
  const base = new Decimal(0);
  return numbers.reduce((total, num) => total.plus(num), base).toNumber();
}

interface SafeDivideParams {
  dividend: number;
  divisor: number;
  precision?: number; // 修改为数字类型，表示小数位数
  rounding?: Decimal.Rounding; // 添加专门的舍入模式参数
}

export function safeDivide({
  dividend,
  divisor,
  precision = 1, // 默认1位小数
  rounding = Decimal.ROUND_DOWN, // 默认向下舍入
}: SafeDivideParams) {
  if (divisor === 0) throw new Error('Division by zero');

  // 设置Decimal的配置
  const originalRounding = Decimal.rounding; // 保存原始配置
  Decimal.set({ rounding }); // 设置舍入模式

  try {
    // 执行除法运算并使用toFixed来保留指定的小数位数
    // 先转换为字符串，再转回数字以保持精度
    const result = new Decimal(dividend).div(divisor);
    return Number(result.toFixed(precision));
  } finally {
    // 恢复原始配置，避免影响其他计算
    Decimal.set({ rounding: originalRounding });
  }
}

interface IntersectionPointParams {
  deg: number;
  width: number;
  height: number;
}

// 求与长方形边界的第一个交点
export function findFirstIntersectionPointWithDecimal({
  deg,
  width,
  height,
}: IntersectionPointParams) {
  const halfW = new Decimal(width).div(2);
  const halfH = new Decimal(height).div(2);
  const rad = new Decimal(deg).mul(Math.PI).div(180);
  const cosRad = rad.cos();
  const sinRad = rad.sin();

  // 2. 存储有效交点（格式：{t: Decimal, x: Decimal, y: Decimal}）
  const validPoints = [];

  // 3. 计算与左边（x = -halfW）的交点
  if (!cosRad.isZero()) {
    // 判断cosRad是否为0
    const t = halfW.neg().div(cosRad); // t = (-300) / cosRad
    if (t.gt(0)) {
      // t>0
      const y = t.mul(sinRad); // y = t*sinRad
      // 验证y是否在[-halfH, halfH]之间
      if (y.gte(halfH.neg()) && y.lte(halfH)) {
        validPoints.push({ t, x: halfW.neg(), y });
      }
    }
  }

  // 4. 计算与右边（x = halfW）的交点
  if (!cosRad.isZero()) {
    // 判断cosRad是否为0
    const t = halfW.div(cosRad); // t = (300) / cosRad
    if (t.gt(0)) {
      // t>0
      const y = t.mul(sinRad); // y = t*sinRad
      // 验证y是否在[-halfH, halfH]之间
      if (y.gte(halfH.neg()) && y.lte(halfH)) {
        validPoints.push({ t, x: halfW, y });
      }
    }
  }

  // 5. 计算与上边（y = -halfH）的交点
  if (!sinRad.isZero()) {
    // 精确判断sinRad是否为0（无需epsilon）
    const t = halfH.neg().div(sinRad); // t = (-400) / sinRad
    if (t.gt(0)) {
      // t>0
      const x = t.mul(cosRad); // x = t*cosRad
      // 验证x是否在[-halfW, halfW]之间
      if (x.gte(halfW.neg()) && x.lte(halfW)) {
        validPoints.push({ t, x, y: halfH.neg() });
      }
    }
  }

  // 6. 计算与下边（y = halfH）的交点
  if (!sinRad.isZero()) {
    // 精确判断sinRad是否为0
    const t = halfH.div(sinRad); // t = (400) / sinRad
    if (t.gt(0)) {
      // t>0
      const x = t.mul(cosRad); // x = t*cosRad
      // 验证x是否在[-halfW, halfW]之间
      if (x.gte(halfW.neg()) && x.lte(halfW)) {
        validPoints.push({ t, x, y: halfH });
      }
    }
  }

  // 7. 找到t值最小的交点（率先相交）
  if (validPoints.length === 0) return null;
  let firstPoint = null;
  let minT = new Decimal(Infinity);
  for (const point of validPoints) {
    if (point.t.lt(minT)) {
      minT = point.t;
      firstPoint = {
        x: point.x.toNumber(),
        y: point.y.toNumber(),
      };
    }
  }

  return firstPoint;
}
