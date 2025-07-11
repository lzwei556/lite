import React from 'react';
import { Col, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { Grid } from '../../../components';
import { FormInputItem } from '../../../components/formInputItem';
import { Normalizes } from '../../../constants/validator';
import { DeviceType } from '../../../types/device_type';
import { FormItemsProps } from '../settings-common';
import { ParentsSelect } from './parentsSelect';
import { useContext } from './context';

export const FormItems = ({ formItemColProps }: Omit<FormItemsProps, 'settings'>) => {
  const { deviceType, deviceTypeSelectProps } = useContext();

  return (
    <Grid>
      <Col {...formItemColProps}>
        <FormInputItem
          label={intl.get('DEVICE_NAME')}
          name='name'
          requiredMessage={intl.get('PLEASE_ENTER_DEVICE_NAME')}
          lengthLimit={{ min: 4, max: 20, label: intl.get('DEVICE_NAME') }}
        >
          <Input placeholder={intl.get('PLEASE_ENTER_DEVICE_NAME')} />
        </FormInputItem>
      </Col>
      <Col {...formItemColProps}>
        <Form.Item
          label={intl.get('MAC_ADDRESS')}
          normalize={Normalizes.macAddress}
          required
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
        >
          <Input placeholder={intl.get('PLEASE_ENTER_MAC_ADDRESS')} />
        </Form.Item>
      </Col>
      <Col {...formItemColProps}>
        <Form.Item
          label={intl.get('DEVICE_TYPE')}
          name={'type'}
          rules={[{ required: true, message: intl.get('PLEASE_SELECT_DEVICE_TYPE') }]}
        >
          <Select
            {...{
              ...deviceTypeSelectProps,
              options: deviceTypeSelectProps.options?.map((opts) => ({
                ...opts,
                label: intl.get(opts.label as string),
                options: opts.options.map((opts: any) => ({ ...opts, label: intl.get(opts.label) }))
              }))
            }}
            placeholder={intl.get('PLEASE_SELECT_DEVICE_TYPE')}
          />
        </Form.Item>
      </Col>
      {deviceType && (
        <Col {...formItemColProps}>
          {DeviceType.isRootDevice(deviceType) ? <ProtocolFormItem /> : <ParentFormItemsSection />}
        </Col>
      )}
    </Grid>
  );
};

const ProtocolFormItem = () => {
  return (
    <Form.Item label={intl.get('wan.interface.protocol')} name='protocol'>
      <Select
        defaultValue={3}
        options={[
          { label: intl.get('wan.interface.protocol.protobuf'), value: 2 },
          { label: intl.get('wan.interface.protocol.tlv'), value: 3 }
        ]}
      />
    </Form.Item>
  );
};

const ParentFormItemsSection = () => {
  const { networkId, parentSelectProps } = useContext();
  return (
    <>
      <Form.Item
        label={intl.get('PARENT')}
        name={'parent'}
        rules={[{ required: true, message: intl.get('PLEASE_SELECT_PARENT') }]}
      >
        <ParentsSelect {...parentSelectProps} />
      </Form.Item>
      {networkId && (
        <Form.Item name={'network'} hidden={true}>
          <Input />
        </Form.Item>
      )}
    </>
  );
};
