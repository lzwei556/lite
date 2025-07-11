import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { Device } from '../../../types/device';
import { Network } from '../../../types/network';
import { DeviceType } from '../../../types/device_type';
import { Card } from '../../../components';
import { createReactIntlTextNode } from '../../../utils';
import { generateColProps } from '../../../utils/grid';
import * as Basis from '../basis-form-items';
import {
  isBLEGateway,
  tranformDeviceDTO2Entity,
  useGroupCardProps,
  WsnFormItems
} from '../settings-common';
import { DevicesTable } from './devicesTable';
import { SettingsSectionForm } from './sectionForm';
import { SaveIconButton } from './saveIconButton';
import { FormEditProps, UpdateProps, useUpdate, useUpdateNetwork } from './hooks';

export const Index = ({
  device,
  network,
  onUpdate
}: {
  device: Device;
  onUpdate: () => void;
  network?: Network;
}) => {
  const [form] = Form.useForm();
  return (
    <Basis.ContextProvier device={device} form={form}>
      <BasisEditForm device={device} onUpdate={onUpdate} />
      <SettingsSectionForm device={device} />
      {isBLEGateway(device.typeId) && network && <WSNEditForm network={network} />}
      {DeviceType.isGateway(device.typeId) && (
        <Card size='small' title={intl.get('MENU_DEVICE_LSIT')}>
          <DevicesTable device={device} onUpdate={onUpdate} />
        </Card>
      )}
    </Basis.ContextProvier>
  );
};

const BasisEditForm = ({ device, onUpdate }: { device: Device; onUpdate?: () => void }) => {
  const updateProps = useUpdate(device.id, onUpdate);
  const { formProps, groupCardProps, groupCardPropsExtra, formItemColProps } =
    useBasisFormEditProps(device, updateProps);
  return (
    <Form {...formProps}>
      <Card
        {...{
          ...groupCardProps,
          extra: <SaveIconButton {...groupCardPropsExtra.saveButton} />
        }}
      >
        <Basis.FormItems formItemColProps={formItemColProps} />
      </Card>
    </Form>
  );
};

const useBasisFormEditProps = (device: Device, updateProps: UpdateProps): FormEditProps => {
  const [form] = Form.useForm();
  return {
    formProps: {
      form,
      layout: 'vertical',
      initialValues: tranformDeviceDTO2Entity(device)
    },
    groupCardProps: useGroupCardProps({ title: createReactIntlTextNode('BASIC_INFORMATION') }),
    groupCardPropsExtra: {
      saveButton: {
        onClick: () => form.validateFields().then(updateProps.handleSubmit),
        loading: updateProps.loading
      }
    },
    formItemColProps: generateColProps({ xl: 12, xxl: 8 })
  };
};

const WSNEditForm = ({ network }: { network: Network }) => {
  const updateProps = useUpdateNetwork(network);
  const { formProps, groupCardProps, groupCardPropsExtra, formItemColProps } = useWSNFormEditProps(
    network,
    updateProps
  );
  return (
    <Form {...formProps}>
      <Card
        {...{
          ...groupCardProps,
          extra: <SaveIconButton {...groupCardPropsExtra.saveButton} />
        }}
      >
        <WsnFormItems formItemColProps={formItemColProps} mode={network.mode} />
      </Card>
    </Form>
  );
};

const useWSNFormEditProps = (network: Network, updateProps: UpdateProps): FormEditProps => {
  const [form] = Form.useForm();
  return {
    formProps: {
      form,
      layout: 'vertical',
      initialValues: tranformNetworkDTO2Entity(network)
    },
    groupCardProps: useGroupCardProps({
      title: createReactIntlTextNode('wireless.network.settings')
    }),
    groupCardPropsExtra: {
      saveButton: {
        onClick: () => form.validateFields().then(updateProps.handleSubmit),
        loading: updateProps.loading
      }
    },
    formItemColProps: generateColProps({ xl: 12, xxl: 8 })
  };
};

const tranformNetworkDTO2Entity = (network: Network) => {
  return {
    mode: network.mode,
    wsn: {
      communication_period: network.communicationPeriod,
      communication_period_2: network.communicationPeriod2,
      communication_offset: network.communicationOffset,
      group_size: network.groupSize,
      group_size_2: network.groupSize2,
      interval_cnt: network.intervalCnt
    }
  };
};
