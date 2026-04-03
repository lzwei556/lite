import { AlarmLevel } from 'features/alarm/alarmLevel';
import { Field } from 'types';
import { pickOptionsFromNumericEnum } from 'utils';
import { GroupField } from './group';

const millisecond = 1000;

const SAMPLING_PERIOD = [
  {
    value: 60 * millisecond,
    label: 'OPTION_1_MINUTE'
  },
  {
    value: 2 * 60 * millisecond,
    label: 'OPTION_2_MINUTES'
  },
  {
    value: 2.5 * 60 * millisecond,
    label: 'OPTION_2_5_MINUTES'
  },
  {
    value: 5 * 60 * millisecond,
    label: 'OPTION_5_MINUTES'
  },
  {
    value: 10 * 60 * millisecond,
    label: 'OPTION_10_MINUTES'
  },

  {
    value: 15 * 60 * millisecond,
    label: 'OPTION_15_MINUTES'
  },
  {
    value: 20 * 60 * millisecond,
    label: 'OPTION_20_MINUTES'
  },
  {
    value: 30 * 60 * millisecond,
    label: 'OPTION_30_MINUTES'
  },
  {
    value: 60 * 60 * millisecond,
    label: 'OPTION_1_HOUR'
  },
  {
    value: 2 * 60 * 60 * millisecond,
    label: 'OPTION_2_HOURS'
  },
  {
    value: 4 * 60 * 60 * millisecond,
    label: 'OPTION_4_HOURS'
  },
  {
    value: 6 * 60 * 60 * millisecond,
    label: 'OPTION_6_HOURS'
  },
  {
    value: 8 * 60 * 60 * millisecond,
    label: 'OPTION_8_HOURS'
  },
  {
    value: 12 * 60 * 60 * millisecond,
    label: 'OPTION_12_HOURS'
  },
  {
    value: 24 * 60 * 60 * millisecond,
    label: 'OPTION_24_HOURS'
  }
];

const SAMPLING_OFFSET = [
  {
    value: 0,
    label: 'NONE'
  },
  {
    value: 10 * millisecond,
    label: 'OPTION_10_SECONDS'
  },
  {
    value: 30 * millisecond,
    label: 'OPTION_30_SECONDS'
  },
  {
    value: 60 * millisecond,
    label: 'OPTION_1_MINUTE'
  },
  {
    value: 2 * 60 * millisecond,
    label: 'OPTION_2_MINUTES'
  },
  {
    value: 5 * 60 * millisecond,
    label: 'OPTION_5_MINUTES'
  },
  {
    value: 10 * 60 * millisecond,
    label: 'OPTION_10_MINUTES'
  },
  {
    value: 20 * 60 * millisecond,
    label: 'OPTION_20_MINUTES'
  },
  {
    value: 30 * 60 * millisecond,
    label: 'OPTION_30_MINUTES'
  },
  {
    value: 60 * 60 * millisecond,
    label: 'OPTION_1_HOUR'
  },
  {
    value: 2 * 60 * 60 * millisecond,
    label: 'OPTION_2_HOURS'
  },
  {
    value: 4 * 60 * 60 * millisecond,
    label: 'OPTION_4_HOURS'
  },
  {
    value: 6 * 60 * 60 * millisecond,
    label: 'OPTION_6_HOURS'
  },
  {
    value: 8 * 60 * 60 * millisecond,
    label: 'OPTION_8_HOURS'
  },
  {
    value: 12 * 60 * 60 * millisecond,
    label: 'OPTION_12_HOURS'
  },
  {
    value: 16 * 60 * 60 * millisecond,
    label: 'OPTION_16_HOURS'
  },
  {
    value: 20 * 60 * 60 * millisecond,
    label: 'OPTION_20_HOURS'
  }
];

type FlangeSettings = {
  index: number;
  type: number;
  normal: { enabled: boolean; value?: number };
  initial: { enabled: boolean; value?: number };
  info: { enabled: boolean; value?: number };
  warn: { enabled: boolean; value?: number };
  danger: { enabled: boolean; value?: number };
  sub_type: number;
  monitoring_points_num: number;
  sample_period: number;
  sample_time_offset: number;
  initial_preload: number;
  initial_pressure: number;
};

enum Type {
  Tower = 1,
  Blade,
  HubAndNacelle,
  PitchBearing
}

const PREFIX = 'flange.type';

export type FlangeSettingsField = Omit<Field<FlangeSettings>, 'group'> &
  GroupField & {
    visibleWhen?: (values?: { sub_type?: number }) => boolean;
  };

export const flangeFields: FlangeSettingsField[] = [
  {
    label: PREFIX,
    name: 'type',
    description: '',
    type: 'enum',
    options: pickOptionsFromNumericEnum(Type, PREFIX)
  },
  {
    label: 'INDEX_NUMBER',
    name: 'index',
    description: '',
    type: 'enum',
    options: Array(5)
      .fill(0)
      .map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  },
  { label: 'RATING', name: 'normal', nameMode: 'mixed', description: '', type: 'number-switcher' },
  {
    label: 'INITIAL_VALUE',
    name: 'initial',
    nameMode: 'mixed',
    description: '',
    type: 'number-switcher'
  },
  {
    label: `leveled.alarm.${AlarmLevel.Minor}`,
    name: 'info',
    nameMode: 'mixed',
    description: '',
    type: 'number-switcher'
  },
  {
    label: `leveled.alarm.${AlarmLevel.Major}`,
    name: 'warn',
    nameMode: 'mixed',
    description: '',
    type: 'number-switcher'
  },
  {
    label: `leveled.alarm.${AlarmLevel.Critical}`,
    name: 'danger',
    nameMode: 'mixed',
    description: '',
    type: 'number-switcher'
  },
  {
    label: 'CALCULATE_FLANGE_PRELOAD',
    name: 'sub_type',
    description: '',
    type: 'boolean',
    options: [
      { label: 'ENABLED', value: 1 },
      { label: 'DISABLED', value: 0 }
    ],
    defaultValue: 0
  },
  {
    label: 'NUMBER_OF_BOLT',
    name: 'monitoring_points_num',
    description: '',
    type: 'number',
    visibleWhen: (values) => values?.sub_type === 1
  },
  {
    label: 'SAMPLING_PERIOD',
    name: 'sample_period',
    description: '',
    type: 'enum',
    options: SAMPLING_PERIOD,
    visibleWhen: (values) => values?.sub_type === 1
  },
  {
    label: 'SAMPLING_OFFSET',
    name: 'sample_time_offset',
    description: '',
    type: 'enum',
    options: SAMPLING_OFFSET,
    visibleWhen: (values) => values?.sub_type === 1
  },
  {
    label: 'INITIAL_PRELOAD',
    name: 'initial_preload',
    description: '',
    type: 'number',
    unit: 'kN',
    visibleWhen: (values) => values?.sub_type === 1
  },
  {
    label: 'INITIAL_STRESS',
    name: 'initial_pressure',
    description: '',
    type: 'number',
    unit: 'MPa',
    visibleWhen: (values) => values?.sub_type === 1
  }
];
