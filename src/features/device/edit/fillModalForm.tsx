import React from 'react';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { NumberFormItem } from '../../../components';

export const FillModalForm = (
  props: Omit<ModalFormProps, 'onSuccess'> & {
    onSuccess: (paras: { param: number }) => void;
  }
) => {
  const { onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.get('device.command.fill'),
        okText: Translation.get('common.ok'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            onSuccess(values);
          });
        }
      }}
    >
      <Form form={form} layout='vertical'>
        <NumberFormItem
          name='param'
          label={'device.command.fill.count'}
          rules={[{ required: true }, { type: 'number', min: 1, max: 20 }]}
        />
      </Form>
    </ModalWrapper>
  );
};
