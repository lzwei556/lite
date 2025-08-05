import React from 'react';
import { Button, Space as AntSpace, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { DisplayProperty } from '../../../constants/properties';
import { Card } from '../../../components';
import { isMobile } from '../../../utils/deviceDetection';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { HistoryDataFea } from '../..';
import { Dayjs } from '../../../utils';
import {
  DownloadData,
  hasData,
  HistoryData,
  MonitoringPointRow,
  Point,
  PropertyLightSelectFilter
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
  const [open, setVisible] = React.useState(false);

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
            <HasPermission value={Permission.MeasurementDataDownload}>
              <Button
                color='primary'
                icon={<DownloadOutlined />}
                onClick={() => {
                  setVisible(true);
                }}
                variant='filled'
              />
            </HasPermission>
            <HasPermission value={Permission.MeasurementDataDelete}>
              {deleteIconButton}
            </HasPermission>
            {open && (
              <DownloadData
                measurement={point}
                open={open}
                onSuccess={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                range={range}
              />
            )}
          </AntSpace>
        )
      }
      title={name}
    >
      <HistoryDataFea.PropertyChart
        config={{ opts: { dataZoom: [{ start: 0, end: 100 }], yAxis: { name: property?.unit } } }}
        data={historyData}
        property={property!}
        style={{ height: 600 }}
      />
    </Card>
  );
};
