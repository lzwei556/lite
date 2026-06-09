import intl from 'react-intl-universal';
import { CardProps, Descriptions, Flex, Grid, MutedCard } from 'components';
import { FaultDiagnosis, useHealthStatus } from './common';
import { Col, Progress, Space } from 'antd';
import { generateColProps } from 'utils/grid';
import BoxSvg from './box.svg';
import React from 'react';
import { Component } from 'domains/asset';

export const ComponentsHealthyList = ({
  cardProps,
  components,
  type = 'bar'
}: FaultDiagnosis & {
  cardProps?: CardProps;
  type?: 'bar' | 'card';
}) => {
  if (type === 'bar') {
    return components.length === 0 ? null : (
      <Grid style={{ maxHeight: 165, overflowY: 'auto' }}>
        {components.map((component) => (
          <Col key={component.componentId} {...generateColProps({})}>
            <FaultDiagnosisBar {...component} />
          </Col>
        ))}
      </Grid>
    );
  } else {
    return (
      <MutedCard title={intl.get('component.health.status')} {...cardProps}>
        <Grid>
          {components.map((component) => (
            <Col key={component.componentId} {...generateColProps({ lg: 12, xl: 12, xxl: 12 })}>
              <FaultDiagnosisCard {...component} />
            </Col>
          ))}
        </Grid>
      </MutedCard>
    );
  }
};

const FaultDiagnosisBar = ({
  componentId,
  healthIndex,
  status
}: FaultDiagnosis['components'][0]) => {
  return (
    <>
      <Flex justify='space-between'>
        <Space>
          {intl.get(Component.get(componentId).label)}
          <span>（{intl.get(status.label)}）</span>
        </Space>
        {healthIndex}
      </Flex>
      <Progress
        percent={healthIndex}
        showInfo={false}
        strokeColor={`rgba(${status.color.join()}, 0.45)`}
      />
    </>
  );
};

const FaultDiagnosisCard = ({
  componentId,
  status,
  faults,
  iso
}: FaultDiagnosis['components'][0]) => {
  const { healthy, descriptionWithConfidence } = useHealthStatus({ status, faults });
  const color = healthy.status.key === 1 ? `rgba(0,0,0,.88)` : '#fff';

  return (
    <MutedCard
      style={{
        height: '100%',
        color,
        background: `no-repeat center right 15% / 80px url(${BoxSvg}) rgba(${healthy.status.color.join()}, .85)`
      }}
      title={intl.get(Component.get(componentId).label)}
    >
      <Descriptions
        items={[
          {
            label: healthy.label,
            children: intl.get(healthy.status.label)
          },
          {
            ...descriptionWithConfidence,
            children: Array.isArray(descriptionWithConfidence.children)
              ? descriptionWithConfidence.children.map((desc) => (
                  <React.Fragment key={desc}>
                    {desc}
                    <br />
                  </React.Fragment>
                ))
              : descriptionWithConfidence.children
          },
          {
            label: intl.get('iso.diagnosis.status'),
            children: iso ? `${iso.zone} ${intl.get(iso.recommendation)}` : intl.get('NONE')
          }
        ]}
        labelStyle={{ width: '6em', color }}
        contentStyle={{ justifyContent: 'flex-start', color }}
      />
    </MutedCard>
  );
};
