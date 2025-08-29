import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import {
  AlarmRuleSetting,
  MonitoringPoint,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { Card, Grid, SaveIconButton } from '../../../components';
import { BasisFormItems } from '../basisFormItems';
import { Others } from '../others';
import { handleSubmit } from '../common';

export const Settings = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();

  return (
    <Grid>
      <Col span={24}>
        <Card
          extra={
            <SaveIconButton
              onClick={() => {
                form.validateFields().then((values) => {
                  handleSubmit(monitoringPoint, values, onSuccess);
                });
              }}
            />
          }
          title={intl.get('BASIC_INFORMATION')}
        >
          <Form form={form} layout='vertical' initialValues={{ ...Point.convert(monitoringPoint) }}>
            <BasisFormItems
              monitoringPoint={monitoringPoint}
              formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
            />
            <Card size='small' title={intl.get('monitoring.point.attr')} type='inner'>
              <Grid>
                <Others formItemColProps={generateColProps({ xl: 12, xxl: 8 })} />
              </Grid>
            </Card>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <AlarmRuleSetting point={monitoringPoint} />
      </Col>
    </Grid>
  );
};
