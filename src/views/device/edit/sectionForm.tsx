import React from 'react';
import { Form, Space, Tooltip } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { Card, CardProps } from '../../../components';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { createReactIntlTextNode } from '../../../utils';
import { generateColProps } from '../../../utils/grid';
import { Trigger } from '../settings-apply-same-types/trigger';
import {
  FormItemsProps,
  SettingsFormItems,
  useGroupCardProps,
  useGroupedSettings
} from '../settings-common';
import * as Basis from '../basis-form-items';
import { FormEditProps, UpdateProps, useUpdateSettings } from './hooks';
import { SaveIconButton } from './saveIconButton';

export const SettingsSectionForm = ({ device }: { device: Device }) => {
  const { settings } = Basis.useContext();
  const onlySingleGroup = useGroupedSettings(settings).length <= 1;
  const updateProps = useUpdateSettings(device.id);
  const { formProps, groupCardPropsExtra, innerGroupCardProps, ...rest } = useSettingsFormProps(
    onlySingleGroup,
    updateProps
  );
  const commonProps = {
    ...rest,
    settings,
    deviceType: device.typeId,
    groupCardProps: {
      ...rest.groupCardProps,
      extra: (
        <Space>
          <SaveIconButton {...groupCardPropsExtra.saveButton} />
          <Tooltip title={groupCardPropsExtra.selectButton?.children}>
            <Trigger device={device} form={formProps.form!} icon={<SelectOutlined />} />
          </Tooltip>
        </Space>
      )
    }
  };

  return (
    <Form {...formProps}>
      {onlySingleGroup ? (
        <SingleGroupSection {...commonProps} />
      ) : (
        <MultipleGroupsSection {...{ ...commonProps, innerGroupCardProps }} />
      )}
    </Form>
  );
};

const SingleGroupSection = (props: FormItemsProps & { deviceType: DeviceType }) => {
  return <SettingsFormItems {...props} />;
};

const MultipleGroupsSection = (
  props: FormItemsProps & { deviceType: DeviceType } & { innerGroupCardProps?: CardProps }
) => {
  const { groupCardProps, innerGroupCardProps, ...rest } = props;

  return (
    <Card {...groupCardProps}>
      <SettingsFormItems {...{ ...rest, groupCardProps: innerGroupCardProps }} />
    </Card>
  );
};

const useSettingsFormProps = (
  onlySingleGroup: boolean,
  updateProps: UpdateProps
): FormEditProps => {
  const [form] = Form.useForm();
  const singleGroupCardProps = useGroupCardProps({});
  const multipleGroupCardProps = useGroupCardProps({
    styles: { body: { paddingBlock: 0 } },
    title: createReactIntlTextNode('DEVICE_SETTINGS')
  });
  return {
    formProps: { form, layout: 'vertical', variant: onlySingleGroup ? undefined : 'filled' },
    groupCardProps: onlySingleGroup ? singleGroupCardProps : multipleGroupCardProps,
    groupCardPropsExtra: {
      saveButton: {
        onClick: () => form.validateFields().then(updateProps.handleSubmit),
        loading: updateProps.loading
      },
      selectButton: {
        children: createReactIntlTextNode('apply.settings.to.the.same.types')
      }
    },
    innerGroupCardProps: {
      extra: undefined,
      style: { ...singleGroupCardProps.style, backgroundColor: 'var(--body-bg-color)' }
    },
    formItemColProps: generateColProps({ xl: 12, xxl: 8 })
  };
};
