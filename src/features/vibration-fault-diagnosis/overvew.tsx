import React from 'react';
import { FaultDiagnosis, useHealthStatus } from './common';
import { Avatar, Col, Space } from 'antd';
import { HealthStatus, getOptions } from './health-status';
import { Descriptions, Grid, MutedCard } from '../../components';
import intl from 'react-intl-universal';
import { Dayjs } from '../../utils';

export const FaultDiagnosisOverview = (props: FaultDiagnosis) => {
  return (
    <MutedCard title={intl.get('diagnosis.asset.health')} extra={Dayjs.format(props.timestamp)}>
      <Grid wrap={false} align='middle'>
        <Col flex='auto'>
          <DiagnosisDescription {...props} />
        </Col>
        <Col
          flex='280px'
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <HealthyCard {...props} />
        </Col>
      </Grid>
    </MutedCard>
  );
};

const DiagnosisDescription = ({ conclusion, components, status }: FaultDiagnosis) => {
  const { healthy, description, suggestion } = useHealthStatus({
    status,
    faultTypes: components.reduce((prev, crt) => [...prev, ...crt.faultTypes], [] as number[])
  });

  return (
    <Descriptions
      items={[
        {
          label: healthy.label,
          children: (
            <span style={{ color: `rgba(${healthy.status.color.join()})` }}>
              {intl.get(healthy.status.label)}
            </span>
          )
        },
        { label: intl.get('diagnosis.conclusion'), children: '' },
        description,
        suggestion
      ]}
      labelStyle={{ width: '6em' }}
      contentStyle={{ justifyContent: 'flex-start' }}
    />
  );
};

const HealthyCard = (diagnosis: FaultDiagnosis) => {
  return (
    <Space direction='vertical' align='center'>
      <HealthIndex {...diagnosis} />
      <div>
        {getOptions().map((status) => (
          <HealthStatusTag {...status} key={status.label} />
        ))}
      </div>
    </Space>
  );
};

const HealthIndex = ({ healthIndex, status }: FaultDiagnosis) => {
  return (
    <Space style={{ textAlign: 'center' }} direction='vertical'>
      <Avatar
        shape='circle'
        icon={healthIndex}
        size={60}
        style={{
          background: `rgba(${status.color}, 0.15)`,
          color: `rgba(${status.color})`
        }}
      />
      {intl.get('diagnosis.health.index')}
    </Space>
  );
};

const HealthStatusTag = ({ color, label, range }: Omit<HealthStatus, 'key'>) => {
  return (
    <Space
      direction='vertical'
      size={0}
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        marginRight: 4,
        marginBottom: 2,
        paddingInline: 1,
        paddingBlock: 3,
        fontSize: 12,
        lineHeight: 1.2,
        background: `rgba(${color.join()}, 0.15)`
      }}
    >
      <span style={{ color: `rgba(${color.join()})` }}>{range}</span>
      {intl.get(label)}
    </Space>
  );
};
