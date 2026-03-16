import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Asset, AssetModel, AssetRow, updateAsset } from '../../../asset-common';
import { UpdateFormItems } from './_updateFormItems';

export const UpdateModal = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={Translation.get('common.action.save')}
      onOk={() => {
        form.validateFields().then((values) => {
          try {
            updateAsset(asset.id, values).then(onSuccess);
          } catch (error) {
            console.log(error);
          }
        });
      }}
      title={Translation.editSth('asset.tower')}
    >
      <Form form={form} layout='vertical' initialValues={{ ...Asset.convert(asset) }}>
        <UpdateFormItems />
      </Form>
    </ModalWrapper>
  );
};
