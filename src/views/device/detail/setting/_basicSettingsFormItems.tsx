import React from 'react';
import { Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../../components/formInputItem';
import { DeviceType } from '../../../../types/device_type';
import { Normalizes, Rules } from '../../../../constants/validator';
import { Device } from '../../../../types/device';
import { GetNetworksRequest } from '../../../../apis/network';
import { ParentsSelect } from '../../parentsSelect';

export const BasicSettingsFormItems = ({ device }: { device: Device }) => {
  const [networkId, setNetworkId] = React.useState<number | undefined>(device.network?.id);
  const renderNetworkFormItem = () => {
    if (DeviceType.isRootDevice(device.typeId)) {
      return (
        <Form.Item label={intl.get('wan.interface.protocol')} name='protocol'>
          <Select
            options={[
              { label: intl.get('wan.interface.protocol.protobuf'), value: 2 },
              { label: intl.get('wan.interface.protocol.tlv'), value: 3 }
            ]}
          />
        </Form.Item>
      );
    }
    return (
      <>
        <Form.Item label={intl.get('PARENT')} name={'parent'} rules={[Rules.required]}>
          <ParentsSelect
            device={device}
            dispalyField='macAddress'
            onChange={(value, option: any) => {
              GetNetworksRequest().then((networks) => {
                setNetworkId(
                  networks.find((network) => network.gateway.id === option.gatewayId)?.id
                );
              });
            }}
          />
        </Form.Item>
        {networkId && (
          <Form.Item name={'network'} hidden={true}>
            <Input />
          </Form.Item>
        )}
      </>
    );
  };

  return (
    <>
      <FormInputItem
        label={intl.get('DEVICE_NAME')}
        name='name'
        requiredMessage={intl.get('PLEASE_ENTER_DEVICE_NAME')}
        lengthLimit={{ min: 4, max: 20, label: intl.get('DEVICE_NAME') }}
      >
        <Input placeholder={intl.get('PLEASE_ENTER_DEVICE_NAME')} />
      </FormInputItem>
      <Form.Item
        label={intl.get('MAC_ADDRESS')}
        name='mac_address'
        rules={[
          {
            required: true,
            message: intl.get('PLEASE_ENTER_MAC_ADDRESS')
          },
          {
            pattern: /^([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})$/,
            message: intl.get('MAC_ADDRESS_IS_INVALID')
          }
        ]}
        normalize={Normalizes.macAddress}
      >
        <Input placeholder={intl.get('PLEASE_ENTER_MAC_ADDRESS')} />
      </Form.Item>
      {device && renderNetworkFormItem()}
    </>
  );
};
