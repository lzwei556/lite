import React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../../../types/common';
import { Device } from '../../../../../types/device';
import { DeviceSetting } from '../../../../../types/device_setting';
import { ModalWrapper } from '../../../../../components/modalWrapper';
import { GetDeviceSettingRequest, UpdateDeviceSettingRequest } from '../../../../../apis/device';
import { DeviceSettingsFormItems } from '../../../deviceSettingsFormItems';
import { getInitial } from '../basicSettings';
import { processArrayValuesInSensorSetting } from '../../../../../components/formItems/deviceSettingFormItem';
import { SameTypeDevicesSettingsModal } from '../sameTypeDevicesSettingsModal';

export const DeviceSettingsModal = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState<DeviceSetting[]>();
  const [open, setOpen] = React.useState(false);
  const [submitedValues, setSubmitedValues] = React.useState<any>();

  React.useEffect(() => {
    GetDeviceSettingRequest(device.id).then(setSettings);
  }, [device.id]);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      footer={[
        <Button key='cancel' onClick={props.onCancel}>
          {intl.get('CANCEL')}
        </Button>,
        <Button
          key='ok2'
          onClick={() => {
            form.validateFields().then((settings) => {
              setOpen(true);
              setSubmitedValues(settings);
            });
          }}
          loading={loading}
        >
          {intl.get('save.and.apply.settings.to.the.devices.of.the.same.type')}
        </Button>,
        <Button
          key='ok'
          onClick={() => {
            form.validateFields().then((values) => {
              setLoading(true);
              UpdateDeviceSettingRequest(device.id, {
                ...values,
                sensors: processArrayValuesInSensorSetting(values.sensors)
              });
            });
          }}
          loading={loading}
          type='primary'
        >
          {intl.get('SAVE')}
        </Button>
      ]}
      title={intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE_SETTINGS') })}
    >
      <Form form={form} labelCol={{ xl: 9, xxl: 8 }} initialValues={getInitial(device)}>
        {settings && (
          <DeviceSettingsFormItems
            deviceType={device.typeId}
            settings={settings}
            filterSingleGroup={true}
          />
        )}
      </Form>
      {open && submitedValues && (
        <SameTypeDevicesSettingsModal
          device={device}
          open={open}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            setSubmitedValues(undefined);
            onSuccess();
          }}
          submitedValues={submitedValues}
        />
      )}
    </ModalWrapper>
  );
};
