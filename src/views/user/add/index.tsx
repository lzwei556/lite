import { Form, Input } from 'antd';
import { useState } from 'react';
import { Translation } from 'locales/utils';
import { GetProjectsRequest } from '../../../apis/project';
import { AddUserRequest } from '../../../apis/user';
import { Project } from '../../../types/project';
import { ModalWrapper } from '../../../components/modalWrapper';
import { SelectFormItem, TextFormItem } from '../../../components';
import { ModalFormProps } from '../../../types/common';
import { useRoleSelectProps } from '../use-roles';

export const AddUserModal = (props: ModalFormProps) => {
  const { onSuccess, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form] = Form.useForm();

  const onAdd = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      AddUserRequest(values)
        .then((_) => {
          onSuccess();
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={Translation.createSth('label.user')}
      onOk={onAdd}
      okText={Translation.get('common.action.create')}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <TextFormItem
          label='auth.username'
          name='username'
          rules={[{ required: true }, { min: 4, max: 16 }]}
        />
        <TextFormItem
          label='auth.password'
          name='password'
          rules={[{ required: true }, { min: 6, max: 16 }]}
        >
          <Input.Password />
        </TextFormItem>
        <TextFormItem
          label='auth.password.confirmation'
          name='confirmPwd'
          rules={[
            {
              required: true,
              message: Translation.pleaseDoSth('common.action.confirm', 'auth.password')
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(Translation.get('auth.password.inconsistent')));
              }
            })
          ]}
        >
          <Input.Password />
        </TextFormItem>
        <SelectFormItem
          label='auth.role'
          name='role'
          rules={[{ required: true }]}
          selectProps={useRoleSelectProps()}
        />
        <TextFormItem
          label='common.mobile.phone'
          name='phone'
          initialValue={''}
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'feedback.invalid.phone' }]}
        />
        <TextFormItem
          label='common.email'
          name='email'
          initialValue={''}
          rules={[{ type: 'email', message: 'feedback.invalid.email' }]}
        />
        <SelectFormItem
          label='project'
          name='projects'
          initialValue={[]}
          selectProps={{
            mode: 'multiple',
            onDropdownVisibleChange: (open) => {
              if (open) {
                GetProjectsRequest().then(setProjects);
              }
            },
            options: projects.map((p) => ({ label: p.name, value: p.id }))
          }}
        />
      </Form>
    </ModalWrapper>
  );
};
