import React from 'react';
import { Button, Col, Form, Input, Result, Row, Select } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { DeviceSetting } from '../../../types/device_setting';
import { DeviceType } from '../../../types/device_type';
import { NetworkProvisioningMode } from '../../../types/network';
import { DEFAULT_WSN_SETTING } from '../../../types/wsn_setting';
import { AddDeviceRequest, GetDefaultDeviceSettingsRequest } from '../../../apis/device';
import { CreateNetworkRequest, GetNetworksRequest } from '../../../apis/network';
import { useContext } from '..';
import { processArrayValuesInSensorSetting } from '../../../components/formItems/deviceSettingFormItem';
import { FormInputItem } from '../../../components/formInputItem';
import { Normalizes } from '../../../constants/validator';
import DeviceTypeSelect from '../../../components/select/deviceTypeSelect';
import { DeviceSettingsFormItems } from '../deviceSettingsFormItems';
import { WsnFormItem } from './wsnFormItem';
import { ParentsSelect } from '../parentsSelect';

export const AddModal = (props: ModalFormProps) => {
  const [deviceSettings, setDeviceSettings] = React.useState<DeviceSetting[]>();
  const [deviceType, setDeviceType] = React.useState<DeviceType>();
  const [network, setNetwork] = React.useState<number>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [form] = Form.useForm();
  const { refresh } = useContext();
  const isBLEGateway = (type: number) => DeviceType.isBLEGateway(type);

  const fetchDeviceDefaultSettings = (type: any) => {
    setDeviceType(type);
    if (isBLEGateway(type)) {
      form.setFieldsValue({
        mode: NetworkProvisioningMode.Mode2,
        wsn: DEFAULT_WSN_SETTING
      });
    }
    setDeviceSettings([]);
    GetDefaultDeviceSettingsRequest(type).then((deviceSettings: DeviceSetting[]) => {
      deviceSettings.forEach((s) => {
        form.setFieldValue([s.category, s.key], s.key === 'sensor_flags' ? [s.value] : s.value);
      });
      setDeviceSettings(deviceSettings);
    });
  };

  const onSave = () => {
    form.validateFields().then((values) => {
      if (values) {
        if (DeviceType.isGateway(values.type)) {
          CreateNetworkRequest({
            ...values,
            gateway: {
              mac_address: values.mac_address,
              type: values.type,
              protocol: values.protocol
            }
          }).then((_) => {
            setSuccess(true);
            refresh();
          });
        } else {
          const data = network
            ? {
                ...values,
                network,
                sensors: processArrayValuesInSensorSetting(values.sensors)
              }
            : {
                ...values,
                sensors: processArrayValuesInSensorSetting(values.sensors)
              };
          AddDeviceRequest(data).then((_) => {
            setSuccess(true);
            refresh();
          });
        }
      }
    });
  };

  const renderNetwork = () => {
    if (DeviceType.isRootDevice(deviceType ?? 0)) {
      return (
        <Form.Item label={intl.get('wan.interface.protocol')} name='protocol' initialValue={3}>
          <Select
            options={[
              { label: intl.get('wan.interface.protocol.protobuf'), value: 2 },
              { label: intl.get('wan.interface.protocol.tlv'), value: 3 }
            ]}
          />
        </Form.Item>
      );
    } else {
      return (
        <Form.Item
          label={intl.get('PARENT')}
          name={'parent'}
          rules={[{ required: true, message: intl.get('PLEASE_SELECT_PARENT') }]}
        >
          <ParentsSelect
            onChange={(value, option: any) => {
              GetNetworksRequest().then((networks) =>
                setNetwork(networks.find((network) => network.gateway.id === option.gatewayId)?.id)
              );
            }}
          />
        </Form.Item>
      );
    }
  };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      title={intl.get('CREATE_DEVICE')}
      okText={intl.get('CREATE')}
      onOk={onSave}
      width={720}
      footer={success ? null : undefined}
    >
      <>
        {success && (
          <Result
            status='success'
            title={intl.get('CREATED_SUCCESSFUL')}
            subTitle={intl.get('DEVICE_CREATED_NEXT_PROMPT')}
            extra={[
              <Button
                key='add'
                onClick={() => {
                  form.resetFields();
                  setSuccess(false);
                }}
                type='primary'
              >
                {intl.get('CONTINUE_TO_CREATE_DEVICE')}
              </Button>,
              <Button
                key='devices'
                onClick={() => {
                  props.onSuccess();
                }}
              >
                {intl.get('close')}
              </Button>
            ]}
          />
        )}
        <Row justify='space-between' hidden={success}>
          <Col span={24}>
            <Form form={form} labelCol={{ span: 8 }}>
              <fieldset>
                <legend>{intl.get('BASIC_INFORMATION')}</legend>
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
                <Form.Item
                  label={intl.get('DEVICE_TYPE')}
                  name={'type'}
                  rules={[{ required: true, message: intl.get('PLEASE_SELECT_DEVICE_TYPE') }]}
                >
                  <DeviceTypeSelect
                    placeholder={intl.get('PLEASE_SELECT_DEVICE_TYPE')}
                    onChange={fetchDeviceDefaultSettings}
                  />
                </Form.Item>
                {deviceType && renderNetwork()}
              </fieldset>
              {deviceType && deviceSettings && (
                <DeviceSettingsFormItems deviceType={deviceType} settings={deviceSettings} />
              )}
              {deviceType && isBLEGateway(deviceType) && (
                <fieldset>
                  <legend>{intl.get('wireless.network.settings')}</legend>
                  <WsnFormItem />
                </fieldset>
              )}
            </Form>
          </Col>
        </Row>
      </>
    </ModalWrapper>
  );
};
