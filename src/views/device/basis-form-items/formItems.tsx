import React from 'react';
import { Col } from 'antd';
import { Grid, SelectFormItem, TextFormItem } from '../../../components';
import { DeviceType } from '../../../types/device_type';
import { FormItemsProps } from '../settings-common';
import { ParentsSelect } from './parentsSelect';
import { useContext } from './context';
import { useProps, useProtocolProps, useParentProps, CommonProps } from './hooks';

export const FormItems = ({
  form,
  formItemColProps
}: CommonProps & Pick<FormItemsProps, 'formItemColProps'>) => {
  const { deviceType } = useContext();
  const { deviceName, mac, deviceTypeProps } = useProps(form);

  return (
    <Grid>
      <Col {...formItemColProps}>
        <TextFormItem {...deviceName} />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem {...mac} />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem {...deviceTypeProps} />
      </Col>
      {deviceType && (
        <Col {...formItemColProps}>
          {DeviceType.isRootDevice(deviceType) ? (
            <ProtocolFormItem />
          ) : (
            <ParentFormItemsSection form={form} />
          )}
        </Col>
      )}
    </Grid>
  );
};

const ProtocolFormItem = () => {
  return <SelectFormItem {...useProtocolProps()} />;
};

const ParentFormItemsSection = ({ form }: CommonProps) => {
  const { networkId, parent, selectProps, network } = useParentProps(form);
  return (
    <>
      <SelectFormItem {...parent}>
        <ParentsSelect {...selectProps} />
      </SelectFormItem>
      {networkId && <TextFormItem {...network} />}
    </>
  );
};
