import React from 'react';
import { Button, Col, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { Card, commonRange, Grid } from '../../../../components';
import { Dayjs } from '../../../../utils';
import { getValue, roundValue, truncate } from '../../../../utils/format';
import { DisplayProperty } from '../../../../constants/properties';
import { HistoryDataFea } from '../../../../features';
import {
  AssetRow,
  AXIS_ALIAS,
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import { MonitoringPointsStatistics } from './monitoringPointsStatistics';
import { DianJiImage } from './dianJiImage';
import { appendAxisAliasLabelToField } from '../../point/common';
import { EyeOutlined } from '@ant-design/icons';
import { ModalWrapper } from '../../../../components/modalWrapper';

export type MonitoringPointPropertyItem = MonitoringPointRow &
  PropertyItem & { property: DisplayProperty };
type PropertyItem = {
  label: React.ReactNode;
  title?: string;
  children: string;
  key: string;
  axisKey?: string;
};

export const Index = (props: { asset: AssetRow }) => {
  const { asset } = props;
  const getProperties = () => {
    let properties: DisplayProperty[] = [];
    if (asset.monitoringPoints && asset.monitoringPoints.length > 0) {
      const first = asset.monitoringPoints[0];
      properties = Point.getPropertiesByType(first.properties, first.type);
    }
    return properties;
  };
  const properties = getProperties();
  const firstPoint = asset.monitoringPoints?.[0];
  const getDefaultSelected = () => {
    if (firstPoint && properties.length > 0) {
      return {
        ...firstPoint,
        ...getPropertyValues(firstPoint, properties)[0],
        property: properties[0]
      };
    }
    return undefined;
  };

  const [selected, setSelected] = React.useState<MonitoringPointPropertyItem | undefined>(
    getDefaultSelected()
  );
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [open, setOpen] = React.useState(false);

  const fetchData = (id: number, range: [number, number]) => {
    if (range) {
      const [from, to] = range;
      setLoading(true);
      getDataOfMonitoringPoint(id, from, to).then((data) => {
        setLoading(false);
        if (data.length > 0) {
          setHistoryData(data);
        } else {
          setHistoryData(undefined);
        }
      });
    }
  };

  React.useEffect(() => {
    if (firstPoint?.id && !historyData) {
      fetchData(firstPoint.id, Dayjs.toRange(commonRange.PastWeek));
    }
  }, [firstPoint?.id, historyData]);

  return (
    <Grid>
      <Col span={24}>
        <Grid wrap={false}>
          <Col flex='auto' style={{ minWidth: 560 }}>
            <DianJiImage
              asset={asset}
              key={`${asset.id}_${asset.monitoringPoints?.length}`}
              properties={properties}
              onSelectMonitoringPointProperty={(item) => {
                if (item) {
                  setSelected(item);
                  if (!selected || selected.id !== item.id) {
                    fetchData(item.id, Dayjs.toRange(commonRange.PastWeek));
                  }
                }
              }}
              viewIcon={
                <React.Fragment key='view'>
                  <Tooltip title={intl.get('CLICK_TO_VIEW')}>
                    <Button
                      icon={<EyeOutlined />}
                      variant='outlined'
                      onClick={() => setOpen(true)}
                    />
                  </Tooltip>
                  <ModalWrapper
                    open={open}
                    onCancel={() => setOpen(false)}
                    title={intl.get('BASIC_INFORMATION')}
                    footer={null}
                  >
                    <Card>
                      <SettingsDetail settings={asset.attributes} type={asset.type} />
                    </Card>
                  </ModalWrapper>
                </React.Fragment>
              }
            />
          </Col>
          <Col flex='350px'>
            <Grid>
              <Col span={24}>
                <MonitoringPointsStatistics {...props} />
              </Col>
              <Col span={24}>
                <AlarmTrend
                  id={asset.id}
                  title={intl.get('ALARM_TREND')}
                  chartStyle={{ height: 265 }}
                />
              </Col>
            </Grid>
          </Col>
        </Grid>
      </Col>
      {selected && (
        <Col span={24}>
          <Card title={`${selected.name} ${selected.title}`} size='small'>
            <HistoryDataFea.PropertyChart
              config={{
                opts: {
                  yAxis: { name: selected.property.unit },
                  grid: { top: 30 }
                },
                switchs: { noDataZoom: true }
              }}
              data={historyData}
              property={appendAxisAliasLabelToField(selected.property, selected.attributes)}
              axisKey={selected.axisKey}
              loading={loading}
              style={{ height: 140 }}
            />
          </Card>
        </Col>
      )}
    </Grid>
  );
};

export function getPropertyValues(m: MonitoringPointRow, properties: DisplayProperty[]) {
  const items: PropertyItem[] = [];
  properties.forEach(({ fields = [], key, name, precision, unit }) => {
    if (fields.length > 1) {
      items.push(
        ...Object.values(AXIS_ALIAS).map(({ key: aliasKey, label }) => {
          const attrs = m.attributes;
          const axisKey = attrs?.[aliasKey];
          const title = `${intl.get(name)} ${intl.get(label)}`;
          return {
            label: truncate(title, 24),
            title,
            children: `${getValue(
              roundValue(m?.data?.values[`${key}_${axisKey}`] as number, precision)
            )}${unit}`,
            axisKey,
            key
          };
        })
      );
    } else {
      items.push({
        label: truncate(intl.get(name), 24),
        title: intl.get(name),
        children: `${getValue(roundValue(m?.data?.values[key] as number, precision))}${unit}`,
        axisKey: undefined,
        key
      });
    }
  });
  return items;
}
