import { isLanguageChinese, LanguageCode } from 'providers/i18n';
import intl from 'react-intl-universal';
import { toPascal } from 'ts-case-convert';

export const get = (key: string, variables?: any) => {
  if (!key || key.length === 0) {
    return '';
  }
  return intl.get(key, variables).d(key);
};

const doSth = (action: string, something: string) =>
  get('label.icu.title.do-sth', {
    action: get(action),
    something: get(something)
  });

const pleaseDoSth = (action: string, something: string) =>
  camelSentence(
    get('label.icu.do-sth.please', {
      action: get(action),
      something: get(something)
    })
  );

export const Translation = {
  get,
  doSth,
  between: (first: string, last: string) =>
    get('label.icu.title.between', { first: get(first), last: toPascal(get(last)) }),
  createSth: (sth: string) => doSth('common.action.create', sth),
  editSth: (sth: string) => doSth('common.action.edit', sth),
  leveledAlarm: (level: string) => get('label.icu.title.leveled-alarm', { level: get(level) }),
  pleaseDoSth,
  pleaseEnterSth: (sth: string) => pleaseDoSth('common.action.enter', sth),
  failureDo: (action: string) =>
    camelSentence(get('label.icu.do-sth.failed', { action: get(action) }))
};

const camelSentence = (s: string) => {
  const symbol = ' ';
  return s
    .split(symbol)
    .map((l, i) => (i !== 0 ? l.toLowerCase() : l))
    .join(symbol);
};

export type PeriodOptionLabel = [label: string, variables?: object];

type Unit = 'millisecond' | 'second' | 'minute' | 'hour';

const UNIT_TO_MS: Record<Unit, number> = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000
};

export const convertKeyFromServer = (key: string): PeriodOptionLabel | string => {
  if (!key) {
    return key;
  }

  if (key === 'UNIT_DAY') {
    return 'label.unit.day';
  }

  return transform2PeriodOption(transform2AxisOption(key));
};

/**
 * Convert OPTION_* to period label
 * Examples:
 * OPTION_10_SECONDS
 * OPTION_1_MINUTE
 * OPTION_5_MINUTES
 * OPTION_4_HOURS
 * OPTION_2_5_MINUTES (2.5 minutes)
 */
const transform2PeriodOption = (option: string): PeriodOptionLabel | string => {
  if (option === 'OPTION_NONE') {
    return ['common.none'];
  }

  const reg = /^OPTION_(\d+(?:_\d+)?)_(MILLISECOND|SECOND|MINUTE|HOUR)S?$/;

  const match = option.match(reg);

  if (!match) {
    return option;
  }

  const [, valueStr, unitStr] = match;

  // support 2_5 → 2.5
  const value = parseFloat(valueStr.replace('_', '.'));

  const unit = unitStr.toLowerCase() as Unit;

  return buildLabel(value, unit);
};

/**
 * Convert axis option
 * OPTION_AXIS_X → label.axis.x
 * AXIS_XYZ → label.axis.xyz
 */
const transform2AxisOption = (option: string): string => {
  const reg = /^(OPTION_)?AXIS_(XYZ|[XYZ])$/;

  if (!reg.test(option)) {
    return option;
  }

  const cleaned = option.startsWith('OPTION_') ? option.slice(7) : option;

  const [, axis] = cleaned.split('_');

  return `label.axis.${axis.toLowerCase()}`;
};

export const buildPeriodOption = (
  value?: number,
  unit?: Unit
): { label: PeriodOptionLabel; value: number } => {
  if (value !== undefined && unit !== undefined) {
    const ms = UNIT_TO_MS[unit];

    return {
      label: buildLabel(value, unit),
      value: value * ms
    };
  }

  return {
    label: ['common.none'],
    value: 0
  };
};

const buildLabel = (value: number, unit: Unit): PeriodOptionLabel => {
  return [`label.icu.period.${unit}`, { value }];
};

export function getDisplayName({
  name,
  lang,
  suffix
}: {
  name: string;
  lang: LanguageCode;
  suffix?: string;
}) {
  const isChinese = isLanguageChinese(lang);
  const braceLeft = isChinese ? '（' : ' (';
  const braceRight = isChinese ? '）' : ')';
  if (suffix) {
    return `${name}${braceLeft}${suffix}${braceRight}`;
  } else {
    return name;
  }
}
