import React from 'react';
import { Button, Col, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import {
  AlarmRuleSetting,
  MonitoringPoint,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { Card, Grid } from '../../../components';
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
            <Button
              color='primary'
              onClick={() => {
                form.validateFields().then((values) => {
                  handleSubmit(monitoringPoint, values, onSuccess);
                });
              }}
              icon={<SaveOutlined />}
              size='small'
              variant='outlined'
            />
          }
          size='small'
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
        <AlarmRuleSetting {...monitoringPoint} />
      </Col>
    </Grid>
  );
};
