import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { Grid } from 'components';
import {
  AssetSelectFormItem,
  ComponentSelectFormItem,
  FormItemsBasic,
  SensorSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsAttributes } from './form-items-attributes';
import { useType } from './use-basic-form-items';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';

export type CreateFormProps = {
  loading: boolean;
  handleSubmit: (values: TMonitoringPoint.PostDTO[]) => void;
};

export const CreateFormModal = ({
  assetId,
  onSuccess,
  point,
  loading,
  handleSubmit,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> &
  CreateFormProps & {
    assetId: number;
    onSuccess: (values: TMonitoringPoint.PostDTO) => void;
    point?: TMonitoringPoint.PostDTO;
  }) => {
  const [form] = Form.useForm();
  const { selectedType: type, ...typeRest } = useType(point?.type);

  return (
    <ModalWrapper
      {...{
        ...rest,
        afterClose: () => {
          rest?.afterClose?.();
          form.resetFields();
        },
        onOk: () => form.validateFields().then((values) => handleSubmit([values])),
        okButtonProps: { loading },
        title: intl.get('CREATE_SOMETHING', { something: intl.get('monitoring.points') })
      }}
    >
      <Form form={form} layout='vertical' initialValues={point ? point : { asset_id: assetId }}>
        <Grid>
          <FormItemsBasic
            {...{
              assetSelectFormItem: <AssetSelectFormItem {...{ assetId, type }} />,
              sensorSelectFormItem: <SensorSelectFormItem {...{ type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest, disabled: false }} />,
              componentSelectFormItem: type &&
                OMonitoringPoint.Type.Category.getTypes(['vibration']).includes(type) &&
                type !== OMonitoringPoint.Type.OilFiller && <ComponentSelectFormItem type={type} />
            }}
          />
          {type && <FormItemsAttributes {...{ type }} />}
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
