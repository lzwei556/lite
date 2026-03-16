import React from 'react';
import { Col, Form } from 'antd';
import { Translation } from 'locales/utils';
import {
  AlarmRuleSetting,
  MonitoringPoint,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { Card, Grid, SaveIconButton } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { handleSubmit } from '../common';
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
          title={Translation.get('common.basic')}
        >
          <Form form={form} layout='vertical' initialValues={{ ...Point.convert(point) }}>
            <BasisFormItems
              monitoringPoint={point}
              formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
            />
            <Card size='small' title={Translation.get('monitoring.point.attr')} type='inner'>
              <Grid>
                <Others formItemColProps={generateColProps({ xl: 12, xxl: 8 })} />
              </Grid>
            </Card>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <AlarmRuleSetting point={point} key={point.id} />
      </Col>
    </Grid>
  );
};
