import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Descriptions, Grid } from '../../../components';
import { getValue } from '../../../utils';
import { RotationSpeed } from '../../../asset-variant';
import { AnalysisSidebarCollapse } from '../..';
import { AnalysisCommonProps } from './analysisContent';
import { MarkList, SingleDoubleToggle, useMarkChartProps } from './mark';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';

export const TimeDomain = ({
  axis,
  property,
  timeDomain,
  id,
  timestamp,
  parent
}: AnalysisCommonProps) => {
  const { loading, data } = timeDomain || {};
  const { x = [], y = [], range, frequency, number, xAxisUnit } = data || {};
  const { marks, handleClick, handleRefresh, markType } = useMarkChartProps();
  const downlaodRawDataHandler = useDownloadRawDataHandler(
    id,
    timestamp,
    `${property.value}TimeDomain`
  );
  const rotation_speed = parent.attributes?.rotation_speed;

  React.useEffect(() => {
    handleRefresh(x, y);
  }, [handleRefresh, x, y]);

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{ extra: <SingleDoubleToggle /> }}
          config={{
            opts: {
              xAxis: {
                name: xAxisUnit,
                axisLabel: {
                  formatter: (value: string) => `${Number(value).toFixed(0)}`,
                  interval: Math.floor(x.length / 20)
                }
              },
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 40 }
            }
          }}
          loading={loading}
          onEvents={{
            click: (coord: [string, number], xIndex?: number) => {
              handleClick(coord, x, y, xIndex);
            }
          }}
          series={ChartMark.useMergeMarkDatas({
            series: [
              {
                data: { [intl.get(axis.abbr)]: y },
                xAxisValues: x.map((n) => `${n}`),
                raw: { animation: false }
              }
            ],
            marks
          })}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['download', 'save_image', 'refresh'],
            download: {
              onClick() {
                downlaodRawDataHandler();
              },
              tooltip: 'DOWNLOAD_DATA'
            },
            onRefresh: () => handleRefresh(x, y)
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        />
      </Col>
      <Col flex='300px'>
        <AnalysisSidebarCollapse
          defaultActiveKey={['overview', 'forecast', 'marklist']}
          items={[
            {
              key: 'overview',
              label: intl.get('BASIC_INFORMATION'),
              children: (
                <Descriptions
                  items={[
                    {
                      label: intl.get('SETTING_RANGE'),
                      children: getValue({ value: range, unit: 'g' })
                    },
                    {
                      label: intl.get('SETTING_SAMPLING_FREQUNECY'),
                      children: getValue({ value: frequency, unit: 'Hz' })
                    },
                    { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number },
                    {
                      label: intl.get(RotationSpeed.label),
                      children: getValue({ value: rotation_speed, unit: RotationSpeed.unit })
                    }
                  ]}
                />
              )
            },
            {
              key: 'marklist',
              label: intl.get(`analysis.vibration.cursor.${markType.toLowerCase()}`),
              children: <MarkList />
            }
          ]}
        />
      </Col>
    </Grid>
  );
};
