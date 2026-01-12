import { Card, Grid, SaveIconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { ColProps, Form } from 'antd';
import { FormItemsBasic, ParentSelectFormItem, TypeSelectFormItem } from './form-items-basic';
import { FormItemsSettings } from './form-items-settings';
import { useType } from './use-basic-form-items';
import { AssetModel, AssetRow } from 'asset-common';
import { generateColProps } from 'utils/grid';

export type UpdateFormProps = {
  loading: boolean;
  asset: AssetRow;
  handleSubmit: (values: AssetModel) => void;
};

export const UpdateFormCard = ({
  loading,
  asset,
  handleSubmit,
  formItemColProps = generateColProps({})
}: UpdateFormProps & {
  formItemColProps?: ColProps;
}) => {
  const [form] = Form.useForm<AssetModel>();
  const { selectedType: type, ...typeRest } = useType(asset.type);
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
          parent_id: asset.parentId,
          type
        }}
      >
        <Grid>
          <FormItemsBasic
            {...{
              formItemColProps,
              parentSelectFormItem: <ParentSelectFormItem />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest }} />
            }}
          />
          {type && <FormItemsSettings {...{ type, formItemColProps }} />}
        </Grid>
      </Form>
    </Card>
  );
};
