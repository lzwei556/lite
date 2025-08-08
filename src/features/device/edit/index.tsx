import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { DeviceType } from '../../../types/device_type';
import { Card } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import * as WSN from '../../../wsn';
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
      {DeviceType.isGateway(device.typeId) && <DevicesTable {...rest} />}
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
      extra: <Toolbar {...{ form, ...useUpdate(device.id, onUpdate) }} />,
      style: { marginBottom: 0 },
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
  const initialValues = WSN.transform(network);
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues
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
      initial: initialValues
    }
  };
};
