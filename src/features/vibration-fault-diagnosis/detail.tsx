import React from 'react';
import { Grid, MutedCard } from 'components';
import { Col, Collapse } from 'antd';
import { useGlobalStyles } from '../../styles';
import { FaultDiagnosis } from './common';
import { generateColProps } from 'utils/grid';
import { FaultDiagnosisOverview } from './overvew';
import { ComponentsHealthyList } from './list';
import { MoniotoringPointData } from './monitoring-point-data';
import { ZoneScoreTable } from './iso-zone-table';
import intl from 'react-intl-universal';
import { getDisplayName, roundValue } from 'utils';
import { useLocaleContext } from 'localeProvider';
import { Component } from 'domains/asset';
import * as MonitoringPoint from 'domains/monitoring-point';

export const FaultDiagnosisDetail = (
  props: FaultDiagnosis & {
    monitoringPoints: MonitoringPoint.Types.Entity[];
    rotationSpeed?: number;
  }
) => {
  const { colorBgContainerStyle } = useGlobalStyles();
  const monitoringPoints = props.monitoringPoints.filter((m) => !!m.componentId);
  const { language } = useLocaleContext();

  return (
    <Grid>
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
          {props.components.length > 0 && (
            <Col span={24}>
              <MutedCard
                extra={getDisplayName({
                  name: intl.get('common.unit'),
                  lang: language,
                  suffix: 'mm/s'
                })}
                title={intl.get('iso.standard.zone')}
              >
                <ZoneScoreTable
                  zones={['A', 'B', 'C', 'D']}
                  boundaries={props.components[0].iso?.zoneBoundaries ?? []}
                  rows={props.components.map((c) => ({
                    title: intl.get(Component.get(c.componentId).label),
                    score: roundValue(Math.max(...(c.iso?.data ?? [0])))
                  }))}
                  max={15}
                />
              </MutedCard>
            </Col>
          )}
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
