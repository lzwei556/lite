import React from 'react';
import { FormItemProps } from 'antd';
import intl from 'react-intl-universal';
import { pickOptionsFromNumericEnum } from '../../utils';
import { millisecond } from '../../constants';
import { Rules } from '../../constants/validator';

export type WSN = {
  provisioning_mode: number;
  communication_period: number;
  communication_period_2: number;
  communication_offset: number;
  group_size: number;
  group_size_2: number;
  interval_cnt: number;
};

export type WSNUpdate = { mode: ProvisioningMode; wsn: Omit<WSN, 'provisioning_mode'> };

const DEFAULT_WSN_SETTING = {
  communication_period: 20 * 60 * 1000,
  communication_period_2: 0,
  communication_offset: 10000,
  group_size: 4,
  group_size_2: 1,
  interval_cnt: 1
};

export const tranformWSN2WSNUpdate = (wsn: WSN): WSNUpdate => {
  return {
    mode: wsn.provisioning_mode,
    wsn: {
      communication_period: wsn.communication_period ?? DEFAULT_WSN_SETTING.communication_period,
      communication_period_2:
        wsn.communication_period_2 ?? DEFAULT_WSN_SETTING.communication_period_2,
      communication_offset: wsn.communication_offset ?? DEFAULT_WSN_SETTING.communication_offset,
      group_size: wsn.group_size ?? DEFAULT_WSN_SETTING.group_size,
      group_size_2: wsn.group_size_2 ?? DEFAULT_WSN_SETTING.group_size,
      interval_cnt: wsn.interval_cnt ?? DEFAULT_WSN_SETTING.interval_cnt
    }
  };
};

export const MajorCommunicationPeriodOptions = [
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
  }
];

export const CommunicationPeriodOptions = [
  {
    value: 4 * 60 * millisecond,
    label: 'OPTION_4_MINUTES'
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
  }
];

export const SecondaryCommunicationPeriodOptions = [
  {
    value: 0,
    label: 'NONE'
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
  }
];

export enum ProvisioningMode {
  Group = 1,
  TimeDivision,
  Continuous,
  ManagedBroadcast,
  UnManagedBroadcast
}

export const getInitialSettings = (mode?: ProvisioningMode, initial?: WSN) => {
  if (initial && mode) {
    const { communication_period, ...rest } = initial;
    const isPeriodValid = ValidPeriod(communication_period, mode);
    return {
      ...rest,
      communication_period: isPeriodValid
        ? communication_period
        : DEFAULT_WSN_SETTING.communication_period
    };
  }
  return DEFAULT_WSN_SETTING;
};

const ValidPeriod = (period: number, mode: ProvisioningMode) => {
  if (mode === ProvisioningMode.TimeDivision) {
    return MajorCommunicationPeriodOptions.some((opts) => opts.value === period);
  } else {
    return CommunicationPeriodOptions.some((opts) => opts.value === period);
  }
};

export const useProvisioningMode = (modeFromProps?: ProvisioningMode) => {
  const [mode, setMode] = React.useState(modeFromProps ?? ProvisioningMode.TimeDivision);
  return { mode, setMode };
};

export const useProvisioningModeField = (onChange: (mode: ProvisioningMode) => void) => {
  return {
    label: { name: intl.get('provisioning.mode'), description: intl.get('provisioning.mode.desc') },
    formItemProps: { name: 'mode', rules: [Rules.required] } as FormItemProps,
    controlProps: {
      onChange,
      options: pickOptionsFromNumericEnum(ProvisioningMode, 'provisioning.mode').map((opts) => ({
        ...opts,
        label: intl.get(opts.label)
      }))
    }
  };
};

export const useCommunicationPeriod = (
  name: string,
  options?: { label: string; value: number }[]
) => {
  return {
    formItemProps: {
      name: ['wsn', name],
      rules: [Rules.required]
    } as FormItemProps,
    contorlProps: {
      options: options?.map((opts) => ({ ...opts, label: intl.get(opts.label) }))
    }
  };
};

export const useCommunicationOffset = (communicationPeriodName: string[]) => {
  const label = {
    name: intl.get('communication.offset'),
    description: intl.get('communication.offset.desc')
  };
  return {
    label,
    formItemProps: {
      name: ['wsn', 'communication_offset'],
      rules: [
        {
          required: true,
          message: intl.get('PLEASE_ENTER_SOMETHING', {
            something: label.name
          })
        },
        {
          type: 'integer',
          min: 0,
          message: intl.get('UNSIGNED_INTEGER_ENTER_PROMPT')
        },
        ({ getFieldValue }: any) => ({
          validator(_, value: number) {
            const wsn = getFieldValue('wsn');
            if (!value || Number(wsn.communication_period) >= value) {
              return Promise.resolve();
            }
            return Promise.reject(intl.get('COMMUNICATION_OFFSET_PROMPT'));
          }
        })
      ],
      dependencies: [communicationPeriodName]
    } as FormItemProps,
    contorlProps: {
      controls: false,
      addonAfter: intl.get('UNIT_MILLISECOND'),
      style: { width: '100%' }
    }
  };
};

export const useIntervalCnt = () => {
  const label = {
    name: intl.get('interval.cnt'),
    description: intl.get('interval.cnt.desc')
  };
  return {
    label,
    formItemProps: {
      name: ['wsn', 'interval_cnt'],
      rules: [
        {
          required: true,
          message: intl.get('PLEASE_ENTER_SOMETHING', {
            something: label.name
          })
        }
      ]
    } as FormItemProps,
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};

export const useGroupSize = () => {
  const label = {
    name: intl.get('group.size'),
    description: intl.get('group.size.desc')
  };
  return {
    label,
    formItemProps: {
      name: ['wsn', 'group_size'],
      rules: [
        {
          required: true,
          message: intl.get('PLEASE_ENTER_SOMETHING', {
            something: label.name
          })
        }
      ]
    } as FormItemProps,
    contorlProps: {
      options: [1, 2, 4, 8].map((value) => ({ label: `${value}`, value }))
    }
  };
};

export const useGroupSize2 = () => {
  const label = {
    name: intl.get('group.size2'),
    description: intl.get('group.size2.desc')
  };
  return {
    label,
    formItemProps: {
      name: ['wsn', 'group_size_2'],
      rules: [
        {
          required: true,
          message: intl.get('PLEASE_ENTER_SOMETHING', {
            something: label.name
          })
        }
      ]
    } as FormItemProps,
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};
