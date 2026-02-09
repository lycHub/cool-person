import dayjs, { type ConfigType, type Dayjs } from 'dayjs';

import { DateFormat } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toDayjs(value: any) {
  return dayjs(value).isValid() ? dayjs(value) : undefined;
}

export function formatDate(date: ConfigType, gs = DateFormat) {
  return date && dayjs(date).isValid() ? dayjs(date).format(gs) : '';
}

export function reviewDate(date?: string) {
  return date && dayjs(date).isValid() ? dayjs(date) : undefined;
}

export function formatRangeDate(dates: Dayjs[], gs = DateFormat) {
  const startDate = dates[0] ? formatDate(dates[0].startOf('d'), gs) : '';
  const endDate = dates[1] ? formatDate(dates[1].endOf('d'), gs) : '';
  return { startDate, endDate };
}

export function formatRangeDate1(dates: Dayjs[], gs = DateFormat) {
  const startDate = dates?.[0] ? formatDate(dayjs(dates[0]).startOf('d'), gs) : '';
  const endDate = dates?.[1] ? formatDate(dayjs(dates[1]).startOf('d'), gs) : '';
  return { startDate, endDate };
}

export function getFiscalYearRange(count = 1) {
  const now = dayjs();

  // 计算基础财年的开始日期（当前财年的10月1日）
  const baseFiscalYearStart = now.startOf('year').add(9, 'month').date(1);

  // 计算需要回溯的年数：当count=1时回溯0年，count=2时回溯1年，以此类推
  const yearsToSubtract = count > 1 ? count - 1 : 0;

  // 计算开始日期：回溯yearsToSubtract年的10月1日
  const start = baseFiscalYearStart.subtract(yearsToSubtract, 'year');

  // 计算结束日期：当前财年的结束日期（次年9月30日）加上回溯的年数
  const end = now.endOf('year').add(9, 'month').date(30);

  return { start, end };
}

/* 
根据开始时间和结束时间，返回所有月份的数组
*/

export function getMonthsByDateRange({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const months: Dayjs[] = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    months.push(current);
    current = current.add(1, 'month');
  }
  return months;
}
