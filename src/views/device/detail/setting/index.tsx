import { Button, Col, Form, Radio } from 'antd';
import { Device } from '../../../../types/device';
import * as React from 'react';
import DeviceSettings from './deviceSettings';
import { DeviceType } from '../../../../types/device_type';
import { BasicSettings } from './basicSettings';
import intl from 'react-intl-universal';
import { WsnFormItem } from '../../add/wsnFormItem';
import { generateColProps } from '../../../../utils/grid';
import { Network } from '../../../../types/network';
import { UpdateNetworkRequest } from '../../../../apis/network';
import { Flex, Grid } from '../../../../components';
import { DevicesTable } from './table/devicesTable';

export interface SettingPageProps {
  device: Device;
  onUpdate: () => void;
  network?: Network;
}

const SettingPage: React.FC<SettingPageProps> = ({ device, onUpdate, network }) => {
  const [form] = Form.useForm();
  const [type, setType] = React.useState('basic');
  const options = [];
  const { typeId } = device;
  if (DeviceType.hasDeviceSettings(typeId)) {
    options.push(
      { label: intl.get('BASIC_INFORMATION'), value: 'basic' },
      { label: intl.get('DEVICE_SETTINGS'), value: 'device' }
    );
    if (typeId === DeviceType.Gateway && network) {
      options.push({ label: intl.get('wireless.network.settings'), value: 'wsn' });
      options.push({ label: intl.get('MENU_DEVICE_LSIT'), value: 'list' });
    }
  }
  if (options.length === 0) {
    return (
      <Grid>
        <Col {...generateColProps({ md: 24, lg: 24, xl: 16, xxl: 12 })}>
          <BasicSettings device={device} onUpdate={onUpdate} />
        </Col>
      </Grid>
    );
  } else {
    return (
      <Grid>
        <Col span={24}>
          <Radio.Group
            options={options}
            onChange={(e) => setType(e.target.value)}
            value={type}
            optionType='button'
            buttonStyle='solid'
          />
        </Col>
        {type !== 'list' && (
          <Col {...generateColProps({ md: 24, lg: 24, xl: 16, xxl: 12 })}>
            {type === 'basic' && (
              <BasicSettings device={device} onUpdate={onUpdate} key={device.id} />
            )}
            {type === 'device' && <DeviceSettings device={device} />}
            {type === 'wsn' && network && (
              <Form
                form={form}
                labelCol={{ lg: 12, xl: 10, xxl: 9 }}
                initialValues={{
                  mode: network.mode,
                  wsn: {
                    communication_period: network.communicationPeriod,
                    communication_period_2: network.communicationPeriod2,
                    communication_offset: network.communicationOffset,
                    group_size: network.groupSize,
                    group_size_2: network.groupSize2,
                    interval_cnt: network.intervalCnt
                  }
                }}
              >
                <WsnFormItem />
                <Form.Item>
                  <Flex>
                    <Button
                      type='primary'
                      onClick={() => {
                        form.validateFields().then((values) => {
                          UpdateNetworkRequest(network.id, { ...values, name: network.name }).then(
                            () => {
                              onUpdate();
                            }
                          );
                        });
                      }}
                    >
                      {intl.get('SAVE')}
                    </Button>
                  </Flex>
                </Form.Item>
              </Form>
            )}
          </Col>
        )}
        {type === 'list' && network && (
          <Col span={24}>
            <DevicesTable device={network.gateway} onUpdate={onUpdate} key={device.id} />
          </Col>
        )}
      </Grid>
    );
  }
};

export default SettingPage;
