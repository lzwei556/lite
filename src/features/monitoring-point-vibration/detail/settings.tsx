import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../utils/grid';
import {
  AlarmRuleSetting,
  AssetRow,
  MonitoringPoint,
  MonitoringPointRow,
  Point,
  useContext
} from '../../../asset-common';
import { Card, Grid, SaveIconButton } from '../../../components';
import { BasisFormItems } from '../basisFormItems';
import { Others } from '../others';
import { handleSubmit } from '../common';
import { MonitoringPointType } from 'common';
import { ProcessList } from 'features/process';
import { ProcessTypeKey } from 'process-type';
import { foreachTree } from 'utils/tree';

export const Settings = (props: { monitoringPoint: MonitoringPointRow; onSuccess: () => void }) => {
  const { monitoringPoint, onSuccess } = props;
  const [form] = Form.useForm<MonitoringPoint & { device_id: number }>();
  const monitoringPoints = useMonitoringPoints(monitoringPoint.assetId);

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
            {monitoringPoint.type !== MonitoringPointType.Value.OilFiller && (
              <Card size='small' title={intl.get('monitoring.point.attr')} type='inner'>
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
                type: ProcessTypeKey.AutoFill,
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

const useMonitoringPoints = (assetId: number) => {
  const { assets } = useContext();
  let asset: AssetRow | undefined;
  foreachTree(assets, (node) => {
    if (node.id === assetId) {
      asset = node;
    }
  });
  return asset
    ? (asset.monitoringPoints ?? []).filter(
        (m) => m.type === MonitoringPointType.Value.VibrationAudio
      )
    : [];
};
