import * as React from 'react';
import { Col, Empty, Space } from 'antd';
import intl from 'react-intl-universal';
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
  const [from, to] = numberedRange;
  const { id, name } = device;

  React.useEffect(() => {
    GetDeviceRuntimeRequest(id, from, to).then(setRuntimes);
  }, [id, from, to]);

  const renderChart = () => {
    if (runtimes.length === 0) {
      return (
        <Card title={intl.get('SIGNAL_STRENGTH')}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    }
    const xAxisValues = runtimes.map((item) => Dayjs.format(item.timestamp));

    return (
      <Card
        extra={
          <HasPermission value={Permission.DeviceDataDelete}>
            <DeleteIconButton
              confirmProps={{
                description: intl.get('DELETE_DEVICE_DATA_PROMPT', {
                  device: name,
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
          </HasPermission>
        }
        title={intl.get('SIGNAL_STRENGTH')}
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
