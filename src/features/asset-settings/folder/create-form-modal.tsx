import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { MonitoringPointPostDTO } from 'common/monitoring-point';
import { Grid } from 'components';
import { FormItemsBasic } from './form-items-basic';
import { AssetModel } from 'asset-common';


export type CreateFormProps = {
  loading: boolean;
  handleSubmit: (values: AssetModel) => void;
};

export const CreateFormModal = ({
  assetId,
  onSuccess,
  loading,
  handleSubmit,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  CreateFormProps & {
    assetId: number;
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
        title: intl.get('CREATE_SOMETHING', { something: intl.get('monitoring.points') })
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
