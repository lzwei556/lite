import { Form, Input } from 'antd';
import { FC, useState } from 'react';
import { UpdateMyPass } from '../../../apis/profile';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../../components/modalWrapper';
import { TextFormItem } from '../../../components';

export interface EditPassProps {
  open: boolean;
  onCancel?: () => void;
  onSuccess: () => void;
}

const EditPassModal: FC<EditPassProps> = ({ open, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSave = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      UpdateMyPass({ old: values.pwd, new: values.confirmPwd })
        .then((_) => {
          setIsLoading(false);
          onSuccess();
        })
        .finally(() => setIsLoading(false));
    });
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      open={open}
      title={Translation.get('auth.password.modify')}
      onOk={onSave}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form form={form} layout='vertical'>
        <TextFormItem label='auth.password.old' name='pwd' rules={[{ required: true }]}>
          <Input.Password />
        </TextFormItem>
        <TextFormItem
          label='auth.password.new'
          name='newPwd'
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
                if (!value || getFieldValue('newPwd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(Translation.get('auth.password.inconsistent')));
              }
            })
          ]}
        >
          <Input.Password />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};

export default EditPassModal;
