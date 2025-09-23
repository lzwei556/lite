import React from 'react';
import { ColProps, Form } from 'antd';
import { useFormBindingsProps, useFormItemBindingsProps } from '../hooks';
import { FormItems } from './formItems';
import { SingleStageCentrifugalPumpObj } from './common';
import { TextFormItem } from '../components';
import { ModalWrapper } from '../components/modalWrapper';
import { ModalFormProps } from '../types/common';
import intl from 'react-intl-universal';

export const AddForm = ({
  formItemColProps,
  ...rest
}: ModalFormProps & { formItemColProps: ColProps }) => {
  const formProps = useFormProps();
  const { form } = formProps;
  const title = intl.get('CREATE_SOMETHING', {
    something: intl.get('single.stage.centrifugal.pump')
  });
  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title,
        okText: intl.get('CREATE'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              // addAsset(values).then(() => {
              //   onSuccess();
              // });
              console.log('valesss', values);
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form {...formProps}>
        <TextFormItem
          {...useFormItemBindingsProps({
            label: 'NAME',
            name: 'name',
            rules: [{ required: true }]
          })}
        />
        <FormItems model={SingleStageCentrifugalPumpObj} formItemColProps={formItemColProps} />
      </Form>
    </ModalWrapper>
  );
};

const useFormProps = () => {
  const [form] = Form.useForm();
  return useFormBindingsProps({ form, layout: 'vertical', initialValues: {} });
};
