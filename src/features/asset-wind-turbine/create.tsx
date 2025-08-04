import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
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
        title: intl.get('CREATE_SOMETHING', { something: intl.get(label) }),
        okText: intl.get('CREATE'),
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
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Form>
    </ModalWrapper>
  );
};
