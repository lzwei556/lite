import { Card, Grid, SaveIconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { ColProps, Form } from 'antd';
import {
  DiagnosisFormItems,
  FormItemsBasic,
  ParentSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsSettings } from './form-items-settings';
import { useType } from './use-basic-form-items';
import { AssetModel, AssetRow } from 'asset-common';
import { generateColProps } from 'utils/grid';
import { PrimaryAsset } from 'domain/asset';

export type UpdateFormProps = {
  loading: boolean;
  editingAsset: AssetRow;
  handleSubmit: (values: AssetModel) => void;
  formItemColProps?: ColProps;
};

export const UpdateFormCard = ({
  loading,
  editingAsset,
  handleSubmit,
  formItemColProps = generateColProps({})
}: UpdateFormProps) => {
  const [form] = Form.useForm<AssetModel>();
  const { selectedType: type, ...typeRest } = useType(editingAsset.type);
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
          ...editingAsset,
          diagnosis_is_enabled: editingAsset.diagnosisIsEnabled,
          diagnosis_period: editingAsset.diagnosisPeriod,
          parent_id: editingAsset.parentId,
          type
        }}
      >
        <Grid>
          <FormItemsBasic
            {...{
              formItemColProps,
              parentSelectFormItem: <ParentSelectFormItem {...{ formItemColProps, type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...typeRest} />,
              diagnosisFormItems: type &&
                PrimaryAsset.Category.getTypes(['vibration']).includes(type) && (
                  <DiagnosisFormItems asset={editingAsset} formItemColProps={formItemColProps} />
                )
            }}
          />
        </Grid>
        {type && <FormItemsSettings {...{ type, formItemColProps }} />}
      </Form>
    </Card>
  );
};
