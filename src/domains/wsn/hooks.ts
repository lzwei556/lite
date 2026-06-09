import intl from 'react-intl-universal';
import { Fields, ProvisioningMode, WSN_SETTINGS_DEFAULT, WSN } from './common';
import { useFormItemBindingsProps } from 'hooks';
import { pickOptionsFromNumericEnum } from 'utils';
import { Field } from 'types';
import React from 'react';

export const useProvisioningMode = (initial?: ProvisioningMode) => {
  const [mode, setMode] = React.useState(initial ?? WSN_SETTINGS_DEFAULT.provisioningMode);
  return { mode, setMode };
};

export const useProvisioningModeField = (onChange: (mode: ProvisioningMode) => void) => {
  return {
    termProps: {
      name: intl.get(Fields.ProvisioningMode.label),
      description: intl.get(Fields.ProvisioningMode.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: Fields.ProvisioningMode.name }),
    controlProps: {
      onChange,
      options: pickOptionsFromNumericEnum(ProvisioningMode, Fields.ProvisioningMode.label).map(
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

export const useCommunicationOffset = (communicationPeriodName: Field<WSN>['name']) => {
  return {
    termProps: {
      name: intl.get(Fields.CommunicationOffset.label),
      description: intl.get(Fields.CommunicationOffset.description!)
    },
    formItemProps: useFormItemBindingsProps({
      label: Fields.CommunicationOffset.label,
      name: Fields.CommunicationOffset.name,
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

export const useIntervalCnt = () => {
  return {
    termProps: {
      name: intl.get(Fields.IntervalCnt.label),
      description: intl.get(Fields.IntervalCnt.description!)
    },
    formItemProps: useFormItemBindingsProps({ name: Fields.IntervalCnt.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};

export const useGroupSize = () => {
  return {
    termProps: {
      name: intl.get(Fields.GroupSize.label),
      description: intl.get(Fields.GroupSize.description)
    },
    ...useFormItemBindingsProps({ name: Fields.GroupSize.name }),
    selectProps: {
      options: [1, 2, 4, 8].map((value) => ({ label: `${value}`, value }))
    }
  };
};

export const useGroupSize2 = () => {
  return {
    termProps: {
      name: intl.get(Fields.GroupSize2.label),
      description: intl.get(Fields.GroupSize2.description)
    },
    formItemProps: useFormItemBindingsProps({ name: Fields.GroupSize2.name }),
    contorlProps: { controls: false, style: { width: '100%' } }
  };
};
