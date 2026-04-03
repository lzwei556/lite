import { Card, Grid, SaveIconButton } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { Form } from 'antd';
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

export type UpdateFormProps = {
  loading: boolean;
  monitoringPoint: TMonitoringPoint.Base;
  handleSubmit: (values: TMonitoringPoint.PostDTO) => void;
};

export const UpdateFormCard = ({ loading, monitoringPoint, handleSubmit }: UpdateFormProps) => {
  const [form] = Form.useForm<TMonitoringPoint.PostDTO>();
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
      <Form
        form={form}
        layout='vertical'
        initialValues={OMonitoringPoint.transform2PostDTO(monitoringPoint)}
      >
        <Grid>
          <FormItemsBasic
            {...{
              assetSelectFormItem: <AssetSelectFormItem {...{ type }} />,
              sensorSelectFormItem: <SensorSelectFormItem {...{ type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest }} />,
              componentSelectFormItem: type &&
                OMonitoringPoint.Type.Category.getTypes(['vibration']).includes(type) &&
                type !== OMonitoringPoint.Type.OilFiller && <ComponentSelectFormItem type={type} />
            }}
          />
          {type && <FormItemsAttributes {...{ type }} />}
        </Grid>
      </Form>
    </Card>
  );
};
