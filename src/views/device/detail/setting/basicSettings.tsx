import * as React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { UpdateDeviceRequest } from '../../../../apis/device';
import { Device } from '../../../../types/device';
import { Flex } from '../../../../components';
import { BasicSettingsFormItems } from './_basicSettingsFormItems';

export const BasicSettings = ({ device, onUpdate }: { device: Device; onUpdate: () => void }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [form] = Form.useForm();

  return (
    <Form form={form} labelCol={{ xl: 9, xxl: 8 }} initialValues={getInitial(device)}>
      <BasicSettingsFormItems
        device={device}
        onChangeNetwork={(networkId) => form.setFieldValue('network', networkId)}
      />
      <Form.Item>
        <Flex>
          <Button
            type={'primary'}
            loading={isLoading}
            onClick={() => {
              form.validateFields().then((values) => {
                setIsLoading(true);
                UpdateDeviceRequest(device.id, values).then((_) => {
                  setIsLoading(false);
                  onUpdate();
                });
              });
            }}
          >
            {intl.get('SAVE')}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export function getInitial(device: Device) {
  return {
    name: device.name,
    mac_address: device.macAddress,
    protocol: filterInvalidProtocolValues(device.protocol),
    network: device.network && device.network.id,
    parent: device.parent
  };
}

const filterInvalidProtocolValues = (protocol: number) => {
  return protocol !== 2 && protocol !== 3 ? 2 : protocol;
};
