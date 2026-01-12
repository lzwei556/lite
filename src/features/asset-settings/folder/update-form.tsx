import { Card, Grid, SaveIconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { ColProps, Form } from 'antd';
import { AssetModel, AssetRow } from 'asset-common';
import { generateColProps } from 'utils/grid';
import { FormItemsBasic } from './form-items-basic';

type UpdateFormProps = {
  loading: boolean;
  asset: AssetRow;
  handleSubmit: (values: AssetModel) => void;
};

export const FolderAssetUpdateFormCard = ({
  loading,
  asset,
  handleSubmit,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: UpdateFormProps & {
  formItemColProps?: ColProps;
}) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <SaveIconButton
          loading={loading}
          onClick={() => form.validateFields().then(handleSubmit)}
          size='small'
        />
      }
      styles={{ body: { overflowY: 'auto', maxHeight: 725 } }}
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...asset,
          parent_id: asset.parentId
        }}
      >
        <Grid>
          <FormItemsBasic parentId={asset.parentId} formItemColProps={formItemColProps} />
        </Grid>
      </Form>
    </Card>
  );
};
