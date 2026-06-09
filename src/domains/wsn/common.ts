import { Field } from 'types';

export const millisecond = 1000;

export enum ProvisioningMode {
  Group = 1,
  TimeDivision,
  Continuous,
  ManagedBroadcast,
  UnManagedBroadcast
}

export type WSN = {
  provisioningMode: ProvisioningMode;
  majorCommunicationPeriod?: number;
  communicationPeriod: number;
  communicationPeriod2: number;
  communicationOffset: number;
  groupSize: number;
  groupSize2: number;
  intervalCnt: number;
};

export const WSN_SETTINGS_DEFAULT: WSN = {
  provisioningMode: ProvisioningMode.TimeDivision,
  communicationPeriod: 20 * 60 * 1000,
  communicationPeriod2: 0,
  communicationOffset: 10000,
  groupSize: 4,
  groupSize2: 1,
  intervalCnt: 1
};

const rest = [
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
  }
];

export const getCommunicationPeriodOptions = (mode?: ProvisioningMode) => {
  return mode === ProvisioningMode.TimeDivision
    ? [
        {
          value: 5 * 60 * millisecond,
          label: 'OPTION_5_MINUTES'
        },
        ...rest
      ]
    : [
        {
          value: 4 * 60 * millisecond,
          label: 'OPTION_4_MINUTES'
        },
        ...rest
      ];
};

export const resetInvalidCommunicationPeriod = (
  communicationPeriod?: number,
  mode?: ProvisioningMode
) => {
  const isValid =
    communicationPeriod &&
    getCommunicationPeriodOptions(mode)
      .map(({ value }) => value)
      .includes(communicationPeriod);
  return isValid ? communicationPeriod : WSN_SETTINGS_DEFAULT.communicationPeriod;
};

export const SecondaryCommunicationPeriodOptions = [
  {
    value: 0,
    label: 'NONE'
  },
  ...rest,
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
  }
];

export const Fields = {
  ProvisioningMode: {
    name: 'provisioningMode',
    label: 'provisioning.mode',
    description: 'provisioning.mode.desc',
    type: 'enum'
  } as Field<WSN>,
  CommunicationOffset: {
    name: 'communicationOffset',
    label: 'communication.offset',
    description: 'communication.offset.desc',
    type: 'enum'
  } as Field<WSN>,
  IntervalCnt: {
    name: 'intervalCnt',
    label: 'interval.cnt',
    description: 'interval.cnt.desc',
    type: 'number'
  } as Field<WSN>,
  GroupSize: {
    name: 'groupSize',
    label: 'group.size',
    description: 'group.size.desc',
    type: 'enum'
  } as Field<WSN>,
  GroupSize2: {
    name: 'groupSize2',
    label: 'group.size.2',
    description: 'group.size.2.desc',
    type: 'number'
  } as Field<WSN>
};
