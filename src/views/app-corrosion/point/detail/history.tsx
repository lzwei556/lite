import React from 'react';
import { Button, Col, Modal, Space as AntSpace } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, useRange, RangeDatePicker } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { isMobile } from '../../../../utils/deviceDetection';
import { Dayjs } from '../../../../utils';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import { HistoryDataFea } from '../../../../features';
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

export const History = (point: MonitoringPointRow) => {
  const { id, name, properties, type } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const { range, numberedRange, setRange } = useRange();
  const displayProperties = Point.getPropertiesByType(properties, type);
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(
    displayProperties ? displayProperties[0] : undefined
  );
  const [open, setVisible] = React.useState(false);

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
    if (numberedRange) fetchData(id, numberedRange);
  }, [id, numberedRange]);

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
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
                  <Button
                    color='danger'
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      if (numberedRange) {
                        const [from, to] = numberedRange;
                        Modal.confirm({
                          title: intl.get('PROMPT'),
                          content: intl.get('DELETE_PROPERTY_DATA_PROMPT', {
                            property: point.name,
                            start: Dayjs.format(from, 'YYYY-MM-DD'),
                            end: Dayjs.format(to, 'YYYY-MM-DD')
                          }),
                          okText: intl.get('OK'),
                          cancelText: intl.get('CANCEL'),
                          onOk: (close) => {
                            clearHistory(id, from, to).then((_) => {
                              close();
                              if (numberedRange) fetchData(id, numberedRange);
                            });
                          }
                        });
                      }
                    }}
                    variant='filled'
                  />
                </HasPermission>
              </AntSpace>
            )
          }
          title={name}
        >
          {property && (
            <HistoryDataFea.PropertyChart
              config={{ opts: { yAxis: { name: property.unit } } }}
              data={historyData}
              property={property}
              loading={loading}
              key={property.key}
              style={{ height: 600 }}
            />
          )}
          {open && (
            <DownloadData
              measurement={point}
              open={open}
              onSuccess={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              range={range}
            />
          )}
        </Card>
      </Col>
    </Grid>
  );
};
