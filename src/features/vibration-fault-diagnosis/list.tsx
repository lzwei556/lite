import intl from 'react-intl-universal';
import { CardProps, Descriptions, Flex, Grid, MutedCard } from 'components';
import { FaultDiagnosis, useHealthStatus } from './common';
import { Col, Progress, Space } from 'antd';
import { Component } from 'common';
import { generateColProps } from 'utils/grid';
import BoxSvg from './box.svg';

export const ComponentsHealthyList = ({
  cardProps,
  components,
  type = 'bar'
}: FaultDiagnosis & {
  cardProps?: CardProps;
  type?: 'bar' | 'card';
}) => {
  return (
    <MutedCard title={intl.get('component.health.status')} {...cardProps}>
      {components.length === 0 ? (
        intl.get('diagnosis.no.errors')
      ) : (
        <Grid>
          {components.map((component) => (
            <Col
              key={component.componentId}
              {...(type !== 'bar'
                ? generateColProps({ lg: 12, xl: 12, xxl: 12 })
                : generateColProps({}))}
            >
              {type === 'bar' ? (
                <FaultDiagnosisBar {...component} />
              ) : (
                <FaultDiagnosisCard {...component} />
              )}
            </Col>
          ))}
        </Grid>
      )}
    </MutedCard>
  );
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
          {intl.get(Component.Key.get(componentId).label)}
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
  faultTypes
}: FaultDiagnosis['components'][0]) => {
  const { healthy, description, suggestion } = useHealthStatus({
    status,
    faultTypes
  });

  return (
    <MutedCard
      style={{
        color: '#fff',
        background: `no-repeat center right 10% / 50px url(${BoxSvg}) rgba(${healthy.status.color.join()}, .85)`
      }}
      title={intl.get(Component.Key.get(componentId).label)}
    >
      <Descriptions
        items={[
          {
            label: healthy.label,
            children: intl.get(healthy.status.label)
          },
          description,
          suggestion
        ]}
        labelStyle={{ width: '6em', color: '#fff' }}
        contentStyle={{ justifyContent: 'flex-start', color: '#fff' }}
      />
    </MutedCard>
  );
};
