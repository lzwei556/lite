import { ModalProps, Form } from 'antd';
import { FormItem } from 'components';
import { ModalWrapper } from 'components/modalWrapper';
import { CreateData, Fields, useProjectTypeField } from 'domains/project';
import React from 'react';
import intl from 'react-intl-universal';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { toUniversalFormItemProps } from 'types';

export const CreateFormModal = ({
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<any, CreateData>) => {
  const [form] = Form.useForm<CreateData>();
  const typeField = useProjectTypeField();

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      onCancel={close}
      onOk={() => form.validateFields().then(createSubmitHandler(submit, close))}
      okText={intl.get('CREATE')}
      confirmLoading={loading}
      title={intl.get('CREATE_PROJECT')}
    >
      <Form form={form} layout='vertical'>
        {[Fields.Name, Fields.Description].map((field) => (
          <FormItem key={field.name} {...toUniversalFormItemProps({ field })} />
        ))}
        {typeField && <FormItem {...toUniversalFormItemProps({ field: typeField })} />}
      </Form>
    </ModalWrapper>
  );
};
