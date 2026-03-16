import * as React from 'react';
import { Col, Empty, Space } from 'antd';
import { Translation } from 'locales/utils';
import { Dayjs } from '../../utils';
import { GetDeviceRuntimeRequest, RemoveDeviceRuntimeRequest } from '../../apis/device';
import {
  Card,
  Flex,
  Grid,
  LineChart,
  useRange,
  RangeDatePicker,
  DeleteIconButton
} from '../../components';
import { Device } from '../../types/device';
import { CanAccess, Permission } from '../../providers/access-control';

export const RuntimeChart: React.FC<{ device: Device }> = ({ device }) => {
  const [runtimes, setRuntimes] = React.useState<
    {
      batteryVoltage: number;
      signalStrength: number;
      timestamp: number;
    }[]
  >([]);
  const { numberedRange, setRange } = useRange();
  const [from, to] = numberedRange;
  const { id } = device;

  React.useEffect(() => {
    GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
  }, [id, from, to]);

  const renderChart = () => {
    if (runtimes.length === 0) {
      return (
        <Card title={Translation.get('device.status.signal.level')}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    }
    const xAxisValues = runtimes.map((item) => Dayjs.format(item.timestamp));

    return (
      <Card
        extra={
          <CanAccess {...Permission.DeviceDataDelete}>
            <DeleteIconButton
              confirmProps={{
                description: Translation.get('feature.history.delete.prompt', {
                  start: Dayjs.format(from, 'YYYY-MM-DD'),
                  end: Dayjs.format(to, 'YYYY-MM-DD')
                }),
                onConfirm: () => {
                  RemoveDeviceRuntimeRequest(id, from, to, true);
                  GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
                }
              }}
              buttonProps={{ size: 'middle', variant: 'filled' }}
            />
          </CanAccess>
        }
        title={Translation.get('device.status.signal.level')}
      >
        <LineChart
          series={[
            {
              data: {
                [Translation.get('device.status.signal.level')]: runtimes.map(
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
