import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { MONITORING_POINT, MonitoringPoint, MonitoringPointRow, Point } from '../../asset-common';
import { UpdateFormItems } from './_updateFormItems';
import { handleSubmit } from './common';

export const UpdateModal = (props: ModalFormProps & { monitoringPoint: MonitoringPointRow }) => {
  const { monitoringPoint, onSuccess, ...rest } = props;
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.editSth(MONITORING_POINT),
        okText: Translation.get('common.action.save'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            handleSubmit(monitoringPoint, values, onSuccess);
          });
        }
      }}
    >
      <Form form={form} layout='vertical' initialValues={{ ...Point.convert(monitoringPoint) }}>
        <UpdateFormItems monitoringPoint={monitoringPoint} />
      </Form>
    </ModalWrapper>
  );
};
