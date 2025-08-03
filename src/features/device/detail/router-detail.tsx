import React from 'react';
import intl from 'react-intl-universal';
import { Button, Col } from 'antd';
import { Device } from '../../../types/device';
import {
  Card,
  Descriptions,
  Flex,
  Grid,
  MetaCard,
  RangeDatePicker,
  Table
} from '../../../components';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { useEvents, useEventTableProps } from '../event/use-hooks';
import { useBasisFields } from './sensorDetail';
import { HeadLeft, HeadRight } from './head';
import { EditOutlined } from '@ant-design/icons';
import { BasisModalForm } from '../edit/basisModalForm';

export const RouterDetail = ({ device, onSuccess }: { device: Device; onSuccess: () => void }) => {
  const basisFields = useBasisFields(device);
  const { fetchDeviceEvents, range, onChange, dataSource } = useEvents(device);
  const { tablePorps, header } = useEventTableProps({
    device,
    dataSource,
    fetch: fetchDeviceEvents
  });
  const [open, setOpen] = React.useState(false);
  return (
    <Card
      size='small'
      styles={{ body: { padding: 0, backgroundColor: 'var(--body-bg-color)' } }}
      title={<HeadLeft device={device} />}
      extra={<HeadRight device={device} />}
    >
      <Grid>
        <Col span={24}>
          <MetaCard
            description={
              <Descriptions
                column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3 }}
                contentStyle={{ justifyContent: 'flex-start' }}
                items={basisFields}
              />
            }
            title={
              <Flex justify='space-between'>
                {intl.get('BASIC_INFORMATION')}
                <Button icon={<EditOutlined />} onClick={() => setOpen(true)} />
              </Flex>
            }
          />
          <BasisModalForm
            device={device}
            open={open}
            onCancel={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              onSuccess();
            }}
          />
        </Col>
        <Col span={24}>
          <MetaCard
            description={
              <Table
                {...tablePorps}
                header={{
                  toolbar: [
                    dataSource && dataSource.total > 0 && (
                      <HasPermission value={Permission.DeviceEventDelete}>
                        <Button {...header.toolbar.deleteProps} />
                      </HasPermission>
                    )
                  ]
                }}
              />
            }
            title={
              <Flex justify='space-between'>
                {intl.get('EVENTS')}
                <RangeDatePicker onChange={onChange} value={range} />
              </Flex>
            }
          />
        </Col>
      </Grid>
    </Card>
  );
};
