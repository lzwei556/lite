import React from 'react';
import { Space, Tabs } from 'antd';
import intl from 'react-intl-universal';
import { Card, LightSelectFilter } from 'components';
import { AssetRow } from 'asset-common';
import { Property, useProperties } from './useTrend';
import { TimeDomain } from './timeDomain';
import { useOriginalDomain } from './useOriginalDomain';
import { Frequency } from './frequency';
import { TimeDomainData, useTimeDomain } from './useTimeDomain';
import { TimeEnvelope } from './timeEnvelope';
import { Envelope } from './envelope';
import { Power } from './power';
import { Cepstrum } from './cepstrum';
import { Zoom } from './zoom';
import { Cross } from './cross';
import { TimeFrequency } from './timeFrequency';
import { MarkContext } from './mark';
import { WaterFall } from './waterFall';
import { OrbitPlot } from './orbitPlot';
import { TrendAnalysis } from './trendAnalysis';
import {
  Axis,
  AxisWithVibrationDirectionLabel,
  MonitoringPoint,
  useAxisWithVibrationDirection,
  VibrationDirectionAttributes
} from 'common';

export type AnalysisCommonProps = {
  id: number;
  attributes?: MonitoringPoint['attributes'];
  timestamp: number;
  axis: AxisWithVibrationDirectionLabel;
  property: Property;
  timeDomain?: { loading: boolean; data?: TimeDomainData };
  originalDomain?: OriginalDomainResponse;
  timestamps: number[];
  parent: AssetRow;
};

export type OriginalDomainResponse = {
  frequency: number;
  fullScale: number;
  number: number;
  range: number;
  values: number[];
  xAxis: number[];
  xAxisUnit?: string;
};

const analysisWithOnlyAcceleration = ['time-envelope', 'envelope', 'cross'];

export const AnalysisContent = (props: Omit<AnalysisCommonProps, 'axis' | 'property'>) => {
  const [activeKey, setActiveKey] = React.useState('time-domain');
  const isAnalysisOnlyAcceleration = analysisWithOnlyAcceleration.includes(activeKey);
  const { property, properties, setProperties } = useProperties(
    isAnalysisOnlyAcceleration ? 'acceleration' : undefined
  );
  const { axis, setAxis, options } = useAxisWithVibrationDirection(
    props.attributes as VibrationDirectionAttributes
  );
  const timeDomain = useTimeDomain({ ...props, axis, property });
  const originalDomain = useOriginalDomain(props.id, props.timestamp, axis.value);

  const renderFilters = () => {
    return (
      <Space>
        {!isAnalysisOnlyAcceleration && (
          <LightSelectFilter
            allowClear={false}
            options={properties.map((p) => ({ ...p, label: intl.get(p.label) }))}
            onChange={(value) =>
              setProperties((prev) => prev.map((p) => ({ ...p, selected: p.value === value })))
            }
            value={property.value}
          />
        )}
        {activeKey !== 'cross' && renderAxisSelect()}
      </Space>
    );
  };

  const renderAxisSelect = () => {
    return (
      <LightSelectFilter
        allowClear={false}
        options={options.map((a) => ({ ...a, label: intl.get(a.label) }))}
        onChange={(value: Axis.Option['value']) => {
          const axis = options.find((opt) => opt.value === value);
          if (axis) {
            setAxis(axis);
          }
        }}
        popupMatchSelectWidth={false}
        value={axis.value}
      />
    );
  };

  return (
    <Card styles={{ body: { paddingTop: 0 } }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'time-domain',
            label: 'time.domain',
            children: (
              <MarkContext>
                <TimeDomain {...{ ...props, axis, property, timeDomain }} />
              </MarkContext>
            )
          },
          {
            key: 'frequency',
            label: 'spectrum',
            children: (
              <MarkContext type='frequency'>
                <Frequency {...{ ...props, axis, property, timeDomain, originalDomain }} />
              </MarkContext>
            )
          },
          {
            key: 'time-envelope',
            label: 'time.envelope',
            children: <TimeEnvelope {...{ ...props, axis, property, originalDomain }} />
          },
          {
            key: 'envelope',
            label: 'envelope.spectrum',
            children: (
              <MarkContext type='envelope'>
                <Envelope {...{ ...props, axis, property, timeDomain, originalDomain }} />
              </MarkContext>
            )
          },
          {
            key: 'power',
            label: 'power.spectrum',
            children: <Power {...{ ...props, axis, property, originalDomain }} />
          },
          {
            key: 'cross',
            label: 'cross.spectrum',
            children: (
              <Cross
                {...{
                  ...props,
                  axis,
                  property,
                  originalDomain,
                  currentFilters: <Space>{renderAxisSelect()}</Space>
                }}
              />
            )
          },
          {
            key: 'zoom',
            label: 'zoom.fft',
            children: <Zoom {...{ ...props, axis, property, originalDomain }} />
          },
          {
            key: 'cepstrum',
            label: 'cepstrum',
            children: <Cepstrum {...{ ...props, axis, property, originalDomain }} />
          },
          {
            key: 'time-frequency',
            label: 'stft',
            children: <TimeFrequency {...{ ...props, axis, property, originalDomain }} />
          }
          // {
          //   key: 'water-fall',
          //   label: 'water.fall',
          //   children: (
          //     <ChartMark.Context>
          //       <WaterFall {...{ ...props, axis, property, originalDomain }} />
          //     </ChartMark.Context>
          //   )
          // },
          // {
          //   key: 'orbit-plot',
          //   label: 'orbit.plot',
          //   children: (
          //     <ChartMark.Context>
          //       <OrbitPlot {...{ ...props, axis, property, originalDomain }} />
          //     </ChartMark.Context>
          //   )
          // }
          // {
          //   key: 'trend-analysis',
          //   label: 'trend.analysis',
          //   children: (
          //     <ChartMark.Context>
          //       <TrendAnalysis {...{ ...props, axis, property, originalDomain }} />
          //     </ChartMark.Context>
          //   )
          // }
        ].map((item) => ({ ...item, label: intl.get(item.label) }))}
        size='large'
        tabBarExtraContent={renderFilters()}
        tabBarGutter={24}
      />
    </Card>
  );
};
