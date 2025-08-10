import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { useFormBindingsProps } from '../../../hooks';
import { useGlobalStyles } from '../../../styles';
import {
  FormCommonProps,
  FormItemsProps,
  FormSubmitButtonProps,
  SettingsFormItems,
  useGroupCardProps,
  useGroupedSettings
} from '../settings-common';
import * as Basis from '../basis-form-items';
import { useUpdateSettings } from './hooks';
import { Toolbar } from './toolbar';

type Props = FormCommonProps & Pick<FormItemsProps, 'settings'> & FormSubmitButtonProps;

export const SettingsSectionForm = ({ device }: Pick<Props, 'device'>) => {
  const { formProps, onlySingleGroup, ...rest } = useProps(device);

  return (
    <Form {...formProps}>
      {onlySingleGroup ? <SingleGroupSection {...rest} /> : <MultipleGroupsSection {...rest} />}
    </Form>
  );
};

const useProps = (device: Props['device']) => {
  const { settings } = Basis.useContext();
  const onlySingleGroup = useGroupedSettings(settings, device.typeId).length <= 1;
  const updateProps = useUpdateSettings(device.id);
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    variant: onlySingleGroup ? undefined : 'filled'
  });
  return {
    formProps,
    onlySingleGroup,
    device,
    form: formProps.form,
    settings,
    ...updateProps
  };
};

const SingleGroupSection = (props: Props) => {
  return <SettingsFormItems {...useSingleGroupSectionProps(props)} />;
};

const MultipleGroupsSection = (props: Props) => {
  const { groupCardProps, settingsFormItemsProps } = useMultipleGroupSectionProps(props);
  return (
    <Card {...groupCardProps}>
      <SettingsFormItems {...settingsFormItemsProps} />
    </Card>
  );
};

const useSingleGroupSectionProps = (props: Props) => {
  return {
    ...useSettingFormItemsCommonProps(props),
    groupCardProps: {
      ...useGroupCardProps({}),
      extra: <Toolbar {...props} />
    }
  };
};

const useSettingFormItemsCommonProps = (props: Props) => {
  return {
    deviceType: props.device.typeId,
    formItemColProps: generateColProps({ xl: 12, xxl: 8 }),
    settings: props.settings
  };
};

const useMultipleGroupSectionProps = (props: Props) => {
  const { colorLayoutBgStyle } = useGlobalStyles();
  return {
    groupCardProps: {
      ...useGroupCardProps({
        styles: { body: { paddingBlock: 0 } },
        title: intl.get('DEVICE_SETTINGS')
      }),
      extra: <Toolbar {...props} />
    },
    settingsFormItemsProps: {
      ...useSettingFormItemsCommonProps(props),
      groupCardProps: useGroupCardProps({
        style: colorLayoutBgStyle
      })
    }
  };
};
