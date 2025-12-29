import { Card, Grid, SaveIconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { Form } from 'antd';
import {
  AssetSelectFormItem,
  FormItemsBasic,
  SensorSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsAttributes } from './form-items-attributes';
import { useType } from './use-basic-form-items';
import { MonitoringPoint, MonitoringPointPostDTO, transform2PostDTO } from 'common';

export const UpdateFormCard = ({
  loading,
  monitoringPoint,
  handleSubmit
}: {
  loading: boolean;
  monitoringPoint: MonitoringPoint;
  handleSubmit: (values: MonitoringPointPostDTO) => void;
}) => {
  const [form] = Form.useForm<MonitoringPointPostDTO>();
  const { selectedType: type, ...typeRest } = useType(monitoringPoint.type);
  return (
    <Card
      extra={
        <SaveIconButton
          loading={loading}
          onClick={() => form.validateFields().then(handleSubmit)}
        />
      }
      styles={{ body: { overflowY: 'auto', maxHeight: 725 } }}
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form form={form} layout='vertical' initialValues={transform2PostDTO(monitoringPoint)}>
        <Grid>
          <FormItemsBasic
            {...{
              assetSelectFormItem: <AssetSelectFormItem {...{ type }} />,
              sensorSelectFormItem: <SensorSelectFormItem {...{ type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest }} />
            }}
          />
          {type && <FormItemsAttributes {...{ type }} />}
        </Grid>
      </Form>
    </Card>
  );
};
