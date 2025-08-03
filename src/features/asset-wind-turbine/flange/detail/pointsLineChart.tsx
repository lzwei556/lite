import React from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import { Card } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { HistoryDataFea } from '../../..';
import {
  AssetRow,
  DownloadData,
  hasData,
  HistoryData,
  Point,
  Points,
  PropertyLightSelectFilter
} from '../../../../asset-common';
import { isFlangePreloadCalculation } from '../common';

export const PointsLineChart = ({
  flange,
  historyDatas,
  onlyFirstProperty
}: {
  flange: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
  onlyFirstProperty?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const getProperties = () => {
    const points = Points.filter(flange.monitoringPoints);
    const firstPoint = points[0];
    return Point.getPropertiesByType(firstPoint.type, firstPoint.properties);
  };
  const properties = getProperties();
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(properties?.[0]);
  const getTitle = () => {
    return property
      ? intl.get('OBJECT_TREND_CHART', {
          object: intl.get(property.name)
        })
      : intl.get('TREND_CHART');
  };

  return (
    <Card
      extra={
        !onlyFirstProperty &&
        hasData(historyDatas) && (
          <Space>
            <PropertyLightSelectFilter
              onChange={(key) => setProperty(properties.find((p) => p.key === key))}
              properties={properties}
              value={property?.key}
            />
            {isFlangePreloadCalculation(flange) && (
              <HasPermission value={Permission.AssetDataDownload}>
                <Button
                  color='primary'
                  variant='filled'
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              </HasPermission>
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
      }
      title={getTitle()}
    >
      {property && (
        <HistoryDataFea.PropertyChartList
          data={historyDatas}
          property={property}
          style={{ height: 600 }}
        />
      )}
    </Card>
  );
};
