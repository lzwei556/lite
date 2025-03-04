import * as React from 'react';
import { Button, Col, Empty, Modal, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import dayjs from '../../utils/dayjsUtils';
import { GetDeviceRuntimeRequest, RemoveDeviceRuntimeRequest } from '../../apis/device';
import { Card, Flex, Grid, LineChart } from '../../components';
import { oneWeekNumberRange, RangeDatePicker } from '../../components/rangeDatePicker';
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
  const [range, setRange] = React.useState<[number, number]>(oneWeekNumberRange);
  const { id, name } = device;

  React.useEffect(() => {
    const [from, to] = range;
    GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
  }, [id, range]);

  const onRemoveDeviceData = () => {
    if (range) {
      const [from, to] = range;
      Modal.confirm({
        title: intl.get('PROMPT'),
        content: intl.get('DELETE_DEVICE_DATA_PROMPT', {
          device: name,
          start: dayjs.unix(from).local().format('YYYY-MM-DD'),
          end: dayjs.unix(to).local().format('YYYY-MM-DD')
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
    const xAxisValues = runtimes.map((item) =>
      dayjs.unix(item.timestamp).local().format('YYYY-MM-DD HH:mm:ss')
    );

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
              <RangeDatePicker onChange={setRange} showFooter={true} />
            </Space>
          </Flex>
        </Card>
      </Col>
      <Col span={24}>{renderChart()}</Col>
    </Grid>
  );
};
