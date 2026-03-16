import React from 'react';
import { Translation } from 'locales/utils';
import { objectToCamel, objectToSnake, ObjectToSnake } from 'ts-case-convert';
import { pickOptionsFromNumericEnum } from '../utils';
import { Field } from '../types';
import { useFormItemBindingsProps } from '../hooks';
import { buildPeriodOption, PeriodOptionLabel } from 'locales/utils';

export enum ProvisioningMode {
  Group = 1,
  'Time-Division',
  Continuous,
  'Managed-Broadcast',
  'Unmanaged-Broadcast'
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
  provisioningMode: ProvisioningMode['Time-Division'],
  communicationPeriod: 20 * 60 * 1000,
  communicationPeriod2: 0,
  communicationOffset: 10000,
  groupSize: 4,
  groupSize2: 1,
  intervalCnt: 1
};

const rest = [
  buildPeriodOption(10, 'minute'),
  buildPeriodOption(20, 'minute'),
  buildPeriodOption(30, 'minute'),
  buildPeriodOption(1, 'hour'),
  buildPeriodOption(2, 'hour')
];

export const getCommunicationPeriodOptions = (mode?: ProvisioningMode) => {
  return mode === ProvisioningMode['Time-Division']
    ? [buildPeriodOption(5, 'minute'), ...rest]
    : [buildPeriodOption(4, 'minute'), ...rest];
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
  buildPeriodOption(),
  ...rest,
  buildPeriodOption(4, 'hour'),
  buildPeriodOption(6, 'hour'),
  buildPeriodOption(8, 'hour'),
  buildPeriodOption(12, 'hour')
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
  label: 'wsn.provisioning.mode',
  description: 'wsn.provisioning.mode.desc',
  type: 'enum'
};

export const useProvisioningModeField = (onChange: (mode: ProvisioningMode) => void) => {
  return {
    termProps: {
      name: Translation.get(ProvisioningModeField.label),
      description: Translation.get(ProvisioningModeField.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: ProvisioningModeField.name }),
    controlProps: {
      onChange,
      options: pickOptionsFromNumericEnum(ProvisioningMode, 'wsn.provisioning').map((opts) => ({
        ...opts,
        label: Translation.get(opts.label)
      }))
    }
  };
};

export const useCommunicationPeriod = (
  name: string,
  options?: { label: PeriodOptionLabel; value: number }[]
) => {
  return {
    ...useFormItemBindingsProps({ name }),
    selectProps: {
      options: options?.map((opts) => ({ ...opts, label: Translation.get(...opts.label) }))
    }
  };
};

const CommunicationOffsetField: Field<WSN> = {
  name: 'communicationOffset',
  label: 'wsn.communication.offset',
  description: 'wsn.communication.offset.desc',
  type: 'enum'
};

export const useCommunicationOffset = (communicationPeriodName: Field<WSN>['name']) => {
  return {
    termProps: {
      name: Translation.get(CommunicationOffsetField.label),
      description: Translation.get(CommunicationOffsetField.description!)
    },
    formItemProps: useFormItemBindingsProps({
      label: CommunicationOffsetField.label,
      name: CommunicationOffsetField.name,
      rules: [
        {
          type: 'integer',
          min: 0,
          message: 'feedback.validation.integer'
        },
        ({ getFieldValue }: any) => ({
          validator(_, value: number) {
            const period = getFieldValue(communicationPeriodName);
            if (!value || Number(period) >= value) {
              return Promise.resolve();
            }
            return Promise.reject(Translation.get('wsn.communication.offset.constraint'));
          }
        })
      ],
      dependencies: [communicationPeriodName]
    }),
    contorlProps: {
      controls: false,
      addonAfter: Translation.get('label.unit.millisecond'),
      style: { width: '100%' }
    }
  };
};

const IntervalCnt: Field<WSN> = {
  name: 'intervalCnt',
  label: 'wsn.interval-cnt',
  description: 'wsn.interval-cnt.desc',
  type: 'number'
};

export const useIntervalCnt = () => {
  return {
    termProps: {
      name: Translation.get(IntervalCnt.label),
      description: Translation.get(IntervalCnt.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: IntervalCnt.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};

const GroupSize: Field<WSN> = {
  name: 'groupSize',
  label: 'wsn.group-size',
  description: 'wsn.group-size.desc',
  type: 'enum'
};

export const useGroupSize = () => {
  return {
    termProps: {
      name: Translation.get(GroupSize.label),
      description: Translation.get(GroupSize.description)
    },
    ...useFormItemBindingsProps({ name: GroupSize.name }),
    selectProps: {
      options: [1, 2, 4, 8].map((value) => ({ label: `${value}`, value }))
    }
  };
};

const GroupSize2: Field<WSN> = {
  name: 'groupSize2',
  label: 'wsn.group-size.waveform',
  description: 'wsn.group-size.waveform.desc',
  type: 'enum'
};

export const useGroupSize2 = () => {
  return {
    termProps: {
      name: Translation.get(GroupSize2.label),
      description: Translation.get(GroupSize2.description)
    },
    formItemProps: useFormItemBindingsProps({ name: GroupSize2.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};
