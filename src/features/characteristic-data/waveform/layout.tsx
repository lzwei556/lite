import React from 'react';
import { DataType, useMonitoringPointWaveforms, useWaveformData } from '../use-services';
import { CustmizableIntervalLayout } from '../custmizable-interval-layout';
import { Col, Empty, Spin } from 'antd';
import { Card, Descriptions, Grid, useRange } from 'components';
import { Dayjs, getValue } from 'utils';
import { VibrationWaveformFilters, WaveformData } from '../types';
import intl from 'react-intl-universal';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';
import { TimestampsList } from './timestamps-list';

export type FetchData = (filters?: VibrationWaveformFilters | undefined) => Promise<WaveformData>;
type Props = {
  id: number;
  children: (params: { data: WaveformData; type: number; fetchData: FetchData }) => React.ReactNode;
  type: WaveformMonitoringPointKey;
  vibrationFilters?: VibrationWaveformFilters;
};

export const WaveformLayout = (props: Props) => {
  const { loading, timestamps, dateRangePickerProps, dataType } = useLayoutProps(props);

  return (
    <CustmizableIntervalLayout
      content={
        timestamps.length === 0 ? (
          <Card>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        ) : (
          <Timestamps {...{ ...props, dataType, timestamps }} />
        )
      }
      dateRangePickerProps={dateRangePickerProps}
      loading={loading}
    />
  );
};

const useLayoutProps = ({ id, type }: Props) => {
  const { dataType } = monitoringPointTypeWaveformMap[type];
  const { timestamps, loading, initialRange, fetchData } = useMonitoringPointWaveforms(
    id,
    dataType
  );
  const { setRange } = useRange(initialRange);
  return {
    dateRangePickerProps: {
      defaultValue: initialRange,
      onChange: (range: Dayjs.RangeValue) => {
        fetchData(id, 'monitoringPoints', Dayjs.toRange(range), dataType).then(() =>
          setRange(range)
        );
      }
    },
    dataType,
    loading,
    timestamps
  };
};

const Timestamps = (
  props: Props & {
    dataType: DataType;
    timestamps: number[];
  }
) => {
  const { data, loading, fetchData, timestamp, setTimestamp } = useSelectedTimestampProps(props);

  return (
    <Grid wrap={false}>
      <Col flex='300px'>
        <TimestampsList
          {...{
            ...props,
            onClick: (timestamp) => {
              setTimestamp(timestamp);
              fetchData(props.id, timestamp, props.dataType, props.vibrationFilters);
            },
            timestamp
          }}
        />
      </Col>
      <Col flex='auto'>
        {data && (
          <Spin spinning={loading}>
            <Grid>
              <Meta {...{ data, type: props.type }} />
              <Col span={24}>
                {props.children({
                  data,
                  type: props.type,
                  fetchData: (filters) => fetchData(props.id, timestamp, props.dataType, filters)
                })}
              </Col>
            </Grid>
          </Spin>
        )}
      </Col>
    </Grid>
  );
};

const useSelectedTimestampProps = (
  params: Props & {
    dataType: DataType;
    timestamps: number[];
  }
) => {
  const [timestamp, setTimestamp] = React.useState(params.timestamps[0]);
  const { data, loading, runAsync } = useWaveformData([
    params.id,
    timestamp,
    params.dataType,
    params.vibrationFilters
  ]);
  return { timestamp, setTimestamp, data, loading, fetchData: runAsync };
};

const Meta = (params: { data: WaveformData; type: number }) => {
  const { showMeta, metaProps } = useMetaProps(params);
  return (
    showMeta && (
      <Col span={24}>
        <Card>
          <Descriptions {...metaProps} />
        </Card>
      </Col>
    )
  );
};

const useMetaProps = ({ data, type }: { data: WaveformData; type: WaveformMonitoringPointKey }) => {
  return {
    showMeta: !!data.values.metadata,
    metaProps: {
      bordered: true,
      column: { xxl: 3, xl: 2, lg: 2, md: 2, xs: 1 },
      items: monitoringPointTypeWaveformMap[type].meta?.map(({ key, name, unit, precision }) => ({
        label: intl.get(name),
        children: getValue({ value: data.values.metadata![key], unit, precision })
      }))
    }
  };
};
