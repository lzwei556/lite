import React from 'react';
import { Col } from 'antd';
import { Grid, SelectFormItem, TextFormItem } from '../../../components';
import { DeviceType } from '../../../types/device_type';
import { FormItemsProps } from '../settings-common';
import { ParentsSelect } from './parentsSelect';
import { useContext } from './context';
import {
  useProps,
  useProtocolProps,
  useParentProps,
  CommonProps,
  useFilterParentDeviceTypes,
  WanProtocol,
  useDisabledProtocal
} from './hooks';

export const FormItems = ({
  form,
  formItemColProps
}: CommonProps & Pick<FormItemsProps, 'formItemColProps'>) => {
  const { deviceType } = useContext();
  const { deviceName, mac, deviceTypeProps, port } = useProps(form);
  const filterTypes = useFilterParentDeviceTypes(deviceType);

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
        <>
          {DeviceType.isRootDevice(deviceType) ? (
            <RootDeviceFormItems
              form={form}
              formItemColProps={formItemColProps}
              deviceType={deviceType}
            />
          ) : (
            <Col {...formItemColProps}>
              <ParentFormItemsSection form={form} filterTypes={filterTypes} />
            </Col>
          )}
        </>
      )}
      {DeviceType.OilFiller === deviceType && (
        <Col {...formItemColProps}>
          <SelectFormItem {...port} />
        </Col>
      )}
    </Grid>
  );
};

const RootDeviceFormItems = ({
  form,
  formItemColProps,
  deviceType
}: CommonProps & Pick<FormItemsProps, 'formItemColProps'> & { deviceType: DeviceType }) => {
  const { tag, applicationId } = useProps(form);
  const { selectProps, ...rest } = useProtocolProps();
  const disabledProtocol = useDisabledProtocal(deviceType);
  if (DeviceType.isLoraWAN(deviceType)) {
    return (
      <>
        <Col {...formItemColProps}>
          <TextFormItem hidden={true} {...rest} />
          <TextFormItem {...tag} />
        </Col>
        <Col {...formItemColProps}>
          <TextFormItem {...applicationId} />
        </Col>
      </>
    );
  } else {
    return (
      <Col {...formItemColProps}>
        <ProtocolFormItem disabledValue={disabledProtocol} />
      </Col>
    );
  }
};

const ProtocolFormItem = ({ disabledValue }: { disabledValue?: WanProtocol }) => {
  return <SelectFormItem {...useProtocolProps(disabledValue)} />;
};

const ParentFormItemsSection = ({
  form,
  filterTypes
}: CommonProps & { filterTypes?: DeviceType[] }) => {
  const { networkId, parent, selectProps, network } = useParentProps(form, filterTypes);
  return (
    <>
      <SelectFormItem {...parent}>
        <ParentsSelect {...selectProps} />
      </SelectFormItem>
      {networkId && <TextFormItem {...network} />}
    </>
  );
};
