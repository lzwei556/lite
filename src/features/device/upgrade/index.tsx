import { Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Firmware } from '../../../types/firmware';
import { Device } from '../../../types/device';
import { GetDeviceFirmwaresRequest } from '../../../apis/firmware';
import { Dayjs } from '../../../utils';
import { DeviceUpgradeRequest } from '../../../apis/device';
import { DeviceCommand } from '../../../types/device_command';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Card, Descriptions, SelectFormItem } from '../../../components';

export interface UpgradeModalProps {
  open: boolean;
  device: Device;
  onCancel?: () => void;
  onSuccess: () => void;
}

const UpgradeModal: FC<UpgradeModalProps> = ({ open, device, onCancel, onSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firmware, setFirmware] = useState<any>();
  const [firmwares, setFirmwares] = useState<Firmware[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (device && open) {
      form.resetFields();
      setFirmware(undefined);
      GetDeviceFirmwaresRequest(device.id).then(setFirmwares);
    }
  }, [device, open, form]);

  const renderFirmware = () => {
    if (firmware) {
      return (
        <>
          <Divider />
          <Card>
            <Descriptions
              items={[
                { label: Translation.get('firmware.version'), children: firmware.version },
                { label: Translation.get('firmware.version.hard'), children: firmware.productId },
                {
                  label: Translation.get('firmware.build.time'),
                  children: Dayjs.format(firmware.buildTime)
                }
              ]}
            />
          </Card>
        </>
      );
    }
  };

  const onUpgrade = () => {
    form.validateFields().then(() => {
      if (device) {
        setIsLoading(true);
        DeviceUpgradeRequest(device.id, {
          firmware_id: firmware.id,
          type: DeviceCommand.Upgrade
        }).then((res) => {
          setIsLoading(false);
          if (res.code === 200) {
            message.success(Translation.get('feedback.success.send')).then();
            onSuccess();
          } else {
            message.error(Translation.failureDo('common.action.send')).then();
          }
        });
      }
    });
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={420}
      open={open}
      title={Translation.get('device.command.upgrade')}
      okText={Translation.get('common.action.upgrade')}
      onOk={onUpgrade}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <SelectFormItem
          label='firmware.version'
          name='firmware'
          rules={[
            { required: true, message: Translation.pleaseDoSth('common.action.select', 'firmware') }
          ]}
          selectProps={{
            onChange: (value) => {
              setFirmware(firmwares.find((item) => item.id === value));
            },
            options: firmwares.map(({ id, version }) => ({ label: version, value: id }))
          }}
        />
      </Form>
      {renderFirmware()}
    </ModalWrapper>
  );
};

export default UpgradeModal;
