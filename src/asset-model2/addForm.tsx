import React from 'react';
import { Form } from 'antd';
import { useFormBindingsProps } from '../hooks';
import { FormItems } from './formItems';
import { SingleStageCentrifugalPumpObj } from './common';

export const AddForm = () => {
  return (
    <Form {...useFormProps()}>
      <FormItems model={SingleStageCentrifugalPumpObj} />
    </Form>
  );
};

const useFormProps = () => {
  const [form] = Form.useForm();
  return useFormBindingsProps({ form, layout: 'vertical' });
};
