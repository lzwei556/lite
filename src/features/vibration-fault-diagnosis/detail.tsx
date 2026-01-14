import React from 'react';
import { Grid } from 'components';
import { Col, Collapse } from 'antd';
import { useGlobalStyles } from '../../styles';
import { FaultDiagnosis } from './common';
import { generateColProps } from 'utils/grid';
import { FaultDiagnosisOverview } from './overvew';
import { ComponentsHealthyList } from './list';
import { MoniotoringPointData } from './monitoring-point-data';
import { MonitoringPointRow } from 'asset-common';

export const FaultDiagnosisDetail = (
  props: FaultDiagnosis & { monitoringPoints: MonitoringPointRow[]; rotationSpeed?: number }
) => {
  const { colorBgContainerStyle } = useGlobalStyles();
  const monitoringPoints = props.monitoringPoints.filter((m) => !!m.componentId);

  return (
    <Grid >
      <Col {...generateColProps({ xxl: 12 })}>
        <Grid>
          <Col span={24}>
            <FaultDiagnosisOverview {...props} />
          </Col>
          <Col span={24}>
            <ComponentsHealthyList
              {...props}
              type='card'
              cardProps={{ styles: { body: { overflow: 'auto', maxHeight: 550 } } }}
            />
          </Col>
        </Grid>
      </Col>
      <Col {...generateColProps({ xxl: 12 })} style={{ overflowY: 'auto', maxHeight: 780 }}>
        <Collapse
          accordion={true}
          bordered={false}
          defaultActiveKey={monitoringPoints?.[0].id}
          expandIconPosition='end'
          items={monitoringPoints.map((m) => ({
            key: m.id,
            label: m.name,
            children: (
              <MoniotoringPointData monitoringPoint={m} rotationSpeed={props.rotationSpeed} />
            )
          }))}
          style={{ backgroundColor: colorBgContainerStyle.backgroundColor }}
        />
      </Col>
    </Grid>
  );
};
