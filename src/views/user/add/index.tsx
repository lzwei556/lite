import { Form, Input } from 'antd';
import { useState } from 'react';
import intl from 'react-intl-universal';
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
      title={intl.get('CREATE_USER')}
      onOk={onAdd}
      okText={intl.get('CREATE')}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <TextFormItem
          label='USERNAME'
          name='username'
          rules={[{ required: true }, { min: 4, max: 16 }]}
        />
        <TextFormItem
          label='PASSWORD'
          name='password'
          rules={[{ required: true }, { min: 6, max: 16 }]}
        >
          <Input.Password />
        </TextFormItem>
        <TextFormItem
          label='CONFIRM_PASSWORD'
          name='confirmPwd'
          rules={[
            { required: true, message: intl.get('PLEASE_CONFIRM_PASSWORD') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(intl.get('PASSWORDS_ARE_INCONSISTENT')));
              }
            })
          ]}
        >
          <Input.Password />
        </TextFormItem>
        <SelectFormItem
          label='USER_ROLE'
          name='role'
          rules={[{ required: true }]}
          selectProps={useRoleSelectProps()}
        />
        <TextFormItem
          label='CELLPHONE'
          name='phone'
          initialValue={''}
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: intl.get('phone.is.invalid') }]}
        />
        <TextFormItem
          label='EMAIL'
          name='email'
          initialValue={''}
          rules={[{ type: 'email', message: intl.get('email.is.invalid') }]}
        />
        <SelectFormItem
          label='BIND_PROJECT'
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
