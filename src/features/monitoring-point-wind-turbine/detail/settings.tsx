import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import {
  AlarmRuleSetting,
  MonitoringPoint,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { Card, Grid, SaveIconButton } from '../../../components';
import { handleSubmit } from '../common';
import { UpdateFormItems } from '../_updateFormItems';

export const Settings = ({
  point,
  onSuccess
}: {
  point: MonitoringPointRow;
  onSuccess: () => void;
}) => {
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();
  return (
    <Grid>
      <Col span={24}>
        <Card
          extra={
            <SaveIconButton
              onClick={() => {
                form.validateFields().then((values) => {
                  handleSubmit(point, values, onSuccess);
                });
              }}
            />
          }
          title={intl.get('BASIC_INFORMATION')}
        >
          <Form form={form} layout='vertical' initialValues={{ ...Point.convert(point) }}>
            <UpdateFormItems monitoringPoint={point} />
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <AlarmRuleSetting {...point} key={point.id} />
      </Col>
    </Grid>
  );
};
