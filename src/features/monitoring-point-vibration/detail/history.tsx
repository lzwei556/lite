import React from 'react';
import { Col, Space } from 'antd';
import intl from 'react-intl-universal';
import { DisplayProperty } from '../../../constants/properties';
import {
  Card,
  Flex,
  Grid,
  useRange,
  RangeDatePicker,
  DeleteIconButton,
  DownloadIconButton
} from '../../../components';
import { Dayjs } from '../../../utils';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { HistoryDataFea } from '../..';
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
import { appendAxisAliasLabelToField } from '../common';

export const History = (point: MonitoringPointRow) => {
  const { id, name, properties, type, attributes } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const { range, numberedRange, setRange } = useRange();
  const displayProperties = Point.getPropertiesByType(type, properties).map((p) =>
    appendAxisAliasLabelToField(p, attributes)
  );
  const [property, setProperty] = React.useState<DisplayProperty | undefined>(
    displayProperties ? displayProperties[0] : undefined
  );
  const [open, setOpen] = React.useState(false);
  const [from, to] = numberedRange;

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
                <DownloadIconButton
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              </HasPermission>
              <HasPermission value={Permission.MeasurementDataDelete}>
                <DeleteIconButton
                  confirmProps={{
                    description: intl.get('DELETE_PROPERTY_DATA_PROMPT', {
                      property: name,
                      start: Dayjs.format(from, 'YYYY-MM-DD'),
                      end: Dayjs.format(to, 'YYYY-MM-DD')
                    }),
                    onConfirm: () =>
                      clearHistory(id, from, to).then(() => {
                        fetchData(id, numberedRange);
                      })
                  }}
                  buttonProps={{ size: 'middle', variant: 'filled' }}
                />
              </HasPermission>
              {open && (
                <DownloadData
                  measurement={point}
                  open={open}
                  onSuccess={() => setOpen(false)}
                  onCancel={() => setOpen(false)}
                  range={range}
                />
              )}
            </Space>
          )
        }
        title={name}
      >
        {property && (
          <HistoryDataFea.PropertyChart
            config={{
              opts: { dataZoom: [{ start: 0, end: 100 }], yAxis: { name: property.unit } }
            }}
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
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>{renderChart()}</Col>
    </Grid>
  );
};
