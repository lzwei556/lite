import React from 'react';
import { FaultDiagnosis } from './common';
import { Avatar, Col, Space } from 'antd';
import { getHealthStatusByValue, HealthStatus, healthStatusTable } from './health-status';
import { Descriptions, Grid, MutedCard } from '../../components';
import intl from 'react-intl-universal';
import { useLocaleContext } from '../../localeProvider';
import { Dayjs } from '../../utils';
import { getFaultByCategory } from './fault';

export const FaultDiagnosisOverview = ({
  name
}: // diagnosis
// }: { name: string } & { diagnosis: FaultDiagnosis }) => {
{
  name: string;
}) => {
  const diagnosis: FaultDiagnosis = {
    healthIndex: 48,
    timestamp: 1762486214,
    status: getHealthStatusByValue(3),
    faults: [1].map(getFaultByCategory)
  };

  return (
    <MutedCard title={intl.get('diagnosis.asset.health')} extra={Dayjs.format(diagnosis.timestamp)}>
      <Grid wrap={false} align='middle'>
        <Col flex='auto'>
          <DiagnosisDescription {...{ name, ...diagnosis }} />
        </Col>
        <Col
          flex='280px'
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <HealthyCard {...diagnosis} />
        </Col>
      </Grid>
    </MutedCard>
  );
};

const DiagnosisDescription = ({ faults, name, status }: { name: string } & FaultDiagnosis) => {
  const { language } = useLocaleContext();
  const separator = language === 'en-US' ? '; ' : '；';
  return (
    <Descriptions
      items={[
        { label: intl.get('ASSET'), children: name },
        {
          label: intl.get('diagnosis.health'),
          children: (
            <span style={{ color: `rgba(${status.color.join()})` }}>{intl.get(status.label)}</span>
          )
        },
        {
          label: intl.get('diagnosis.description'),
          children: faults.map(({ description }) => intl.get(description)).join(separator)
        },
        {
          label: intl.get('diagnosis.suggestion'),
          children: faults.map(({ suggestion }) => intl.get(suggestion)).join(separator)
        }
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
        {Object.values(healthStatusTable).map((status) => (
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

const HealthStatusTag = ({ color, label, range }: Omit<HealthStatus, 'value'>) => {
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
