import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(timezone);

export type Range = [number, number];
export type RangeValue = [dayjs.Dayjs, dayjs.Dayjs];

export { dayjs };

export type Dayjs = dayjs.Dayjs;

export function format(timestamp: number, format = 'YYYY-MM-DD HH:mm:ss') {
  return toDate(timestamp).format(format);
}

export function toRangeValue(range: Range) {
  return range.map(toDate) as RangeValue;
}

export function toRange(range: RangeValue) {
  return range.map(toTimestamp) as Range;
}

export function toDate(timestamp: number) {
  return dayjs.unix(timestamp).local();
}

export function toTimestamp(date: Dayjs) {
  return date.utc().unix();
}

export function getRange(value: number, unit: dayjs.ManipulateType): RangeValue {
  return [dayjs().startOf('day').subtract(value, unit), dayjs().endOf('day')];
}

export const CommonRange = {
  PastWeek: getRange(6, 'days'),
  PastHalfMonth: getRange(13, 'days'),
  PastMonth: getRange(1, 'months'),
  PastThreeMonths: getRange(3, 'months'),
  PastHalfYear: getRange(6, 'months'),
  PastYear: getRange(1, 'years')
};
