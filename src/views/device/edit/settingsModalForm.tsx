import React from 'react';
import { Button, Form, FormInstance } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { ModalWrapper } from '../../../components/modalWrapper';
import { generateColProps } from '../../../utils/grid';
import * as Basis from '../basis-form-items';
import { DeviceSetting, FormItemsProps, SettingsFormItems } from '../settings-common';
import { Trigger } from '../settings-apply-same-types/trigger';
import { useUpdateSettings } from './hooks';

export const SettingsModalForm = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const { loading, handleSubmit } = useUpdateSettings(device.id, onSuccess);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      footer={[
        <Button key='cancel' onClick={props.onCancel}>
          {intl.get('CANCEL')}
        </Button>,
        <Trigger device={device} form={form} onSuccess={onSuccess}>
          {intl.get('apply.settings.to.the.same.types')}
        </Trigger>,
        <Button
          key='ok'
          onClick={() => form.validateFields().then(handleSubmit)}
          loading={loading}
          type='primary'
        >
          {intl.get('SAVE')}
        </Button>
      ]}
      title={intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE_SETTINGS') })}
      width={640}
    >
      <Basis.ContextProvier form={form} device={device}>
        <FormContent form={form} device={device} />
      </Basis.ContextProvier>
    </ModalWrapper>
  );
};

const FormContent = ({ form, device }: { form: FormInstance; device: Device }) => {
  const { settings } = Basis.useContext();
  const props = {
    settings,
    formItemColProps: verticalFewSettings(settings, generateColProps({ xl: 12, xxl: 12 })),
    groupCardProps: { style: { marginBlock: 16 } }
  };
  const deviceType = device.typeId;
  return (
    <Form form={form} layout='vertical'>
      {<SettingsFormItems {...props} deviceType={deviceType} ignoreGroup={true} />}
    </Form>
  );
};

const verticalFewSettings = (
  settings: DeviceSetting[],
  formItemColProps: FormItemsProps['formItemColProps']
) => {
  return settings.length <= 4 ? generateColProps({}) : formItemColProps;
};
