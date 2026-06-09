import { Form, ModalProps } from 'antd';
import { FormItem } from 'components';
import { ModalWrapper } from 'components/modalWrapper';
import { CreateData, Fields } from 'domains/user';
import React from 'react';
import intl from 'react-intl-universal';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { RolesSelectFormItem } from './roles-select-form-item';
import { ProjectsSelectFormItem } from './projects-select-form-item';
import { toUniversalFormItemProps } from 'types';

export const CreateFormModal = ({
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<any, CreateData>) => {
  const [form] = Form.useForm<CreateData>();
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      onCancel={close}
      onOk={() => form.validateFields().then(createSubmitHandler(submit, close))}
      okText={intl.get('CREATE')}
      confirmLoading={loading}
      title={intl.get('CREATE_USER')}
    >
      <Form form={form} layout='vertical'>
        {Object.values(Fields).map((field) => {
          return field.name === Fields.Role.name ? (
            <RolesSelectFormItem key={field.name} />
          ) : field.name === Fields.Projects.name ? (
            <ProjectsSelectFormItem key={field.name} />
          ) : (
            <FormItem key={field.name} {...toUniversalFormItemProps({ field })} />
          );
        })}
      </Form>
    </ModalWrapper>
  );
};
