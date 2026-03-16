import { Form, ModalProps } from 'antd';
import { FC } from 'react';
import { ModalWrapper } from '../../../../components/modalWrapper';
import { TextFormItem } from '../../../../components';

export interface RoleModalProps extends ModalProps {
  form: any;
}

const RoleModal: FC<RoleModalProps> = (props) => {
  const { form } = props;

  return (
    <ModalWrapper {...props}>
      <Form form={form} layout='vertical'>
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 20 }]}
        />
        <TextFormItem
          label='common.description'
          name='description'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
      </Form>
    </ModalWrapper>
  );
};

export default RoleModal;
