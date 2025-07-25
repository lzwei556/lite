import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { roundValue } from '../../../utils/format';
import { ChartMark, Card, Descriptions, Grid } from '../../../components';
import { AnalysisSidebarCollapse } from '../../../features';
import { frequency, FrequencyAnalysis } from '../../asset-common';
import { AnalysisCommonProps } from './analysisContent';
import Sideband from './sideband';
import { MarkList, Toolbar, useMarkChartProps, ConfigurableNumsOfCursor } from './mark';
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
  const [data, setData] = React.useState<FrequencyAnalysis>();
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
  const [open, setOpen] = React.useState(false);

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
        .then(({ x, y, ...rest }) => setData({ x: x.map((n) => roundValue(n)), y, ...rest }))
        .finally(() => setLoading(false));
    } else {
      setData(undefined);
    }
  }, [property.value, originalDomain, rotation_speed]);

  React.useEffect(() => {
    const faultFrequencies = faultFrequency
      ? Object.entries(faultFrequency).map(([key, value]) => ({
          label: intl.get(`fault.frequency.${key}`),
          value
        }))
      : [];
    handleRefresh(x, y, { harmonic: data, faultFrequencies });
  }, [handleRefresh, x, y, data, faultFrequency]);

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
                xAxisValues: x.map((n) => `${n}`),
                raw: { animation: false }
              }
            ],
            marks
          })}
          style={{ height: 450 }}
          toolbar={{
            visibles: ['download', 'save_image', 'refresh', 'set'],
            download: {
              onClick() {
                downlaodRawDataHandler();
              },
              tooltip: 'DOWNLOAD_DATA'
            },
            set: {
              onClick() {
                setOpen(true);
              },
              tooltip: 'nums.of.cursors.settings'
            },
            onRefresh: () => {
              const faultFrequencies = faultFrequency
                ? Object.entries(faultFrequency).map(([key, value]) => ({
                    label: intl.get(`fault.frequency.${key}`),
                    value
                  }))
                : [];
              handleRefresh(x, y, { harmonic: data, faultFrequencies });
            }
          }}
          yAxisMeta={{ ...property, unit: property.unit }}
        >
          {isTypeSideband && <Sideband.Switcher />}
          <ConfigurableNumsOfCursor
            open={open}
            onSuccess={() => {
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
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
