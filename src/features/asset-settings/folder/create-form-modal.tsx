import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { Grid } from 'components';
import { FormItemsBasic } from './form-items-basic';
import { AssetModel, AssetRow } from 'asset-common';

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
  title,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  CreateFormProps & {
    title: string;
    onSuccess: (values: AssetModel) => void;
  }) => {
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
        title
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
