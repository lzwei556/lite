import React from 'react';
import { Col, Form } from 'antd';
import { Translation } from 'locales/utils';
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
import { MonitoringPointType } from 'common';
import { ProcessList } from 'features/process';
import { ProcessType, ProcessTypeKey } from 'process-type';

export const Settings = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();
  const monitoringPoints = ProcessType.useDataSources(
    monitoringPoint.assetId,
    ProcessTypeKey['Auto-Fill']
  );

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
          title={Translation.get('common.basic')}
        >
          <Form form={form} layout='vertical' initialValues={{ ...Point.convert(monitoringPoint) }}>
            <BasisFormItems
              monitoringPoint={monitoringPoint}
              formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
            />
            {monitoringPoint.type !== MonitoringPointType.Value.OilFiller && (
              <Card size='small' title={Translation.get('monitoring.point.attr')} type='inner'>
                <Grid>
                  <Others formItemColProps={generateColProps({ xl: 12, xxl: 8 })} />
                </Grid>
              </Card>
            )}
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <AlarmRuleSetting point={monitoringPoint} />
      </Col>
      {monitoringPoint.type === MonitoringPointType.Value.OilFiller && (
        <Col span={24}>
          <ProcessList
            {...{
              monitoringPoint,
              processList: monitoringPoint.actions ?? [],
              monitoringPoints,
              initialProcess: {
                type: ProcessTypeKey['Auto-Fill'],
                oilFillerId: monitoringPoint.bindingDevices?.[0]?.id
              },
              onSuccess
            }}
          />
        </Col>
      )}
    </Grid>
  );
};
