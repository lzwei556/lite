import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from 'components/modalWrapper';
import { FormItem } from 'components';
import { toUniversalFormItemProps } from 'types';
import { Fields, createPasswordConfirmField } from 'domain/user';
import { UpdatePasswordData } from 'domain/auth';
import { ActionModalContext, createSubmitHandler } from 'resource';


export function UpdatePasswordModal(ctx: ActionModalContext<any, UpdatePasswordData>) {
  const { open, close, submit, loading } = ctx;
  const [form] = Form.useForm<UpdatePasswordData>();

  const onSave = () => {
    form.validateFields().then(createSubmitHandler(submit, close));
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      open={open}
      title={intl.get('MODIFY_PASSWORD')}
      onOk={onSave}
      onCancel={close}
      confirmLoading={loading}
    >
      <Form form={form} layout='vertical'>
        <FormItem
          {...toUniversalFormItemProps({
            field: { ...Fields.Password, name: 'old', label: 'OLD_PASSWORD' }
          })}
        />
        <FormItem
          {...toUniversalFormItemProps({
            field: { ...Fields.Password, name: 'new', label: 'NEW_PASSWORD' }
          })}
        />
        <FormItem
          {...toUniversalFormItemProps({
            field: createPasswordConfirmField({ dependsOn: 'new' })
          })}
        />
      </Form>
    </ModalWrapper>
  );
}
