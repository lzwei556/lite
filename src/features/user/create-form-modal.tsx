import { Form } from 'antd';
import { FormItem } from 'components';
import { ModalWrapper } from 'components/modalWrapper';
import { CreateData, Fields } from 'domain/user';
import React from 'react';
import intl from 'react-intl-universal';
import { FormSubmittingProps, ModalFormProps } from 'types/common';

export const CreateFormModal = ({
  loading,
  handleSubmit,
  onSuccess,
  ...rest
}: ModalFormProps & FormSubmittingProps<CreateData>) => {
  const [form] = Form.useForm<CreateData>();
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={intl.get('CREATE_USER')}
      onOk={() => form.validateFields().then(handleSubmit)}
      okText={intl.get('CREATE')}
      confirmLoading={loading}
    >
      <Form form={form} layout='vertical'>
        {Object.values(Fields).map((field) => (
          <FormItem key={field.name} {...field} />
        ))}
      </Form>
    </ModalWrapper>
  );
};
