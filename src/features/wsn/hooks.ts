import React from 'react';
import intl from 'react-intl-universal';
import { objectToCamel, objectToSnake, ObjectToSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum } from '../../utils';
import { millisecond } from '../../constants';
import { Field } from '../../types';
import { useFormItemBindingsProps } from '../../hooks';

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

export type WSNDTO = {
  exported: Exported;
  update: Update;
  network: Network;
};

type Exported = ObjectToSnake<WSN>;
type Update = {
  mode: ProvisioningMode;
  wsn: Omit<Exported, 'provisioning_mode'>;
};
type Network = { mode: ProvisioningMode } & Omit<WSN, 'provisioningMode'>;

const WSN_DEFAULT_SETTINGS: WSN = {
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
  return isValid ? communicationPeriod : WSN_DEFAULT_SETTINGS.communicationPeriod;
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

export const transform = (initial?: WSNDTO['exported'] | WSNDTO['network']): WSN => {
  let wsn = WSN_DEFAULT_SETTINGS;
  if (initial) {
    if ('mode' in initial) {
      wsn = { ...initial, provisioningMode: initial.mode };
    } else {
      wsn = objectToCamel(initial);
    }
  }
  return fillEmptyToDefault(wsn);
};

export const transform2UpdateDTO = <T extends WSN>(wsn: T): WSNDTO['update'] => {
  const {
    provisioningMode,
    communicationPeriod,
    communicationPeriod2,
    communicationOffset,
    intervalCnt,
    groupSize,
    groupSize2,
    ...rest
  } = fillEmptyToDefault(wsn);
  return {
    ...rest,
    mode: provisioningMode,
    wsn: objectToSnake({
      communicationPeriod,
      communicationPeriod2,
      communicationOffset,
      intervalCnt,
      groupSize,
      groupSize2
    })
  };
};

const fillEmptyToDefault = <T extends WSN>(wsn: T): WSN => {
  const {
    provisioningMode = WSN_DEFAULT_SETTINGS.provisioningMode,
    communicationPeriod = WSN_DEFAULT_SETTINGS.communicationPeriod,
    communicationPeriod2 = WSN_DEFAULT_SETTINGS.communicationPeriod2,
    communicationOffset = WSN_DEFAULT_SETTINGS.communicationOffset,
    intervalCnt = WSN_DEFAULT_SETTINGS.intervalCnt,
    groupSize = WSN_DEFAULT_SETTINGS.groupSize,
    groupSize2 = WSN_DEFAULT_SETTINGS.groupSize2,
    ...rest
  } = wsn;
  return {
    ...rest,
    provisioningMode,
    communicationPeriod,
    communicationPeriod2,
    communicationOffset,
    intervalCnt,
    groupSize,
    groupSize2
  };
};

export const useProvisioningMode = (initial?: ProvisioningMode) => {
  const [mode, setMode] = React.useState(initial ?? WSN_DEFAULT_SETTINGS.provisioningMode);
  return { mode, setMode };
};

const ProvisioningModeField: Field<WSN> = {
  name: 'provisioningMode',
  label: 'provisioning.mode',
  description: 'provisioning.mode.desc'
};

export const useProvisioningModeField = (onChange: (mode: ProvisioningMode) => void) => {
  return {
    termProps: {
      name: intl.get(ProvisioningModeField.label),
      description: intl.get(ProvisioningModeField.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: ProvisioningModeField.name }),
    controlProps: {
      onChange,
      options: pickOptionsFromNumericEnum(ProvisioningMode, ProvisioningModeField.label).map(
        (opts) => ({
          ...opts,
          label: intl.get(opts.label)
        })
      )
    }
  };
};

export const useCommunicationPeriod = (
  name: string,
  options?: { label: string; value: number }[]
) => {
  return {
    ...useFormItemBindingsProps({ name }),
    selectProps: {
      options: options?.map((opts) => ({ ...opts, label: intl.get(opts.label) }))
    }
  };
};

const CommunicationOffsetField: Field<WSN> = {
  name: 'communicationOffset',
  label: 'communication.offset',
  description: 'communication.offset.desc'
};

export const useCommunicationOffset = (communicationPeriodName: Field<WSN>['name']) => {
  return {
    termProps: {
      name: intl.get(CommunicationOffsetField.label),
      description: intl.get(CommunicationOffsetField.description!)
    },
    formItemProps: useFormItemBindingsProps({
      label: CommunicationOffsetField.label,
      name: CommunicationOffsetField.name,
      rules: [
        {
          type: 'integer',
          min: 0,
          message: intl.get('UNSIGNED_INTEGER_ENTER_PROMPT')
        },
        ({ getFieldValue }: any) => ({
          validator(_, value: number) {
            const period = getFieldValue(communicationPeriodName);
            if (!value || Number(period) >= value) {
              return Promise.resolve();
            }
            return Promise.reject(intl.get('COMMUNICATION_OFFSET_PROMPT'));
          }
        })
      ],
      dependencies: [communicationPeriodName]
    }),
    contorlProps: {
      controls: false,
      addonAfter: intl.get('UNIT_MILLISECOND'),
      style: { width: '100%' }
    }
  };
};

const IntervalCnt: Field<WSN> = {
  name: 'intervalCnt',
  label: 'interval.cnt',
  description: 'interval.cnt.desc'
};

export const useIntervalCnt = () => {
  return {
    termProps: {
      name: intl.get(IntervalCnt.label),
      description: intl.get(IntervalCnt.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: IntervalCnt.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};

const GroupSize: Field<WSN> = {
  name: 'groupSize',
  label: 'group.size',
  description: 'group.size.desc'
};

export const useGroupSize = () => {
  return {
    termProps: { name: intl.get(GroupSize.label), description: intl.get(GroupSize.description) },
    ...useFormItemBindingsProps({ name: GroupSize.name }),
    selectProps: {
      options: [1, 2, 4, 8].map((value) => ({ label: `${value}`, value }))
    }
  };
};

const GroupSize2: Field<WSN> = {
  name: 'groupSize2',
  label: 'group.size.2',
  description: 'group.size.2.desc'
};

export const useGroupSize2 = () => {
  return {
    termProps: { name: intl.get(GroupSize2.label), description: intl.get(GroupSize2.description) },
    formItemProps: useFormItemBindingsProps({ name: GroupSize2.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};
