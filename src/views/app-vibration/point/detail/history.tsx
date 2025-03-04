import React from 'react';
import { Button, Col, Modal, Space } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { DisplayProperty } from '../../../../constants/properties';
import { Card, Flex, Grid } from '../../../../components';
import { oneWeekNumberRange, RangeDatePicker } from '../../../../components/rangeDatePicker';
import dayjs from '../../../../utils/dayjsUtils';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import {
  clearHistory,
  DownloadData,
  getDataOfMonitoringPoint,
  hasData,
  HistoryData,
  MonitoringPointRow,
  Point,
  PropertyLightSelectFilter
} from '../../../asset-common';
import { PropertyChart } from '../../../historyData';

export const History = (point: MonitoringPointRow) => {
  const { id, name, properties, type } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const displayProperties = Point.getPropertiesByType(properties, type);
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(
    displayProperties ? displayProperties[0] : undefined
  );
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
    if (range) fetchData(id, range);
  }, [id, range]);

  const renderChart = () => {
    return (
      <Card
        extra={
          hasData(historyData) && (
            <Space>
              <PropertyLightSelectFilter
                onChange={(value: string) => {
                  setProperty(displayProperties.find((item: any) => item.key === value));
                }}
                properties={displayProperties}
                value={property!.key}
              />
              <HasPermission value={Permission.MeasurementDataDownload}>
                <Button
                  color='primary'
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    setOpen(true);
                  }}
                  variant='filled'
                />
              </HasPermission>
              <HasPermission value={Permission.MeasurementDataDelete}>
                <Button
                  color='danger'
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    if (range) {
                      const [from, to] = range;
                      Modal.confirm({
                        title: intl.get('PROMPT'),
                        content: intl.get('DELETE_PROPERTY_DATA_PROMPT', {
                          property: name,
                          start: dayjs.unix(from).local().format('YYYY-MM-DD'),
                          end: dayjs.unix(to).local().format('YYYY-MM-DD')
                        }),
                        okText: intl.get('OK'),
                        cancelText: intl.get('CANCEL'),
                        onOk: (close) => {
                          clearHistory(id, from, to).then((_) => {
                            close();
                            if (range) fetchData(id, range);
                          });
                        }
                      });
                    }
                  }}
                  variant='filled'
                />
              </HasPermission>
              {open && (
                <DownloadData
                  measurement={point}
                  open={open}
                  onSuccess={() => setOpen(false)}
                  onCancel={() => setOpen(false)}
                />
              )}
            </Space>
          )
        }
        title={name}
      >
        {property && (
          <PropertyChart
            config={{ opts: { yAxis: { name: property.unit } } }}
            data={historyData}
            property={property}
            loading={loading}
            style={{ height: 650 }}
          />
        )}
      </Card>
    );
  };

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} showFooter={true} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>{renderChart()}</Col>
    </Grid>
  );
};
