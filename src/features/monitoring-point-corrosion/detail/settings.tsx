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
import { generateColProps } from '../../../utils/grid';
import { handleSubmit, parseAttrs } from '../common';
import { BasisFormItems } from '../basisFormItems';
import { Others } from '../others';

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
          <Form
            form={form}
            layout='vertical'
            initialValues={{ ...Point.convert(point, parseAttrs) }}
          >
            <BasisFormItems
              monitoringPoint={point}
              formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
            />
            <Card size='small' title={intl.get('monitoring.point.attr')} type='inner'>
              <Grid>
                <Others
                  monitoringPoint={point}
                  formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
                />
              </Grid>
            </Card>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <AlarmRuleSetting {...point} key={point.id} />
      </Col>
    </Grid>
  );
};
