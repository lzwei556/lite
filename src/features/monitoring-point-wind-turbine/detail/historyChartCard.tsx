import React from 'react';
import { Space as AntSpace, Spin } from 'antd';
import { DisplayProperty } from '../../../constants/properties';
import { Card } from '../../../components';
import { isMobile } from '../../../utils/deviceDetection';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { HistoryDataFea } from '../..';
import { Dayjs } from '../../../utils';
import {
  getSeriesAlarm,
  hasData,
  HistoryData,
  MonitoringPointRow,
  Point,
  PropertyLightSelectFilter,
  useMonitoringPointContext
} from '../../../asset-common';

export const HistoryChartCard = ({
  point,
  loading,
  historyData,
  range,
  deleteIconButton
}: {
  point: MonitoringPointRow;
  loading: boolean;
  historyData?: HistoryData;
  range: Dayjs.RangeValue;
  deleteIconButton: React.ReactElement;
}) => {
  const { name, properties, type } = point;
  const displayProperties = Point.getPropertiesByType(type, properties);
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(
    displayProperties ? displayProperties[0] : undefined
  );
  const { ruleGroups } = useMonitoringPointContext();
  if (loading) {
    return <Spin />;
  }

  return (
    <Card
      extra={
        hasData(historyData) &&
        property && (
          <AntSpace direction={isMobile ? 'vertical' : 'horizontal'}>
            <PropertyLightSelectFilter
              onChange={(value: string) => {
                setProperty(displayProperties.find((item: any) => item.key === value));
              }}
              properties={displayProperties}
              value={property.key}
            />
            <HasPermission value={Permission.MeasurementDataDelete}>
              {deleteIconButton}
            </HasPermission>
          </AntSpace>
        )
      }
      title={name}
    >
      <HistoryDataFea.PropertyChart
        alarm={getSeriesAlarm(ruleGroups, property!)}
        config={{ opts: { dataZoom: [{ start: 0, end: 100 }], yAxis: { name: property?.unit } } }}
        data={historyData}
        property={property!}
        style={{ height: 600 }}
      />
    </Card>
  );
};
