import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { TextFormItem } from '../../components';
import { ModalWrapper } from '../../components/modalWrapper';
import { ModalFormProps } from '../../types/common';
import { addAsset, AssetModel } from '../../asset-common';
import { wind } from './constants';

export const Create = (props: ModalFormProps) => {
  const { onSuccess, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();
  const { label, type } = wind;

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.createSth(label),
        okText: Translation.get('common.action.create'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset({ ...values, type }).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form form={form} layout='vertical'>
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
      </Form>
    </ModalWrapper>
  );
};
