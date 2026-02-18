import { Form } from 'antd';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { useType } from './use-basic-form-items';
import { ModalWrapper } from 'components/modalWrapper';
import intl from 'react-intl-universal';
import { Grid } from 'components';
import {
  AssetSelectFormItem,
  ComponentSelectFormItem,
  FormItemsBasic,
  SensorSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsAttributes } from './form-items-attributes';
import { UpdateFormProps } from './update-form';
import { MonitoringPointType } from 'common';

export const UpdateFormModal = ({
  onSuccess,
  monitoringPoint,
  loading,
  handleSubmit,
  ...rest
}: ModalFormProps & UpdateFormProps) => {
  const [form] = Form.useForm();
  const { selectedType: type, ...typeRest } = useType(monitoringPoint.type);

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
        title: intl.get('EDIT_SOMETHING', { something: intl.get('monitoring.points') })
      }}
    >
      <Form form={form} layout='vertical' initialValues={monitoringPoint}>
        <Grid>
          <FormItemsBasic
            {...{
              assetSelectFormItem: <AssetSelectFormItem {...{ type }} />,
              sensorSelectFormItem: <SensorSelectFormItem {...{ type }} />,
              typeSelectFormItem: <TypeSelectFormItem {...{ ...typeRest }} />,
              componentSelectFormItem: type &&
                MonitoringPointType.Categories.getKeys(['vibration']).includes(type) &&
                type !== MonitoringPointType.Value.OilFiller && (
                  <ComponentSelectFormItem type={type} />
                )
            }}
          />
          {type && <FormItemsAttributes {...{ type }} />}
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
