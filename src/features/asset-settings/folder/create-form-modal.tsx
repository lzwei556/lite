import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { Grid } from 'components';
import { FormItemsBasic } from './form-items-basic';
import { AssetModel, AssetRow } from 'asset-common';
import { FolderAsset } from 'domains/asset';
import intl from 'react-intl-universal';

type CreateFormProps = {
  parent?: AssetRow;
  folderAssetTypes: FolderAsset.Enum[];
  loading: boolean;
  handleSubmit: (values: AssetModel) => void;
};

export const CreateFolderAssetFormModal = ({
  parent,
  folderAssetTypes,
  loading,
  handleSubmit,
  ...rest
}: ModalFormProps & CreateFormProps) => {
  const [form] = Form.useForm();

  return (
    <ModalWrapper
      {...{
        ...rest,
        afterClose: () => {
          rest?.afterClose?.();
          form.resetFields();
        },
        onOk: () => form.validateFields().then((values) => handleSubmit(values)),
        okButtonProps: { loading },
        title: intl.get('CREATE_SOMETHING', {
          something: intl.get(FolderAsset.getTitle(folderAssetTypes))
        })
      }}
    >
      <Form form={form} layout='vertical'>
        <Grid>
          <FormItemsBasic folderAssetTypes={folderAssetTypes} />
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
