import React from 'react';
import { TimestampsPickerLayout } from '../timestamps-picker-layout/layout';
import { TimestampsList } from '../timestamps-picker-layout/timestamps-list';
import { Spin } from 'antd';
import { useFlangeData, useFlangeDatas } from './use-services';
import { useRange } from 'components';
import { Dayjs } from 'utils';
import { AssetRow, PropertyLightSelectFilter } from 'asset-common';
import { FakeVSRealChart } from './fakeVSRealChart';
import * as MonitoringPoint from 'domains/monitoring-point';

export const FlangeStatus = (props: AssetRow) => {
  const { timestamps, ...rest } = useLayoutProps(props.id);
  const { data, loading, timestamp, setTimestamp } = useSelectedTimestampProps({
    id: props.id,
    timestamps
  });
  const properties =
    props.monitoringPoints && props.monitoringPoints.length > 0
      ? MonitoringPoint.Type.getProperties(props.monitoringPoints[0])
      : [];
  const [property, setProperty] = React.useState(properties.length > 0 ? properties[0] : undefined);
  return (
    <TimestampsPickerLayout
      {...rest}
      timestamps={timestamps}
      timestampsList={
        <TimestampsList onClick={setTimestamp} timestamp={timestamp} timestamps={timestamps} />
      }
      timestamp={
        data && (
          <Spin spinning={loading}>
            <FakeVSRealChart
              asset={props}
              cardProps={{
                extra: (
                  <PropertyLightSelectFilter
                    onChange={(key) =>
                      setProperty(properties.find((property) => property.key === key)!)
                    }
                    properties={properties}
                    value={property?.key}
                  />
                )
              }}
              flangeData={data}
              property={property}
            />
          </Spin>
        )
      }
    />
  );
};

const useLayoutProps = (id: number) => {
  const initialRange = Dayjs.CommonRange.PastWeek;
  const { data = [], loading, runAsync } = useFlangeDatas();
  const { numberedRange, setRange } = useRange(Dayjs.CommonRange.PastWeek);
  const [from, to] = numberedRange;
  React.useEffect(() => {
    runAsync(id, from, to);
  }, [id, from, to, runAsync]);
  return {
    dateRangePickerProps: { defaultValue: initialRange, onChange: setRange },
    loading,
    timestamps: data.map(({ timestamp }) => timestamp)
  };
};

const useSelectedTimestampProps = (params: { id: number; timestamps: number[] }) => {
  const { id, timestamps } = params;
  const [timestamp, setTimestamp] = React.useState(timestamps[0]);
  const internalTimestamp = getTimestamp(timestamps, timestamp);
  const { data, loading, runAsync } = useFlangeData();
  React.useEffect(() => {
    if (internalTimestamp) {
      runAsync(id, internalTimestamp);
    }
  }, [internalTimestamp, id, runAsync]);
  return { timestamp: internalTimestamp, setTimestamp, data, loading };
};

const getTimestamp = (timestamps: number[], timestamp?: number) => {
  if (timestamps.length === 0) {
    return timestamp;
  } else {
    return timestamp && timestamps.includes(timestamp) ? timestamp : timestamps[0];
  }
};
