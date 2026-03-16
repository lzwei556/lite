import React from 'react';
import { ButtonProps, ResultProps } from 'antd';
import { Translation } from 'locales/utils';
import { useFormBindingsProps, useModalBindingsProps } from '../../../hooks';
import { ModalFormProps } from '../../../types/common';
import { DeviceType } from '../../../types/device_type';
import { generateColProps } from '../../../utils/grid';
import { CreateNetworkRequest } from '../../../apis/network';
import { AddDeviceRequest } from '../../../apis/device';
import { transform, transform2UpdateDTO } from '../../../wsn';
import { FormCommonProps, transformSettings, useGroupCardProps } from '../settings-common';
import * as Basis from '../basis-form-items';
import { useContext } from '..';

export const useProps2 = (onSuccess: () => void) => {
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues: { ...transform(), protocol: Basis.WanProtocol.Tlv }
  });
  const { form } = formProps;
  const { success, ...createProps } = useCreate(form, onSuccess);

  return {
    formProps,
    success,
    ...createProps.successProps,
    handleSubmit: createProps.handleSubmit,
    ...useFormSectionProps(form, generateColProps({ xl: 12, xxl: 8 }))
  };
};

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

const useCreate = (form: FormCommonProps['form'], onSuccess?: () => void): CreateProps => {
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
        title: Translation.get('feedback.success.create')
      },
      continueButtonProps: {
        children: Translation.get('common.action.continue'),
        type: 'primary',
        onClick: () => {
          form?.resetFields(['name', 'mac_address', 'parent', 'sensors']);
          form?.setFieldsValue(transform());
          setSuccess(false);
        }
      },
      closeButtonProps: { children: Translation.get('common.action.return'), onClick: onSuccess }
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
    okText: Translation.get('common.action.create'),
    onOk: () => form?.validateFields().then(handleSubmit),
    title: Translation.createSth('device'),
    width: 640
  });
};

const useFormSectionProps = (
  form: FormCommonProps['form'],
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
) => {
  const { deviceType, settings } = Basis.useContext();
  return {
    deviceType,
    basis: {
      cardProps: useGroupCardProps({
        style: { marginBottom: 16 },
        title: Translation.get('common.basic')
      }),
      formItemsProps: { form, formItemColProps }
    },
    settings: { deviceType, settings, formItemColProps, groupCardProps: useGroupCardProps({}) },
    wsn: {
      cardProps: useGroupCardProps({
        title: Translation.get('wsn.settings')
      }),
      formItemsProps: { formItemColProps, form }
    }
  };
};
