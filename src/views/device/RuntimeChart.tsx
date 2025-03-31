import * as React from 'react';
import { Button, Col, Empty, Modal, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Dayjs } from '../../utils';
import { GetDeviceRuntimeRequest, RemoveDeviceRuntimeRequest } from '../../apis/device';
import { Card, Flex, Grid, LineChart, useRange, RangeDatePicker } from '../../components';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { Device } from '../../types/device';

export const RuntimeChart: React.FC<{ device: Device }> = ({ device }) => {
  const [runtimes, setRuntimes] = React.useState<
    {
      batteryVoltage: number;
      signalStrength: number;
      timestamp: number;
    }[]
  >([]);
  const { numberedRange, setRange } = useRange();
  const { id, name } = device;

  React.useEffect(() => {
    const [from, to] = numberedRange;
    GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
  }, [id, numberedRange]);

  const onRemoveDeviceData = () => {
    if (numberedRange) {
      const [from, to] = numberedRange;
      Modal.confirm({
        title: intl.get('PROMPT'),
        content: intl.get('DELETE_DEVICE_DATA_PROMPT', {
          device: name,
          start: Dayjs.format(from, 'YYYY-MM-DD'),
          end: Dayjs.format(to, 'YYYY-MM-DD')
        }),
        okText: intl.get('OK'),
        cancelText: intl.get('CANCEL'),
        onOk: (close) => {
          RemoveDeviceRuntimeRequest(id, from, to, true).then(close);
          GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
        }
      });
    }
  };

  const renderChart = () => {
    if (runtimes.length === 0) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    }
    const xAxisValues = runtimes.map((item) => Dayjs.format(item.timestamp));

    return (
      <Card
        extra={
          <HasPermission value={Permission.DeviceDataDelete}>
            <Button
              color='danger'
              icon={<DeleteOutlined />}
              onClick={onRemoveDeviceData}
              variant='filled'
            />
          </HasPermission>
        }
      >
        <LineChart
          series={[
            {
              data: {
                [intl.formatMessage({ id: 'SIGNAL_STRENGTH' })]: runtimes.map(
                  (item) => item.signalStrength
                )
              },
              xAxisValues
            }
          ]}
          style={{ height: 650 }}
          yAxisMeta={{ unit: 'dBm', precision: 0 }}
        />
      </Card>
    );
  };

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <Space>
              <RangeDatePicker onChange={setRange} />
            </Space>
          </Flex>
        </Card>
      </Col>
      <Col span={24}>{renderChart()}</Col>
    </Grid>
  );
};
