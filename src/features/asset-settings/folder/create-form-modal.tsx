import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { Grid } from 'components';
import { FormItemsBasic } from './form-items-basic';
import { AssetModel, AssetRow } from 'asset-common';
import { App, useAppType } from 'config/context';
import { AssetCategory } from 'common/asset-category';

export type CreateFormProps = {
  parent?: AssetRow;
  loading: boolean;
  handleSubmit: (values: AssetModel) => void;
};

export const CreateFolderAssetFormModal = ({
  parent,
  onSuccess,
  loading,
  handleSubmit,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  CreateFormProps & {
    onSuccess: (values: AssetModel) => void;
  }) => {
  const [form] = Form.useForm();
  const appType = useAppType();
  // const;

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
          something: intl.get(
            App.isWindLike(appType)
              ? AssetCategory.Key.getLabel(AssetCategory.Value.WindTurbine)
              : 'ASSET'
          )
        })
      }}
    >
      <Form form={form} layout='vertical'>
        <Grid>
          <FormItemsBasic />
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
