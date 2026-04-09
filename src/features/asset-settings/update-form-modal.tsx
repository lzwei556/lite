import { Form } from 'antd';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { useType } from './use-basic-form-items';
import { ModalWrapper } from 'components/modalWrapper';
import intl from 'react-intl-universal';
import {
  DiagnosisFormItems,
  FormItemsBasic,
  ParentSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { UpdateFormProps } from './update-form';
import { FormItemsSettings } from './form-items-settings';
import { generateColProps } from 'utils/grid';
import { Grid } from 'components';
import { PrimaryAsset } from 'domain/asset';

export const UpdateFormModal = ({
  onSuccess,
  editingAsset,
  loading,
  handleSubmit,
  formItemColProps = generateColProps({ xxl: 12 }),
  ...rest
}: ModalFormProps & UpdateFormProps) => {
  const [form] = Form.useForm();
  const { selectedType: type, ...typeRest } = useType(editingAsset.type);

  return (
    <ModalWrapper
      {...{
        ...rest,
        afterClose: () => {
          rest?.afterClose?.();
          form.resetFields();
        },
        onOk: () => form.validateFields().then(handleSubmit),
        okButtonProps: { loading },
        title: intl.get('EDIT_SOMETHING', { something: intl.get('ASSET') }),
        width: 600
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...editingAsset,
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
        {type && (
          <FormItemsSettings
            {...{ type, formItemColProps }}
            specialFormItemColProps={{ 'vel_base.vel_base_1_10X': generateColProps({}) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
