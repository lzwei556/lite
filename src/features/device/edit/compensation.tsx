import React from 'react';
import { Button, Form } from 'antd';
import { Translation } from 'locales/utils';
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
      title={Translation.get('device.command.compensation')}
      footer={[
        <Button key='cancel' onClick={rest.onCancel}>
          {Translation.get('common.action.cancel')}
        </Button>,
        <Button key='start' onClick={() => handleSubmit(0)} color='primary' variant='solid'>
          {Translation.get('device.command.compensation.start')}
        </Button>,
        <Button key='stop' onClick={() => handleSubmit(1)}>
          {Translation.get('device.command.compensation.stop')}
        </Button>
      ]}
    >
      <Form form={form} layout='vertical'>
        <NumberFormItem
          label={'device.command.compensation.duration'}
          name='param'
          rules={[{ required: true }]}
          inputNumberProps={{ addonAfter: Translation.get('label.unit.hour'), max: 24 }}
        />
      </Form>
    </ModalWrapper>
  );
};
