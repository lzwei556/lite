import { ColProps, Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { FormItemsBasic, ParentSelectFormItem, TypeSelectFormItem } from './form-items-basic';
import { useType } from './use-basic-form-items';
import { FormItemsSettings } from './form-items-settings';
import { generateColProps } from 'utils/grid';
import { AssetModel } from 'asset-common';
import { CreateFormProps } from './folder/create-form-modal';
import { Grid } from 'components';

export const CreateFormModal = ({
  parent,
  onSuccess,
  loading,
  handleSubmit,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 }),
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  CreateFormProps & {
    onSuccess: (values: AssetModel) => void;
    formItemColProps?: ColProps;
  }) => {
  const [form] = Form.useForm<AssetModel>();
  const { selectedType: type, ...typeRest } = useType();

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
        title: intl.get('CREATE_SOMETHING', { something: intl.get('ASSET') }),
        width: 600
      }}
    >
      <Form form={form} layout='vertical'>
        <Grid>
          <FormItemsBasic
            {...{
              formItemColProps,
              parentSelectFormItem: (
                <ParentSelectFormItem {...{ formItemColProps, assetId: parent?.id }} />
              ),
              typeSelectFormItem: (
                <TypeSelectFormItem {...{ parentType: parent?.type, ...typeRest }} />
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
