import React from 'react';
import { ColProps, Form } from 'antd';
import { useFormBindingsProps, useFormItemBindingsProps } from '../hooks';
import { FormItems } from './formItems';
import { SingleStageCentrifugalPumpObj } from './common';
import { TextFormItem } from '../components';
import { ModalWrapper } from '../components/modalWrapper';
import { ModalFormProps } from '../types/common';
import { Translation } from 'locales/utils';

export const AddForm = ({
  formItemColProps,
  ...rest
}: ModalFormProps & { formItemColProps: ColProps }) => {
  const formProps = useFormProps();
  const { form } = formProps;
  const title = Translation.createSth('single.stage.centrifugal.pump');
  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title,
        okText: Translation.get('common.action.create'),
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
            label: 'common.name',
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
