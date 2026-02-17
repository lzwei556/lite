import React, { ReactNode } from 'react';
import { Tabs } from 'antd';
import intl from 'react-intl-universal';
import { Card } from 'components';
import { TimeDomain } from './timeDomain';
import { Frequency } from './frequency';
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
import { AnalysisProps } from './useProps';

export const AnalysisTabs = ({
  activeKey,
  setActiveKey,
  extra,
  axisSelect,
  ...props
}: AnalysisProps & {
  activeKey: string;
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
  extra: ReactNode;
  axisSelect: ReactNode;
}) => {
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
                <TimeDomain {...props} />
              </MarkContext>
            )
          },
          {
            key: 'frequency',
            label: 'spectrum',
            children: (
              <MarkContext type='frequency'>
                <Frequency {...props} />
              </MarkContext>
            )
          },
          {
            key: 'time-envelope',
            label: 'time.envelope',
            children: <TimeEnvelope {...props} />
          },
          {
            key: 'envelope',
            label: 'envelope.spectrum',
            children: (
              <MarkContext type='envelope'>
                <Envelope {...props} />
              </MarkContext>
            )
          },
          {
            key: 'power',
            label: 'power.spectrum',
            children: <Power {...props} />
          },
          {
            key: 'cross',
            label: 'cross.spectrum',
            children: <Cross {...{ ...props, currentFilters: axisSelect }} />
          },
          {
            key: 'zoom',
            label: 'zoom.fft',
            children: <Zoom {...props} />
          },
          {
            key: 'cepstrum',
            label: 'cepstrum',
            children: <Cepstrum {...props} />
          },
          {
            key: 'time-frequency',
            label: 'stft',
            children: <TimeFrequency {...props} />
          },
          {
            key: 'water-fall',
            label: 'water.fall',
            children: <WaterFall {...props} />
          }
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
        tabBarExtraContent={extra}
        tabBarGutter={24}
      />
    </Card>
  );
};
