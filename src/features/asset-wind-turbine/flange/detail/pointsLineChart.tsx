import React from 'react';
import { Space } from 'antd';
import { Translation } from 'locales/utils';
import { ChartMark, DownloadIconButton, SeriesOption } from '../../../../components';
import {
  AssetRow,
  DownloadData,
  hasData,
  HistoryData,
  Points,
  PropertyLightSelectFilter
} from '../../../../asset-common';
import { isFlangePreloadCalculation } from '../common';
import { CanAccess, Permission } from '../../../../providers/access-control';
import { CharacteristicData, MonitoringPointType } from 'common';
import { Dayjs } from 'utils';
import { transform } from 'features/historyData';

type Data = { name: string; data: HistoryData }[] | undefined;

export const PointsLineChart = ({
  flange,
  historyDatas,
  handleClick
}: {
  flange: AssetRow;
  historyDatas: Data;
  handleClick?: (timestamp: number) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { marks, dispatchMarks } = ChartMark.useContext();
  const getProperties = () => {
    const points = Points.filter(flange.monitoringPoints);
    const firstPoint = points[0];
    return MonitoringPointType.Key.getProperties(firstPoint.type, firstPoint.properties);
  };
  const properties = getProperties();
  const [property, setProperty] = React.useState<CharacteristicData.DisplayProperty | undefined>(
    properties?.[0]
  );
  const getTitle = () => {
    return property
      ? Translation.get('label.title.trend.sth', {
          object: Translation.get(property.name)
        })
      : Translation.get('label.title.trend');
  };
  const { series, xAxis } = getOptions(historyDatas, property);
  const chartProps = ChartMark.useAxisMarkLineStyleProps();

  return (
    <ChartMark.Chart
      cardProps={{ title: getTitle() }}
      config={{ opts: { xAxis } }}
      onEvents={{
        click: (coord: [string, number]) => {
          const timestamp = Dayjs.toTimestamp(Dayjs.dayjs(coord[0]));
          const data = Dayjs.format(timestamp);
          dispatchMarks({
            type: 'append_single',
            mark: { name: data, data, chartProps, type: 'Peak' }
          });
          handleClick?.(timestamp);
        }
      }}
      series={ChartMark.useMergeMarkDatas({
        series,
        marks,
        lineStyle: { symbol: 'none' }
      })}
      toolbars={[
        hasData(historyDatas) && (
          <Space>
            <PropertyLightSelectFilter
              onChange={(key) => setProperty(properties.find((p) => p.key === key))}
              properties={properties}
              value={property?.key}
            />
            {isFlangePreloadCalculation(flange) && (
              <CanAccess {...Permission.AssetDataDownload}>
                <DownloadIconButton
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              </CanAccess>
            )}
            {open && flange.monitoringPoints && (
              <DownloadData
                measurement={flange.monitoringPoints[0]}
                open={open}
                onSuccess={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                assetId={flange.id}
              />
            )}
          </Space>
        )
      ]}
      style={{ height: 600 }}
    />
  );
};

const getOptions = (data: Data, property?: CharacteristicData.DisplayProperty) => {
  const series: SeriesOption[] = [];
  const xAxisValues: number[] = [];
  if (hasData(data) && property) {
    data!.forEach(({ name, data }) => {
      xAxisValues.push(...data.map(({ timestamp }) => timestamp));
      const transformed = transform(
        data,
        { ...property, onlyShowFirstField: true },
        { replace: name }
      );
      if (transformed?.series) {
        series.push(...transformed.series);
      }
    });
  }
  return {
    series,
    xAxis: {
      data: Array.from(new Set(xAxisValues))
        .sort((prev, crt) => prev - crt)
        .map((t) => Dayjs.format(t))
    }
  };
};
