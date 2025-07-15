import React from 'react';
import { Form, FormInstance, FormProps, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { ModalWrapper } from '../../../components/modalWrapper';
import { generateColProps } from '../../../utils/grid';
import { tranformDeviceDTO2Entity } from '../settings-common';
import * as Basis from '../basis-form-items';
import { useUpdate } from './hooks';

export const BasisModalForm = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess } = props;
  const formProps = useFormProps(device);
  const updateProps = useUpdate(device.id, onSuccess);
  const modalProps = useModalProps({ ...props, ...updateProps, form: formProps.form! });

  return (
    <ModalWrapper {...modalProps}>
      <Basis.ContextProvier form={formProps.form} device={device}>
        <Form {...formProps}>
          <Basis.FormItems formItemColProps={generateColProps({})} />
        </Form>
      </Basis.ContextProvier>
    </ModalWrapper>
  );
};

const useFormProps = (device: Device) => {
  const [form] = Form.useForm();
  return { form, layout: 'vertical', initialValues: tranformDeviceDTO2Entity(device) } as FormProps;
};

const useModalProps = (
  props: ModalFormProps & { form: FormInstance } & { handleSubmit: (values: any) => void } & {
    loading: boolean;
  }
): ModalProps => {
  const { form, loading, handleSubmit, ...rest } = props;
  return {
    ...rest,
    afterClose: () => form.resetFields(),
    okButtonProps: { loading },
    okText: intl.get('SAVE'),
    onOk: () => form.validateFields().then(handleSubmit),
    title: intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE') })
  };
};
