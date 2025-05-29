import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { frequency, FrequencyAnalysis } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import CenterSide from './centerSide';
import { MarkList, Toolbar, useMarkChartProps } from './mark';
import { useDownloadRawDataHandler } from './useDownladRawDataHandler';
import { useFaultFrequency } from './useFaultFrequency';
import { FaultFrequencyMarkList } from './faultFrequencyMarkList';

export const Frequency = ({
  axis,
  property,
  timeDomain,
  originalDomain,
  id,
  timestamp,
  parent
}: AnalysisCommonProps) => {
  const { range, frequency: timeDomainFrequency, number } = timeDomain?.data || {};
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Omit<FrequencyAnalysis, 'x'> & { x: string[] }>();
  const { x = [], y = [] } = data || {};
  const { marks, handleClick, isTypeSideband, handleRefresh, markType } = useMarkChartProps();
  const downlaodRawDataHandler = useDownloadRawDataHandler(
    id,
    timestamp,
    `${property.value}FrequencyDomain`
  );
  const rotation_speed = parent.attributes?.rotation_speed;
  //@ts-ignore
  const { faultFrequency } = useFaultFrequency(parent.attributes);

  React.useEffect(() => {
    if (property.value && originalDomain) {
      const { frequency: fs, fullScale, range, values } = originalDomain;
      setLoading(true);
      const data = {
        property: property.value,
        data: values,
        fs,
        full_scale: fullScale,
        range,
        window: 'hann'
      };
      frequency(rotation_speed ? { ...data, rpm: rotation_speed } : data)
        .then(({ x, y, ...rest }) => setData({ x: x.map((n) => `${n}`), y, ...rest }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [property.value, originalDomain, rotation_speed]);

  React.useEffect(() => {
    handleRefresh(x, y, data);
  }, [handleRefresh, x, y, data]);

  return (
    <Grid>
      <Col flex='auto'>
        <ChartMark.Chart
          cardProps={{
            extra: <Toolbar />,
            style: { position: 'relative', border: 'solid 1px #d3d3d3' }
          }}
          config={{
            opts: {
              xAxis: {
                name: 'Hz',
                axisLabel: {
                  formatter: (value: string) => `${Number(value).toFixed(0)}`,
                  interval: Math.floor(x.length / 20)
                }
              },
              yAxis: { name: property.unit },
              dataZoom: [{ start: 0, end: 100 }],
              grid: { top: 60, bottom: 60, right: 30 }
            }
          }}
          loading={loading}
          onEvents={{
            click: (coord: [string, number], xIndex?: number) => {
              handleClick(coord, x, y, xIndex);
            }
          }}
          series={ChartMark.mergeMarkDatas({
            series: [
              {
                data: { [intl.get(axis.label)]: y ?? [] },
                xAxisValues: x ?? [],
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
            onRefresh: () => handleRefresh(x, y, data)
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        >
          {isTypeSideband && <CenterSide.Switcher />}
        </ChartMark.Chart>
      </Col>
      <Col flex='300px'>
        <AnalysisSidebarCollapse
          defaultActiveKey={['overview', 'marklist']}
          items={[
            {
              key: 'overview',
              label: intl.get('BASIC_INFORMATION'),
              children: (
                <Card>
                  <Descriptions
                    items={[
                      { label: intl.get('SETTING_RANGE'), children: `${range}g` },
                      {
                        label: intl.get('SETTING_SAMPLING_FREQUNECY'),
                        children: `${timeDomainFrequency}Hz`
                      },
                      { label: intl.get('SETTING_SAMPLING_NUMBER'), children: number },
                      {
                        label: intl.get('motor.rotation_speed'),
                        children: rotation_speed ? `${rotation_speed}RPM` : '-'
                      }
                    ]}
                  />
                </Card>
              ),
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            },
            {
              key: 'marklist',
              label: intl.get(`analysis.vibration.cursor.${markType.toLowerCase()}`),
              children:
                markType === 'Faultfrequency' ? (
                  <FaultFrequencyMarkList faultFrequency={faultFrequency} />
                ) : (
                  <MarkList />
                ),
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            }
          ]}
        />
      </Col>
    </Grid>
  );
};
