import { ColProps, Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { FormItemsBasic } from './form-items-basic';
import { generateColProps } from 'utils/grid';
import { AssetModel } from 'asset-common';
import { Grid, TextFormItem } from 'components';
import { UpdateFormProps } from '../update-form';
import { FolderAsset } from 'domains/asset';

export const UpdateFolderAssetFormModal = ({
  editingAsset,
  loading,
  handleSubmit,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 }),
  ...rest
}: ModalFormProps & UpdateFormProps & { formItemColProps?: ColProps }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <ModalWrapper
      {...{
        afterClose: () => {
          rest?.afterClose?.();
          form.resetFields();
        },
        onOk: () => form.validateFields().then(handleSubmit),
        okButtonProps: { loading },
        title: intl.get('EDIT_SOMETHING', {
          something: intl.get(FolderAsset.getLabel(editingAsset.type))
        }),
        width: 600,
        ...rest
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...editingAsset,
          parent_id: editingAsset.parentId
        }}
      >
        <Grid>
          <TextFormItem hidden={true} name='type' />
          <FormItemsBasic
            parentId={editingAsset.parentId}
            folderAssetTypes={[editingAsset.type]}
            formItemColProps={formItemColProps}
          />
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
