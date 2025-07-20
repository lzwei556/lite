import React from 'react';
import { ButtonProps, ResultProps } from 'antd';
import intl from 'react-intl-universal';
import { useFormBindingsProps, useModalBindingsProps } from '../../../hooks';
import { ModalFormProps } from '../../../types/common';
import { DeviceType } from '../../../types/device_type';
import { generateColProps } from '../../../utils/grid';
import { CreateNetworkRequest } from '../../../apis/network';
import { AddDeviceRequest } from '../../../apis/device';
import { transform, transform2UpdateDTO } from '../../../features/wsn';
import { FormCommonProps, transformSettings, useGroupCardProps } from '../settings-common';
import * as Basis from '../basis-form-items';
import { useContext } from '..';

export const useProps = (props: ModalFormProps) => {
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues: { ...transform(), protocol: Basis.WanProtocol.Tlv }
  });
  const { form } = formProps;
  const { success, ...createProps } = useCreate(form, props.onSuccess);
  const modalProps = useModalProps({ ...props, form, success, ...createProps });
  return {
    formProps,
    modalProps,
    success,
    ...createProps.successProps,
    ...useFormSectionProps(form)
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

const useCreate = (form: FormCommonProps['form'], onSuccess: () => void): CreateProps => {
  const [success, setSuccess] = React.useState(false);
  const { refresh } = useContext();

  const handleSubmit = (values: any) => {
    if (values) {
      if (DeviceType.isGateway(values.type)) {
        CreateNetworkRequest(
          transform2UpdateDTO({
            ...values,
            gateway: {
              mac_address: values.mac_address,
              type: values.type,
              protocol: values.protocol
            }
          })
        ).then((_) => {
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
        subTitle: intl.get('DEVICE_CREATED_NEXT_PROMPT'),
        title: intl.get('CREATED_SUCCESSFUL')
      },
      continueButtonProps: {
        children: intl.get('CONTINUE_TO_CREATE_DEVICE'),
        type: 'primary',
        onClick: () => {
          form?.resetFields(['name', 'mac_address']);
          setSuccess(false);
        }
      },
      closeButtonProps: { children: intl.get('close'), onClick: onSuccess }
    },
    handleSubmit
  };
};

const useModalProps = (
  props: ModalFormProps &
    Pick<FormCommonProps, 'form'> &
    Pick<CreateProps, 'success' | 'handleSubmit'>
) => {
  const { form, success, handleSubmit, ...rest } = props;
  return useModalBindingsProps({
    ...rest,
    afterClose: () => form?.resetFields(),
    footer: success ? null : undefined,
    okText: intl.get('CREATE'),
    onOk: () => form?.validateFields().then(handleSubmit),
    title: intl.get('CREATE_DEVICE'),
    width: 640
  });
};

const useFormSectionProps = (form: FormCommonProps['form']) => {
  const { deviceType, settings } = Basis.useContext();
  const formItemColProps = generateColProps({ xl: 12, xxl: 12 });
  return {
    deviceType,
    basis: {
      cardProps: useGroupCardProps({ title: intl.get('BASIC_INFORMATION') }),
      formItemsProps: { form, formItemColProps }
    },
    settings: { deviceType, settings, formItemColProps, groupCardProps: useGroupCardProps({}) },
    wsn: {
      cardProps: useGroupCardProps({
        title: intl.get('wireless.network.settings')
      }),
      formItemsProps: { formItemColProps, form }
    }
  };
};
