import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { UpdateFormItems } from './updateFormItems';

export const UpdateModal = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();
  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.editSth('asset'),
        okText: Translation.get('common.action.save'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              updateAsset(asset.id, { ...values, type: asset.type }).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          name: asset.name,
          parent_id: asset.parentId > 0 ? asset.parentId : undefined
        }}
      >
        <UpdateFormItems asset={asset} />
      </Form>
    </ModalWrapper>
  );
};
