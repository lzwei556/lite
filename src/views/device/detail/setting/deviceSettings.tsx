import { FC, useEffect, useState } from 'react';
import { Button, Form, Skeleton, Space as AntSpace } from 'antd';
import intl from 'react-intl-universal';
import { GetDeviceSettingRequest, UpdateDeviceSettingRequest } from '../../../../apis/device';
import { Device } from '../../../../types/device';
import { DeviceSetting } from '../../../../types/device_setting';
import { processArrayValuesInSensorSetting } from '../../../../components/formItems/deviceSettingFormItem';
import { DeviceSettingsFormItems } from '../../deviceSettingsFormItems';
import { Flex } from '../../../../components';
import { DeviceType } from '../../../../types/device_type';
import { SameTypeDevicesSettingsModal } from './sameTypeDevicesSettingsModal';

export interface DeviceSettingsProps {
  device: Device;
}

const DeviceSettings: FC<DeviceSettingsProps> = ({ device }) => {
  const [settings, setSettings] = useState<DeviceSetting[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [submitedValues, setSubmitedValues] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    GetDeviceSettingRequest(device.id).then((data) => {
      setIsLoading(false);
      setSettings(data);
    });
  }, [device]);

  const onSave = () => {
    form.validateFields().then((values) => {
      UpdateDeviceSettingRequest(device.id, {
        ...values,
        sensors: processArrayValuesInSensorSetting(values.sensors)
      });
    });
  };

  return (
    <Skeleton loading={isLoading}>
      <Form form={form} labelCol={{ xl: 10, xxl: 10 }}>
        {settings && (
          <DeviceSettingsFormItems
            deviceType={device.typeId}
            settings={settings}
            filterSingleGroup={true}
          />
        )}
        <Form.Item>
          <Flex>
            <AntSpace>
              {DeviceType.isSensor(device.typeId) && !DeviceType.isMultiChannel(device.typeId) && (
                <Button
                  onClick={() => {
                    form.validateFields().then((settings) => {
                      setOpen(true);
                      setSubmitedValues(settings);
                    });
                  }}
                >
                  {intl.get('save.and.apply.settings.to.the.devices.of.the.same.type')}
                </Button>
              )}
              <Button type={'primary'} onClick={onSave}>
                {intl.get('SAVE')}
              </Button>
            </AntSpace>
          </Flex>
          {open && submitedValues && (
            <SameTypeDevicesSettingsModal
              device={device}
              open={open}
              onCancel={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                setSubmitedValues(undefined);
              }}
              submitedValues={submitedValues}
            />
          )}
        </Form.Item>
      </Form>
    </Skeleton>
  );
};

export default DeviceSettings;
