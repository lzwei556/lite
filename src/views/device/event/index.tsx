import React from 'react';
import { Col, Button } from 'antd';
import { Card, Flex, Grid, Table, RangeDatePicker } from '../../../components';
import { Device } from '../../../types/device';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { useEvents, useEventTableProps } from './use-hooks';

export const QueryEventTable = ({ device }: { device: Device }) => {
  const { fetchDeviceEvents, setRange, dataSource } = useEvents(device);
  const { tablePorps, header } = useEventTableProps({
    device,
    dataSource,
    fetch: fetchDeviceEvents
  });
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
      </Col>
    </Grid>
  );
};
