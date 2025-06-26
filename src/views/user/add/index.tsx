import { Form, Input, Select, Typography } from 'antd';
import { AddUserRequest } from '../../../apis/user';
import { useEffect, useState } from 'react';
import RoleSelect from '../../../components/roleSelect';
import { GetProjectsRequest } from '../../../apis/project';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
import { useLocaleFormLayout } from '../../../hooks/useLocaleFormLayout';
import { ModalWrapper } from '../../../components/modalWrapper';

export interface AddUserProps {
  open: boolean;
  onCancel?: () => void;
  onSuccess: () => void;
}

const { Option } = Select;

const AddUserModal = (props: AddUserProps) => {
  const { open, onCancel, onSuccess } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<any>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const onAdd = () => {
    setIsLoading(true);
    form
      .validateFields()
      .then((values) => {
        AddUserRequest(values)
          .then((_) => {
            setIsLoading(false);
            onSuccess();
          })
          .catch((e) => {
            setIsLoading(false);
          });
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSelectProjects = (open: any) => {
    if (open) {
      GetProjectsRequest().then(setProjects);
    }
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={420}
      title={intl.get('CREATE_USER')}
      open={open}
      onCancel={onCancel}
      onOk={onAdd}
      okText={intl.get('CREATE')}
      confirmLoading={isLoading}
    >
      <Form form={form} {...useLocaleFormLayout()}>
        <FormInputItem
          name='username'
          label={intl.get('USERNAME')}
          requiredMessage={intl.get('PLEASE_ENTER_USERNAME')}
          lengthLimit={{ min: 4, max: 16, label: intl.get('USERNAME').toLowerCase() }}
        >
          <Input placeholder={intl.get('USERNAME')} />
        </FormInputItem>
        <FormInputItem
          name='password'
          label={intl.get('PASSWORD')}
          requiredMessage={intl.get('PLEASE_ENTER_PASSWORD')}
          lengthLimit={{ min: 6, max: 16, label: intl.get('PASSWORD').toLowerCase() }}
        >
          <Input.Password placeholder={intl.get('PASSWORD')} />
        </FormInputItem>
        <Form.Item
          name='confirmPwd'
          label={
            <Typography.Text ellipsis={true} title={intl.get('CONFIRM_PASSWORD')}>
              {intl.get('CONFIRM_PASSWORD')}
            </Typography.Text>
          }
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
          <Input.Password placeholder={intl.get('CONFIRM_PASSWORD')} />
        </Form.Item>
        <Form.Item
          name={'role'}
          label={intl.get('USER_ROLE')}
          rules={[{ required: true, message: intl.get('PLEASE_SELECT_USER_ROLE') }]}
        >
          <RoleSelect placeholder={intl.get('PLEASE_SELECT_USER_ROLE')} />
        </Form.Item>
        <Form.Item
          name='phone'
          label={intl.get('CELLPHONE')}
          initialValue={''}
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: intl.get('phone.is.invalid') }]}
        >
          <Input placeholder={intl.get('CELLPHONE')} />
        </Form.Item>
        <Form.Item
          name='email'
          label={intl.get('EMAIL')}
          initialValue={''}
          rules={[{ type: 'email', message: intl.get('email.is.invalid') }]}
        >
          <Input placeholder={intl.get('EMAIL')} />
        </Form.Item>
        <Form.Item name={'projects'} label={intl.get('BIND_PROJECT')} initialValue={[]}>
          <Select
            mode='multiple'
            placeholder={intl.get('PLEASE_SELECT_PROJECT_BOUND')}
            onDropdownVisibleChange={onSelectProjects}
          >
            {projects?.map((project: any) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </ModalWrapper>
  );
};

export default AddUserModal;
