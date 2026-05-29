import React from 'react';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { Fields, UpdateData, Project } from 'domain/project';
import { ModalWrapper } from 'components/modalWrapper';
import { ModalProps, Form } from 'antd';
import intl from 'react-intl-universal';
import { FormItem } from 'components';
import { toUniversalFormItemProps } from 'types';

export const UpdateFormModal = ({
  record: project,
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<Project, UpdateData>) => {
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
              project ? (values) => submit({ id: project.id, data: values }) : undefined,
              close
            )
          )
      }
      confirmLoading={loading}
      title={intl.get('EDIT_PROJECT')}
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
