import { Form, ModalProps } from 'antd';
import { Device } from '../../../types/device';
import { GetDeviceSettingRequest, UpdateDeviceSettingRequest } from '../../../apis/device';
import { useEffect, useState } from 'react';
import { processArrayValuesInSensorSetting } from '../../../components/formItems/deviceSettingFormItem';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { DeviceSettingsFormItems } from '../deviceSettingsFormItems';

export interface EditSettingProps extends ModalProps {
  device: Device;
  open: boolean;
  onSuccess: () => void;
}

const EditSettingModal = (props: EditSettingProps) => {
  const { device, open, onCancel, onSuccess } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      GetDeviceSettingRequest(device.id).then(setSettings);
    }
  }, [open, device.id]);

  const onSave = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      UpdateDeviceSettingRequest(device.id, {
        ...values,
        sensors: processArrayValuesInSensorSetting(values.sensors)
      }).then((_) => {
        setIsLoading(false);
        onSuccess();
      });
    });
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={520}
      open={open}
      title={intl.get('DEVICE_SETTINGS')}
      okText={intl.get('SAVE')}
      onOk={onSave}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <DeviceSettingsFormItems deviceType={device.typeId} settings={settings} />
      </Form>
    </ModalWrapper>
  );
};

export default EditSettingModal;
