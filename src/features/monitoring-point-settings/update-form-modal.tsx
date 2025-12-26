import { Form } from 'antd';
import { MonitoringPointPostDTO } from 'common/monitoring-point';
import React from 'react';
import { ModalFormProps } from 'types/common';
import { useType } from './use-basic-form-items';
import { ModalWrapper } from 'components/modalWrapper';
import intl from 'react-intl-universal';
import { Grid } from 'components';
import {
  AssetSelectFormItem,
  FormItemsBasic,
  SensorSelectFormItem,
  TypeSelectFormItem
} from './form-items-basic';
import { FormItemsAttributes } from './form-items-attributes';

export const UpdateFormModal = ({
  onSuccess,
  point,
  ...rest
}: ModalFormProps & {
  point: MonitoringPointPostDTO;
}) => {
  const [form] = Form.useForm();
  const { selectedType: type, ...typeRest } = useType(point.type);

  return (
    <ModalWrapper
      {...{
        ...rest,
        afterClose: () => form.resetFields(),
        onOk: () => form.validateFields().then(onSuccess),
        title: intl.get('EDIT_SOMETHING', { something: intl.get('monitoring.points') })
      }}
    >
      <Form form={form} layout='vertical' initialValues={point}>
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
    </ModalWrapper>
  );
};
