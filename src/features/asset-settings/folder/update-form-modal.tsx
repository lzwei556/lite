import { ColProps, Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { FormItemsBasic } from './form-items-basic';
import { generateColProps } from 'utils/grid';
import { AssetModel } from 'asset-common';
import { Grid } from 'components';
import { UpdateFormProps } from '../update-form';

export const UpdateFolderAssetFormModal = ({
  editingAsset,
  onSuccess,
  loading,
  handleSubmit,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 }),
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  UpdateFormProps & {
    onSuccess: (values: AssetModel) => void;
    formItemColProps?: ColProps;
  }) => {
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
        title: intl.get('EDIT_SOMETHING', { something: intl.get('ASSET') }),
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
          <FormItemsBasic parentId={editingAsset.parentId} formItemColProps={formItemColProps} />
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
