import React from 'react';
import {
  ButtonProps,
  ColProps,
  Form,
  FormInstance,
  FormProps,
  ModalProps,
  ResultProps
} from 'antd';
import { CardProps } from '../../../components';
import { ModalFormProps } from '../../../types/common';
import { DeviceType } from '../../../types/device_type';
import { generateColProps } from '../../../utils/grid';
import { createReactIntlTextNode } from '../../../utils';
import { CreateNetworkRequest } from '../../../apis/network';
import { AddDeviceRequest } from '../../../apis/device';
import { transformSettings, useGroupCardProps } from '../settings-common';
import { useContext } from '..';

export type AddFormProps = {
  formProps: FormProps;
  basisCardProps: CardProps;
  wsnCardProps: CardProps;
  formItemColProps: ColProps;
};

export const useAddFormProps = (): AddFormProps => {
  const [form] = Form.useForm();
  return {
    formProps: { form, layout: 'vertical' },
    basisCardProps: useGroupCardProps({ title: createReactIntlTextNode('BASIC_INFORMATION') }),
    wsnCardProps: useGroupCardProps({
      title: createReactIntlTextNode('wireless.network.settings')
    }),
    formItemColProps: generateColProps({ xl: 12, xxl: 12 })
  };
};

export const useModalProps = (
  props: ModalFormProps & { form: FormInstance } & Pick<CreateProps, 'success' | 'handleSubmit'>
): ModalProps => {
  const { form, success, handleSubmit, ...rest } = props;

  return {
    ...rest,
    afterClose: () => form.resetFields(),
    footer: success ? null : undefined,
    okText: createReactIntlTextNode('CREATE'),
    onOk: () => form.validateFields().then(handleSubmit),
    title: createReactIntlTextNode('CREATE_DEVICE'),
    width: 640
  };
};

type CreateProps = {
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  successProps: {
    result: ResultProps;
    continueButtonProps: ButtonProps;
    closeButtonProps: ButtonProps;
  };
  handleSubmit: (values: any) => void;
};

export const useCreate = (form: FormInstance, onSuccess: () => void): CreateProps => {
  const [success, setSuccess] = React.useState(false);
  const { refresh } = useContext();

  const handleSubmit = (values: any) => {
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
        AddDeviceRequest({ ...values, sensors: transformSettings(values.sensors) }).then(() => {
          setSuccess(true);
          refresh();
        });
      }
    }
  };

  return {
    success,
    setSuccess,
    successProps: {
      result: {
        status: 'success',
        subTitle: createReactIntlTextNode('DEVICE_CREATED_NEXT_PROMPT'),
        title: createReactIntlTextNode('CREATED_SUCCESSFUL')
      },
      continueButtonProps: {
        children: createReactIntlTextNode('CONTINUE_TO_CREATE_DEVICE'),
        type: 'primary',
        onClick: () => {
          form.resetFields();
          setSuccess(false);
        }
      },
      closeButtonProps: { children: createReactIntlTextNode('close'), onClick: onSuccess }
    },
    handleSubmit
  };
};
