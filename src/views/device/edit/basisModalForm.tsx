import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { useFormBindingsProps, useModalBindingsProps } from '../../../hooks';
import { generateColProps } from '../../../utils/grid';
import {
  FormCommonProps,
  FormSubmitButtonProps,
  tranformDeviceDTO2Entity
} from '../settings-common';
import * as Basis from '../basis-form-items';
import { useUpdate } from './hooks';

type Props = ModalFormProps & Pick<FormCommonProps, 'device'>;

export const BasisModalForm = (props: Props) => {
  const { modalProps, formProps, basisFormItemsProps } = useProps(props);

  return (
    <Basis.ContextProvier device={props.device}>
      <ModalWrapper {...modalProps}>
        <Form {...formProps}>
          <Basis.FormItems {...basisFormItemsProps} />
        </Form>
      </ModalWrapper>
    </Basis.ContextProvier>
  );
};

const useProps = (props: Props) => {
  const { device, onSuccess } = props;
  const formProps = useFormBindingsProps({
    layout: 'vertical',
    initialValues: tranformDeviceDTO2Entity(device)
  });
  const { form } = formProps;
  const modalProps = useModalProps({ ...props, ...useUpdate(device.id, onSuccess), form });
  return {
    formProps,
    modalProps,
    basisFormItemsProps: { form, formItemColProps: generateColProps({}) }
  };
};

const useModalProps = (props: ModalFormProps & FormSubmitButtonProps) => {
  const { form, loading, handleSubmit, ...rest } = props;
  return useModalBindingsProps({
    ...rest,
    afterClose: () => form?.resetFields(),
    okButtonProps: { loading },
    okText: intl.get('SAVE'),
    onOk: () => form?.validateFields().then(handleSubmit),
    title: intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE') })
  });
};
