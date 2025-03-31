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
  return dayjs.unix(timestamp).local().format(format);
}

export function toTimestamp(date: Dayjs) {
  return date.utc().unix();
}

export function toDayjs(timestamp: number) {
  return dayjs.unix(timestamp).utc();
}

export function toRange(range: RangeValue) {
  return range.map((r) => toTimestamp(r)) as Range;
}
