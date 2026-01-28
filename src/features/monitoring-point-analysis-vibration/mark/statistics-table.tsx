import { Col, Space, Typography } from 'antd';
import { Grid, Table } from 'components';
import React from 'react';
import { getMarkTypeLabel } from './mark-types';
import intl from 'react-intl-universal';
import { getDisplayName, getValue, roundValue } from 'utils';
import { useLocaleContext } from 'localeProvider';
import { getFaultFrequency, getTop10 } from './hooks';
import { FaultFrequency } from '../useFaultFrequency';
import { Property } from '../useTrend';
import { HarmonicData } from 'asset-common';
import { getHarmonic } from './harmonic';

export const StatisticsTable = ({
  x,
  y,
  harmonic,
  faultFrequency,
  property
}: {
  x: number[];
  y: number[];
  harmonic?: HarmonicData;
  faultFrequency?: FaultFrequency;
  property?: Property;
}) => {
  const { language } = useLocaleContext();

  return (
    <Grid>
      <Col span={24}>
        <Grid wrap={false}>
          <Col span={12}>
            <Table
              cardProps={{ title: getMarkTypeLabel('Harmonic') }}
              columns={[
                {
                  dataIndex: 'index',
                  title: intl.get('FIELD_FREQUENCY'),
                  render: (_, row, i) => {
                    return (
                      <Space>
                        <span style={{ display: 'inline-block', width: '3em' }}>{`${i + 1}x`}</span>
                        <Typography.Text type='secondary'>
                          {getValue({ value: row[0], unit: 'Hz' })}
                        </Typography.Text>
                      </Space>
                    );
                  },
                  width: 180
                },
                {
                  dataIndex: 'value',
                  title: getDisplayName({
                    name: intl.get('amplitude'),
                    lang: language,
                    suffix: property?.unit
                  }),
                  render: (_, row: any) => roundValue(row[1])
                }
              ]}
              dataSource={getHarmonic({ x, y, harmonic })}
              noScroll={true}
              pagination={false}
              rowKey={(row) => row?.[0]}
            />
          </Col>
          <Col span={12}>
            <Table
              cardProps={{ title: getMarkTypeLabel('Top10') }}
              columns={[
                {
                  dataIndex: 'index',
                  title: intl.get('FIELD_FREQUENCY'),
                  render: (_, row, i) => {
                    return (
                      <Space>
                        <span style={{ display: 'inline-block', width: '3em' }}>{i + 1}</span>
                        <Typography.Text type='secondary'>
                          {getValue({ value: row.frequency, unit: 'Hz' })}
                        </Typography.Text>
                      </Space>
                    );
                  },
                  width: 180
                },
                {
                  dataIndex: 'order',
                  title: intl.get('top10.order'),
                  render: (_, row: any) => roundValue(row.order, 1),
                  width: 120
                },
                {
                  dataIndex: 'value',
                  title: getDisplayName({
                    name: intl.get('amplitude'),
                    lang: language,
                    suffix: property?.unit
                  }),
                  render: (_, row: any) => roundValue(row.value, 5)
                }
              ]}
              dataSource={getTop10({ x, y, harmonic })}
              noScroll={true}
              pagination={false}
              rowKey={(row) => row.value}
            />
          </Col>
        </Grid>
      </Col>
      <Col span={24}>
        <Table
          cardProps={{ title: getMarkTypeLabel('Faultfrequency') }}
          tableLayout='fixed'
          columns={[
            {
              dataIndex: 'name',
              title: intl.get('NAME'),
              render: (_, row: any) => (
                <Space>
                  <span style={{ display: 'inline-block', width: '3em' }}>{row.label}</span>
                  <Typography.Text type='secondary'>
                    {getValue({ value: row.value, unit: 'Hz' })}
                  </Typography.Text>
                </Space>
              ),
              width: 120
            },
            {
              dataIndex: '1x',
              title: getDisplayName({ name: '1x', lang: language, suffix: property?.unit }),
              render: (_, row: any) => roundValue(row.data?.[0]),
              width: 120
            },
            {
              dataIndex: '2x',
              title: getDisplayName({ name: '2x', lang: language, suffix: property?.unit }),
              render: (_, row: any) => roundValue(row.data?.[1]),
              width: 120
            },
            {
              dataIndex: '3x',
              title: getDisplayName({ name: '3x', lang: language, suffix: property?.unit }),
              render: (_, row: any) => roundValue(row.data?.[2]),
              width: 120
            }
          ]}
          dataSource={getFaultFrequency({
            x,
            y,
            faultFrequencies: faultFrequency
              ? Object.entries(faultFrequency).map(([key, value]) => ({
                  label: intl.get(`fault.frequency.${key}`),
                  value
                }))
              : []
          })}
          noScroll={true}
          pagination={false}
          rowKey={(row) => row.value}
        />
      </Col>
    </Grid>
  );
};
