import { Empty, Space, Typography } from 'antd';
import { LineChart, MutedCard } from 'components';
import { Feature, FeatureProperty } from 'domain/feature-property';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { useOriginalDomain } from 'features/vibration-analysis/useOriginalDomain';
import { useTimeDomain } from 'features/vibration-analysis/useTimeDomain';
import { SVT_OPTIONS } from 'features/vibration-analysis/useTrend';
import { useLocaleContext } from 'localeProvider';
import {
  frequency,
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow
} from 'monitoring-point';
import React from 'react';
import intl from 'react-intl-universal';
import { useGlobalStyles } from 'styles';
import { Dayjs, getDisplayName, getValue, roundValue } from 'utils';

// 此功能和诊断已经没有关系了，所以应该放在feature-data文件夹下，然后在使用时调用

const [from, to] = Dayjs.toRange(Dayjs.CommonRange.PastWeek);
type Props = {
  id: number;
  timestamp: number;
  axis: any;
  property: (typeof SVT_OPTIONS)[0];
  rotationSpeed?: number;
};

export const MoniotoringPointData = ({
  monitoringPoint,
  rotationSpeed
}: {
  monitoringPoint: MonitoringPointRow;
  rotationSpeed?: number;
}) => {
  const { id, attributes } = monitoringPoint;
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const { options } = OMonitoringPoint.Settings.Vibration.useAxisWithVibrationDirection(
    attributes as TMonitoringPoint.Settings.VibrationDirection
  );
  const axis = options[0];
  const [timestamp, setTimestamp] = React.useState<number>();
  const property = SVT_OPTIONS[1];

  React.useEffect(() => {
    try {
      getDataOfMonitoringPoint(id, from, to).then((data) => {
        if (data.length > 0) {
          setHistoryData([data[data.length - 1]]);
        } else {
          setHistoryData(undefined);
        }
      });
      getDataOfMonitoringPoint(id, from, to, 'trend' as any).then((data) => {
        if (data.length > 0) {
          setTimestamp(data[data.length - 1].timestamp);
        } else {
          setHistoryData(undefined);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const { language } = useLocaleContext();
  const { colorLayoutBgStyle } = useGlobalStyles();

  if (!historyData || historyData.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  const properties = OMonitoringPoint.Type.getProperties(monitoringPoint)
    .filter((p) => !!p.first)
    .map((p) => ({
      ...p,
      fields: FeatureProperty.appendVibrationDirectionAbbr(p.fields, attributes)
    }));

  return (
    <>
      <MutedCard
        extra={Dayjs.format(historyData[0].timestamp)}
        style={{ ...colorLayoutBgStyle }}
        title={intl.get('feature.data')}
      >
        {properties.map((p) => {
          const { name, precision, unit } = p;
          const values = transform(historyData, p);
          return (
            <Space direction='vertical' styles={{ item: { marginRight: '2em' } }} key={p.name}>
              <Typography.Text type='secondary'>
                {getDisplayName({ name: intl.get(name).d(name), suffix: unit, lang: language })}
              </Typography.Text>
              <Space direction='vertical' size={2}>
                {values.map(({ name, last }) => (
                  <Space key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {values.length > 1 ? (
                      <Typography.Text type='secondary'>{name}</Typography.Text>
                    ) : (
                      ''
                    )}
                    {getValue({ value: last, precision })}
                  </Space>
                ))}
              </Space>
            </Space>
          );
        })}
      </MutedCard>
      {timestamp && <Charts {...{ id, timestamp, axis, property, rotationSpeed }} />}
    </>
  );
};

const transform = (
  origin: HistoryData | undefined | null,
  property: Feature.Property,
  naming?: { replace?: string; prefix?: string },
  axisKey?: string
) => {
  if (!origin || origin.length === 0) return [];
  const series =
    property.fields
      ?.filter((f) =>
        property.onlyShowFirstField
          ? f.first
          : axisKey
          ? f.key === `${property.key}_${axisKey}` || f.key === axisKey
          : true
      )
      .map((f) => {
        let seriesName = property.onlyShowFirstField
          ? intl.get(property.name)
          : intl.get(f.alias ?? f.name);
        if (naming) {
          const { replace, prefix } = naming;
          if (replace) {
            seriesName = replace;
          } else if (prefix) {
            seriesName = `${prefix}${seriesName}`;
          }
        }
        return {
          [seriesName]: origin.map(({ values }) => {
            const value = values.find((v) => v.key === property.key);
            return value?.data?.[f.name] ?? NaN;
          })
        };
      }) ?? [];
  return series.map((s) => {
    const [name, data] = Object.entries(s)[0];
    const validData = data.filter((d) => !Number.isNaN(d));
    return {
      name,
      last: data[data.length - 1],
      min: property.min ?? Math.min(...validData),
      max: Math.max(...validData)
    };
  });
};

const Charts = (props: Props) => {
  const { id, timestamp, axis } = props;
  const originalDomain = useOriginalDomain(id, timestamp, axis.value);

  return (
    <>
      {/* <Waveform {...{ ...props, originalDomain }} /> */}
      <TimeDomain {...props} />
      <Frequency {...{ ...props, originalDomain }} />
    </>
  );
};

const TimeDomain = ({ id, timestamp, axis, property }: Props) => {
  const { language } = useLocaleContext();
  const timeDomain = useTimeDomain({ id, timestamp, axis, property });
  const { x = [], y = [], xAxisUnit } = timeDomain.data || {};
  const { colorLayoutBgStyle } = useGlobalStyles();
  return (
    <MutedCard
      extra={Dayjs.format(timestamp)}
      style={{ marginTop: 8, ...colorLayoutBgStyle }}
      title={
        <Space>
          {`${intl.get(property.label)}${language === 'en-US' ? ' ' : ''}${intl.get(
            'time.domain'
          )}`}
          {intl.get(axis.label)}
        </Space>
      }
    >
      <LineChart
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
            grid: { top: 30, bottom: 0, right: 40 }
          }
        }}
        loading={timeDomain.loading}
        series={[
          {
            data: { [intl.get(axis.label)]: y },
            xAxisValues: x.map((n) => `${n}`),
            raw: { sampling: 'lttb' }
          }
        ]}
        style={{ flex: 1, height: 160 }}
        yAxisMeta={{ ...property, unit: property.unit }}
      />
    </MutedCard>
  );
};

const Frequency = ({
  axis,
  property,
  originalDomain,
  rotationSpeed,
  timestamp
}: Props & {
  originalDomain: any;
}) => {
  const { x, y, loading } = useFrequency(originalDomain, property, rotationSpeed) || {};
  const { language } = useLocaleContext();
  const { colorLayoutBgStyle } = useGlobalStyles();
  return (
    <MutedCard
      extra={Dayjs.format(timestamp)}
      style={{ marginTop: 8, ...colorLayoutBgStyle }}
      title={
        <Space>
          {`${intl.get(property.label)}${language === 'en-US' ? ' ' : ''}${intl.get('spectrum')}`}
          {intl.get(axis.label)}
        </Space>
      }
    >
      <LineChart
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
            grid: { top: 30, bottom: 0, right: 40 }
          }
        }}
        loading={loading}
        series={[
          {
            data: { [intl.get(axis.label)]: y },
            xAxisValues: x.map((n: number) => `${n}`),
            raw: { sampling: 'lttb' }
          }
        ]}
        style={{ flex: 1, height: 160 }}
        yAxisMeta={{ ...property, unit: property.unit }}
      />
    </MutedCard>
  );
};

const useFrequency = (originalDomain: any, property: any, rotation_speed: any) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>();
  const { x = [], y = [] } = data || {};

  React.useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, [property.value, originalDomain, rotation_speed]);
  return { x, y, loading };
};
