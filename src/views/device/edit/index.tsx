import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { DeviceType } from '../../../types/device_type';
import { Card } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import * as WSN from '../../../features/wsn';
import * as NetworkNS from '../../../features/network';
import { useFormBindingsProps } from '../../../hooks';
import * as Basis from '../basis-form-items';
import {
  FormCommonProps,
  isBLEGateway,
  tranformDeviceDTO2Entity,
  useGroupCardProps
} from '../settings-common';
import { DevicesTable } from './devicesTable';
import { SettingsSectionForm } from './sectionForm';
import { Toolbar } from './toolbar';
import { useUpdate, useUpdateNetwork } from './hooks';

type Props = FormCommonProps & { onUpdate: () => void };

export const Index = ({ network, ...rest }: Props) => {
  const { device } = rest;
  return (
    <Basis.ContextProvier device={device}>
      <BasisEditForm {...rest} />
      <SettingsSectionForm device={device} />
      {isBLEGateway(device.typeId) && network && <WSNEditForm network={network} />}
      {DeviceType.isGateway(device.typeId) && (
        <Card size='small' title={intl.get('MENU_DEVICE_LSIT')}>
          <DevicesTable {...rest} />
        </Card>
      )}
    </Basis.ContextProvier>
  );
};

const BasisEditForm = (props: Props) => {
  const { formProps, groupCardProps, formItemsProps } = useBasisFormEditProps(props);
  return (
    <Form {...formProps}>
      <Card {...groupCardProps}>
        <Basis.FormItems {...formItemsProps} />
      </Card>
    </Form>
  );
};

const useBasisFormEditProps = ({ device, onUpdate }: Props) => {
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues: tranformDeviceDTO2Entity(device)
  });
  const { form } = formProps;
  return {
    formProps,
    groupCardProps: useGroupCardProps({
      extra: <Toolbar {...{ device, form, ...useUpdate(device.id, onUpdate) }} />,
      title: intl.get('BASIC_INFORMATION')
    }),
    formItemsProps: { form, formItemColProps: generateColProps({ xl: 12, xxl: 8 }) }
  };
};

const WSNEditForm = ({ network }: Pick<Props, 'network'>) => {
  const { formProps, groupCardProps, formItemsProps } = useWSNFormEditProps(network!);
  return (
    <Form {...formProps}>
      <Card {...groupCardProps}>
        <WSN.FormItems {...formItemsProps} />
      </Card>
    </Form>
  );
};

const useWSNFormEditProps = (network: NonNullable<Props['network']>) => {
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues: NetworkNS.tranformNetwork2WSNUpdate(network)
  });
  const { form } = formProps;
  return {
    formProps,
    groupCardProps: useGroupCardProps({
      extra: <Toolbar {...{ form, ...useUpdateNetwork(network) }} />,
      title: intl.get('wireless.network.settings')
    }),
    formItemsProps: {
      form,
      formItemColProps: generateColProps({ xl: 12, xxl: 8 }),
      initial: {
        ...NetworkNS.tranformNetwork2WSNUpdate(network).wsn,
        provisioning_mode: network.mode
      },
      setFieldsValue: form.setFieldsValue
    }
  };
};
