import { Divider, Form, message } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Firmware } from '../../../types/firmware';
import { Device } from '../../../types/device';
import { GetDeviceFirmwaresRequest } from '../../../apis/firmware';
import { Dayjs } from '../../../utils';
import { DeviceUpgradeRequest } from '../../../apis/device';
import { DeviceCommand } from '../../../types/device_command';
import intl from 'react-intl-universal';
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
                { label: intl.get('FIRMWARE_VERSION'), children: firmware.version },
                { label: intl.get('HARDWARE_VERSION'), children: firmware.productId },
                {
                  label: intl.get('BUILD_DATE'),
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
    if (firmware === undefined) {
      message.success(intl.get('PLEASE_SELECT_FIRMWARE'));
      return;
    }
    if (device) {
      setIsLoading(true);
      DeviceUpgradeRequest(device.id, {
        firmware_id: firmware.id,
        type: DeviceCommand.Upgrade
      }).then((res) => {
        setIsLoading(false);
        if (res.code === 200) {
          message.success(intl.get('COMMAND_SENT_SUCCESSFUL')).then();
          onSuccess();
        } else {
          message.error(intl.get('FAILED_TO_SEND_COMMAND')).then();
        }
      });
    }
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={420}
      open={open}
      title={intl.get('UPGRADE_FIRMWARE')}
      okText={intl.get('UPGRADE')}
      onOk={onUpgrade}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <SelectFormItem
          label='SELECT_FIRMWARE_VERSION'
          name='firmware'
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
