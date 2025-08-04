import React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { NumberFormItem } from '../../../components';

type SubCommand = 0 | 1;

export const Compensation = ({
  onSuccess,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> & {
  onSuccess: (paras: { param: number; sub_command: SubCommand }) => void;
}) => {
  const [form] = Form.useForm<{ param: number }>();

  const handleSubmit = (sub_command: SubCommand) => {
    form
      .validateFields()
      .then((values) => onSuccess({ param: values.param * 3600 * 1000, sub_command }));
  };

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={intl.get('compensation')}
      footer={[
        <Button key='cancel' onClick={rest.onCancel}>
          {intl.get('CANCEL')}
        </Button>,
        <Button key='start' onClick={() => handleSubmit(0)} color='primary' variant='solid'>
          {intl.get('compensation.start')}
        </Button>,
        <Button key='stop' onClick={() => handleSubmit(1)}>
          {intl.get('compensation.stop')}
        </Button>
      ]}
    >
      <Form form={form} layout='vertical'>
        <NumberFormItem
          label={'compensation.duration'}
          name='param'
          rules={[{ required: true }]}
          inputNumberProps={{ addonAfter: intl.get('hours'), max: 24 }}
        />
      </Form>
    </ModalWrapper>
  );
};
