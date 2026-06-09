import React from 'react';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { Fields, UpdateData, User } from 'domains/user';
import { ModalWrapper } from 'components/modalWrapper';
import { Form, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { FormItem, TextFormItem } from 'components';
import { RolesSelectFormItem } from './roles-select-form-item';

export const UpdateFormModal = ({
  record: user,
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<User, UpdateData>) => {
  const [form] = Form.useForm<UpdateData['data']>();
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      onCancel={close}
      okText={intl.get('SAVE')}
      onOk={() =>
        form
          .validateFields()
          .then(
            createSubmitHandler(
              user ? (values) => submit({ id: user.id, data: values }) : undefined,
              close
            )
          )
      }
      confirmLoading={loading}
      title={intl.get('EDIT_USER')}
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
