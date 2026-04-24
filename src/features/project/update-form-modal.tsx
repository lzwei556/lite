import React from 'react';
import { ActionState } from 'types/common';
import { Fields, UpdateData, Project } from 'domain/project';
import { ModalWrapper } from 'components/modalWrapper';
import { ModalProps, Form } from 'antd';
import intl from 'react-intl-universal';
import { FormItem } from 'components';
import { toUniversalFormItemProps } from 'types';

export const UpdateFormModal = ({
  project,
  loading,
  submit,
  ...rest
}: ModalProps & ActionState<UpdateData> & { project: Project }) => {
  const [form] = Form.useForm<UpdateData['data']>();
  debugger;
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => {
        rest.afterClose?.();
        form.resetFields();
      }}
      title={intl.get('EDIT_PROJECT')}
      okText={intl.get('SAVE')}
      onOk={() => form.validateFields().then((values) => submit({ id: project.id, data: values }))}
      confirmLoading={loading}
    >
      <Form form={form} layout='vertical' initialValues={project}>
        {[Fields.Name, Fields.Description].map((field) => (
          <FormItem key={field.name} {...toUniversalFormItemProps({ field })} />
        ))}
        <FormItem {...toUniversalFormItemProps({ field: Fields.Type, disabled: true })} />
      </Form>
    </ModalWrapper>
  );
};
