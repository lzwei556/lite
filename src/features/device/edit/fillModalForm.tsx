import React from 'react';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { Form } from 'antd';
import intl from 'react-intl-universal';
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
        title: intl.get('oil.filler.fill'),
        okText: intl.get('OK'),
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
          label={'oil.filler.fill.count'}
          rules={[{ required: true }, { type: 'number', min: 1, max: 20 }]}
        />
      </Form>
    </ModalWrapper>
  );
};
