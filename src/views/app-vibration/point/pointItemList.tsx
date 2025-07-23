import React from 'react';
import { Button, Col, Form, Input, Popover } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Grid } from '../../../components';
import { Device } from '../../../types/device';
import { FormInputItem } from '../../../components/formInputItem';
import { isMobile } from '../../../utils/deviceDetection';
import { generateColProps } from '../../../utils/grid';
import { GetDevicesRequest } from '../../../apis/device';
import { DeviceSelection, MonitoringPointInfo } from '../../asset-common';
import { relatedDeviceTypes } from './common';
import { Others } from './others';

export const PointItemList = ({
  onSelect,
  onRemove,
  initialSelected,
  type
}: {
  onSelect: (points: MonitoringPointInfo[]) => void;
  onRemove: (index: number) => void;
  initialSelected: MonitoringPointInfo[];
  type: number;
}) => {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [open, setVisible] = React.useState(false);

  React.useEffect(() => {
    const deviceTypes = relatedDeviceTypes.get(type);
    if (deviceTypes) GetDevicesRequest({ types: deviceTypes.join(',') }).then(setDevices);
  }, [type]);

  return (
    <Form.List
      name='monitoring_points'
      rules={[
        {
          validator: async (_, points) => {
            if (!points || points.length <= 0) {
              return Promise.reject(new Error(intl.get('PLEASE_CREATE_MONITORING_POINT')));
            }
          }
        }
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restFields }, index) => (
            <div
              style={{
                position: 'relative',
                border: 'dashed 1px #d9d9d9',
                paddingTop: 16,
                marginBottom: 16
              }}
            >
              <MinusCircleOutlined
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => {
                  remove(name);
                  onRemove(index);
                }}
              />
              <Grid>
                <Col {...generateColProps({ xl: 12, xxl: 12 })}>
                  <FormInputItem
                    {...restFields}
                    label={intl.get('NAME')}
                    name={[name, 'name']}
                    requiredMessage={intl.get('PLEASE_ENTER_NAME')}
                    lengthLimit={{ min: 4, max: 50, label: intl.get('NAME').toLowerCase() }}
                    style={{ display: 'inline-block', width: 200, marginRight: 20 }}
                  >
                    <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
                  </FormInputItem>
                </Col>
                <Others
                  formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
                  nameIndex={name}
                  restFields={restFields}
                />
              </Grid>
            </div>
          ))}
          <Form.Item>
            <Popover
              title={intl.get('SELECT_SENSOR')}
              content={
                open && (
                  <DeviceSelection
                    devices={devices}
                    onSelect={(selecteds) => {
                      setVisible(false);
                      onSelect(selecteds);
                    }}
                    initialSelected={initialSelected}
                  />
                )
              }
              trigger={['click']}
              placement={isMobile ? 'top' : 'rightTop'}
              open={open}
              onOpenChange={(open) => setVisible(open)}
              overlayStyle={{ width: 400 }}
            >
              <Button disabled={devices.length === 0}>{intl.get('SELECT_SENSOR')}</Button>
              <Form.ErrorList errors={errors} />
            </Popover>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
