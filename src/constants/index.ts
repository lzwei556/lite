import { buildPeriodOption } from 'locales/utils';

export const SAMPLING_PERIOD_2 = [
  buildPeriodOption(1, 'minute'),
  buildPeriodOption(2, 'minute'),
  buildPeriodOption(2.5, 'minute'),
  buildPeriodOption(5, 'minute'),
  buildPeriodOption(10, 'minute'),
  buildPeriodOption(15, 'minute'),
  buildPeriodOption(20, 'minute'),
  buildPeriodOption(30, 'minute'),
  buildPeriodOption(1, 'hour'),
  buildPeriodOption(2, 'hour'),
  buildPeriodOption(4, 'hour'),
  buildPeriodOption(6, 'hour'),
  buildPeriodOption(8, 'hour'),
  buildPeriodOption(12, 'hour'),
  buildPeriodOption(24, 'hour')
];

export const SAMPLING_OFFSET = [
  buildPeriodOption(),
  buildPeriodOption(10, 'second'),
  buildPeriodOption(30, 'second'),
  buildPeriodOption(1, 'minute'),
  buildPeriodOption(2, 'minute'),
  buildPeriodOption(5, 'minute'),
  buildPeriodOption(10, 'minute'),
  buildPeriodOption(20, 'minute'),
  buildPeriodOption(30, 'minute'),
  buildPeriodOption(1, 'hour'),
  buildPeriodOption(2, 'hour'),
  buildPeriodOption(4, 'hour'),
  buildPeriodOption(6, 'hour'),
  buildPeriodOption(8, 'hour'),
  buildPeriodOption(12, 'hour'),
  buildPeriodOption(16, 'hour'),
  buildPeriodOption(20, 'hour')
];
