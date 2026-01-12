import React from 'react';
import {
  DataType,
  useBatchWaveformDataDownload,
  useMonitoringPointWaveforms,
  useWaveformData,
  useWaveformDataDownload
} from '../use-services';
import { Col, Spin } from 'antd';
import { Card, Descriptions, Grid, useRange } from 'components';
import {  getValue } from 'utils';
import { VibrationWaveformFilters, WaveformData } from '../types';
import intl from 'react-intl-universal';
import { useLocaleContext } from 'localeProvider/context';
import { monitoringPointTypeWaveformMap, WaveformMonitoringPointKey } from './common';
import { TimestampsPickerLayout } from '../timestamps-picker-layout/layout';
import { TimestampsList } from '../timestamps-picker-layout/timestamps-list';

export type FetchData = (filters?: VibrationWaveformFilters | undefined) => Promise<WaveformData>;
type Props = {
  id: number;
  children: (params: { data: WaveformData; type: number; fetchData: FetchData }) => React.ReactNode;
  type: WaveformMonitoringPointKey;
  vibrationFilters?: VibrationWaveformFilters;
};

export const WaveformContainer = (props: Props) => {
  const { id, children, type, vibrationFilters } = props;
  const { timestamps, dataType, ...rest } = useLayoutProps(props);
  const { data, loading, timestamp, setTimestamp, fetchData } = useSelectedTimestampProps({
    ...props,
    dataType,
    timestamps
  });
  const download = useWaveformDataDownload();
  const batchDownload = useBatchWaveformDataDownload();
  const { language } = useLocaleContext();
  const lang = language === 'en-US' ? 'en' : 'zh';

  return (
    <TimestampsPickerLayout
      {...rest}
      timestamps={timestamps}
      timestampsList={
        <TimestampsList
          download={{
            loading: download.loading,
            callback: (timestamp) =>
              download.runAsync(id, timestamp, dataType, lang, vibrationFilters)
          }}
          downloadBatch={{
            loading: batchDownload.loading,
            callback: (timestamps) =>
              batchDownload.runAsync(id, dataType, timestamps, lang, vibrationFilters)
          }}
          onClick={setTimestamp}
          timestamp={timestamp}
          timestamps={timestamps}
        />
      }
      timestamp={
        data && (
          <Spin spinning={loading}>
            <Grid>
              <Meta {...{ data, type: props.type }} />
              <Col span={24}>
                {children({
                  data,
                  type,
                  fetchData: (filters) => fetchData(id, timestamp, dataType, filters)
                })}
              </Col>
            </Grid>
          </Spin>
        )
      }
    />
  );
};

const useLayoutProps = ({ id, type }: Props) => {
  const { dataType } = monitoringPointTypeWaveformMap[type];
  const { timestamps, loading, initialRange, fetchData } = useMonitoringPointWaveforms(
    id,
    dataType
  );
  const { numberedRange, setRange } = useRange(initialRange);
  const [from, to] = numberedRange;
  React.useEffect(() => {
    fetchData(id, 'monitoringPoints', [from, to], dataType);
  }, [from, to, fetchData, dataType, id]);
  return {
    dateRangePickerProps: { defaultValue: initialRange, onChange: setRange },
    dataType,
    loading,
    timestamps
  };
};

const useSelectedTimestampProps = (
  params: Props & {
    dataType: DataType;
    timestamps: number[];
  }
) => {
  const { id, dataType, timestamps, vibrationFilters } = params;
  const [timestamp, setTimestamp] = React.useState(timestamps[0]);
  const internalTimestamp = getTimestamp(timestamps, timestamp);
  const { data, loading, runAsync } = useWaveformData();
  React.useEffect(() => {
    if (internalTimestamp) {
      runAsync(id, internalTimestamp, dataType, vibrationFilters);
    }
  }, [internalTimestamp, id, dataType, vibrationFilters, runAsync]);
  return { timestamp: internalTimestamp, setTimestamp, data, loading, fetchData: runAsync };
};

const getTimestamp = (timestamps: number[], timestamp?: number) => {
  if (timestamps.length === 0) {
    return timestamp;
  } else {
    return timestamp && timestamps.includes(timestamp) ? timestamp : timestamps[0];
  }
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
