import { Form } from 'antd';
import { ModalWrapper } from 'components/modalWrapper';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { MonitoringPointPostDTO } from 'common/monitoring-point';
import { Grid } from 'components';
import {
  AssetSelectFormItem,
  FormItemsBasic,
  SensorSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsAttributes } from './form-items-attributes';
import { useType } from './use-basic-form-items';
import { Translation } from 'locales/utils';

export const CreateFormModal = ({
  assetId,
  onSuccess,
  point,
  ...rest
}: Omit<ModalFormProps, 'onSuccess'> & {
  assetId: number;
  onSuccess: (values: MonitoringPointPostDTO) => void;
  point?: MonitoringPointPostDTO;
}) => {
  const [form] = Form.useForm();
  const { selectedType: type, ...typeRest } = useType(point?.type);

  return (
    <ModalWrapper
      {...{
        ...rest,
        afterClose: () => form.resetFields(),
        onOk: () => form.validateFields().then(onSuccess),
        title: Translation.createSth('monitoring.points')
      }}
    >
      <Form form={form} layout='vertical' initialValues={point ? point : { asset_id: assetId }}>
        <Grid>
          <FormItemsBasic
            {...{
              assetSelectFormItem: <AssetSelectFormItem {...{ assetId, type }} />,
              sensorSelectFormItem: <SensorSelectFormItem {...{ type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest, disabled: false }} />
            }}
          />
          {type && <FormItemsAttributes {...{ type }} />}
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
