import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { Card, Grid } from '../../components';
import { generateColProps } from '../../utils/grid';
import { MONITORING_POINT, MonitoringPoint, MonitoringPointRow, Point } from '../../asset-common';
import { BasisFormItems } from './basisFormItems';
import { handleSubmit, parseAttrs } from './common';
import { Others } from './others';

export const UpdateModal = (props: ModalFormProps & { monitoringPoint: MonitoringPointRow }) => {
  const { monitoringPoint, onSuccess, ...rest } = props;
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: intl.get('EDIT_SOMETHING', { something: intl.get(MONITORING_POINT) }),
        okText: intl.get('SAVE'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            handleSubmit(monitoringPoint, values, onSuccess);
          });
        }
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{ ...Point.convert(monitoringPoint, parseAttrs) }}
      >
        <Card size='small' style={{ marginBlock: 16 }} title={intl.get('BASIC_INFORMATION')}>
          <BasisFormItems monitoringPoint={monitoringPoint} />
        </Card>
        <Card size='small' style={{ marginBlock: 16 }} title={intl.get('monitoring.point.attr')}>
          <Grid>
            <Others
              monitoringPoint={monitoringPoint}
              formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
            />
          </Grid>
        </Card>
      </Form>
    </ModalWrapper>
  );
};
