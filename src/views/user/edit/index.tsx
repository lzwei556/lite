import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
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
      title={intl.get('EDIT_USER')}
      okText={intl.get('SAVE')}
      onOk={onSave}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical' initialValues={user}>
        <TextFormItem label='USERNAME' name='username' inputProps={{ disabled: true }} />
        {user.id !== 1 && (
          <SelectFormItem
            label='USER_ROLE'
            name='role'
            rules={[{ required: true }]}
            selectProps={roleSelectProps}
          />
        )}
        <TextFormItem
          label='CELLPHONE'
          name='phone'
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: intl.get('phone.is.invalid') }]}
        />
        <TextFormItem
          label='EMAIL'
          name='email'
          rules={[{ type: 'email', message: intl.get('email.is.invalid') }]}
        />
      </Form>
    </ModalWrapper>
  );
};
