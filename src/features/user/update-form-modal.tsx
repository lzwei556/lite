import React from 'react';
import { FormSubmittingProps, ModalFormProps } from 'types/common';
import { Fields, UpdateData, User } from 'domain/user';
import { ModalWrapper } from 'components/modalWrapper';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { TextFormItem } from 'components';

export const UpdateFormModal = ({
  user,
  loading,
  handleSubmit,
  onSuccess,
  ...rest
}: ModalFormProps & FormSubmittingProps<UpdateData> & { user: User }) => {
  const [form] = Form.useForm();
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={intl.get('EDIT_USER')}
      okText={intl.get('SAVE')}
      onOk={() => form.validateFields().then(handleSubmit)}
      confirmLoading={loading}
    >
      <Form form={form} layout='vertical' initialValues={user}>
        <TextFormItem {...Fields.Username} />
        <TextFormItem {...Fields.Role} />
        <TextFormItem {...Fields.Phone} />
        <TextFormItem {...Fields.Email} />
      </Form>
    </ModalWrapper>
  );
};
