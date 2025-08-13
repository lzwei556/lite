import React from 'react';
import intl from 'react-intl-universal';
import { Button, Col } from 'antd';
import { Device } from '../../../types/device';
import { useLocaleContext } from '../../../localeProvider';
import {
  Descriptions,
  EditIconButton,
  Grid,
  MutedCard,
  RangeDatePicker,
  Table,
  TitleExtraLayout
} from '../../../components';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { DeviceNavigator } from '../navigator';
import { BasisModalForm } from '../edit/basisModalForm';
import { useEvents, useEventTableProps } from '../event/use-hooks';
import { useBasisFields } from './sensorDetail';
import { DeviceStatus } from '../device-status';

import { HeadRight } from './head';

export const RouterDetail = ({ device, onSuccess }: { device: Device; onSuccess: () => void }) => {
  const basisFields = useBasisFields(device);
  const { fetchDeviceEvents, range, onChange, dataSource } = useEvents(device);
  const { tablePorps, header } = useEventTableProps({
    device,
    dataSource,
    fetch: fetchDeviceEvents
  });
  const { language } = useLocaleContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={<DeviceNavigator device={device} />}
          extra={<HeadRight device={device} />}
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>
        <Grid wrap={false}>
          <Col flex='auto'>
            <MutedCard
              extra={<RangeDatePicker onChange={onChange} value={range} />}
              title={intl.get('EVENTS')}
            >
              <Table
                {...tablePorps}
                header={{
                  toolbar: dataSource && dataSource.total > 0 && (
                    <HasPermission value={Permission.DeviceEventDelete}>
                      <Button {...header.toolbar.deleteProps} />
                    </HasPermission>
                  )
                }}
              />
            </MutedCard>
          </Col>
          <Col flex='300px'>
            <Grid>
              <DeviceStatus device={device} />
              <Col span={24}>
                <MutedCard
                  extra={
                    <EditIconButton
                      color='primary'
                      onClick={() => setOpen(true)}
                      size='small'
                      variant='text'
                    />
                  }
                  title={intl.get('BASIC_INFORMATION')}
                >
                  <Descriptions
                    column={1}
                    contentStyle={{
                      justifyContent: language === 'en-US' ? 'flex-start' : 'flex-end'
                    }}
                    items={basisFields}
                    layout={language === 'en-US' ? 'vertical' : 'horizontal'}
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
                </MutedCard>
              </Col>
            </Grid>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};
