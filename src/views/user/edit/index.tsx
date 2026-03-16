import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { UpdateUserRequest } from '../../../apis/user';
import { User } from '../../../types/user';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { SelectFormItem, TextFormItem } from '../../../components';
import { useRoleSelectProps } from '../use-roles';

export const EditUserModal = (props: ModalFormProps & { user: User }) => {
  const { onSuccess, user, ...rest } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [form] = Form.useForm();
  const roleSelectProps = useRoleSelectProps();

  const onSave = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      UpdateUserRequest(user.id, values)
        .then((_) => {
          setIsLoading(false);
          onSuccess();
        })
        .finally(() => setIsLoading(false));
    });
  };

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={Translation.editSth('label.user')}
      okText={Translation.get('common.action.save')}
      onOk={onSave}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical' initialValues={user}>
        <TextFormItem label='auth.username' name='username' inputProps={{ disabled: true }} />
        {user.id !== 1 && (
          <SelectFormItem
            label='auth.role'
            name='role'
            rules={[{ required: true }]}
            selectProps={roleSelectProps}
          />
        )}
        <TextFormItem
          label='common.mobile.phone'
          name='phone'
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'feedback.invalid.phone' }]}
        />
        <TextFormItem
          label='common.email'
          name='email'
          rules={[{ type: 'email', message: 'feedback.invalid.email' }]}
        />
      </Form>
    </ModalWrapper>
  );
};
