import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { generateColProps } from '../../../utils/grid';
import { Card, Grid } from '../../../components';
import { ModalFormProps } from '../../../types/common';
import { MONITORING_POINT, MonitoringPoint, MonitoringPointRow, Point } from '../../asset-common';
import { handleSubmit } from './common';
import { Others } from './others';
import { BasisFormItems } from './basisFormItems';

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
      <Form form={form} layout='vertical' initialValues={{ ...Point.convert(monitoringPoint) }}>
        <Card size='small' style={{ marginBlock: 16 }} title={intl.get('BASIC_INFORMATION')}>
          <BasisFormItems
            monitoringPoint={monitoringPoint}
            formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
          />
        </Card>
        <Card size='small' style={{ marginBlock: 16 }} title={intl.get('monitoring.point.attr')}>
          <Grid>
            <Others formItemColProps={generateColProps({ xl: 12, xxl: 12 })} />
          </Grid>
        </Card>
      </Form>
    </ModalWrapper>
  );
};
