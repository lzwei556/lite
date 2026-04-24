import React from 'react';
import { ActionState } from 'types/common';
import { Fields, UpdateData, User } from 'domain/user';
import { ModalWrapper } from 'components/modalWrapper';
import { Form, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { FormItem, TextFormItem } from 'components';
import { RolesSelectFormItem } from './roles-select-form-item';

export const UpdateFormModal = ({
  user,
  loading,
  submit,
  ...rest
}: ModalProps & ActionState<UpdateData> & { user: User }) => {
  const [form] = Form.useForm<UpdateData['data']>();
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => {
        rest.afterClose?.();
        form.resetFields();
      }}
      title={intl.get('EDIT_USER')}
      okText={intl.get('SAVE')}
      onOk={() => form.validateFields().then((values) => submit({ id: user.id, data: values }))}
      confirmLoading={loading}
    >
      <Form form={form} layout='vertical' initialValues={user}>
        <TextFormItem {...Fields.Username} inputProps={{ readOnly: true }} />
        <RolesSelectFormItem key={Fields.Role.name} />
        {[Fields.Phone, Fields.Email].map((field) => (
          <FormItem key={field.name} {...field} />
        ))}
      </Form>
    </ModalWrapper>
  );
};
