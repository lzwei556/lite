import { FC, useEffect } from 'react';
import { Select, SelectProps } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { DeviceType } from '../../types/device_type';
import { App, useAppType } from '../../config';
import { Translation } from 'locales/utils';

const { Option, OptGroup } = Select;

export interface DeviceTypeSelectProps extends SelectProps<any> {
  sensors?: DeviceType[];
  onChange?: (value: any) => void;
}

const DeviceTypeSelect: FC<DeviceTypeSelectProps> = (props) => {
  const { sensors, children, onChange } = props;
  const appType = useAppType();

  useEffect(() => {
    if (onChange && sensors) {
      onChange(sensors[0]);
    }
  }, [onChange, sensors]);

  const renderSensors = () => {
    return App.getDeviceTypes(appType).map((item) => (
      <Option key={item} value={item}>
        {Translation.get(DeviceType.toString(item))}
      </Option>
    ));
  };

  const render = () => {
    if (sensors) {
      return (
        <Select {...props} suffixIcon={<CaretDownOutlined />}>
          {children}
          {renderSensors()}
        </Select>
      );
    } else {
      return (
        <Select {...props}>
          {appType !== 'corrosionWirelessHART' && (
            <>
              <OptGroup label={Translation.get('device.gateway')} key={'gateway'}>
                {DeviceType.getGateways().map((t) => (
                  <Option key={t} value={t}>
                    {Translation.get(DeviceType.toString(t))}
                  </Option>
                ))}
              </OptGroup>
              <OptGroup label={Translation.get('device.relay')} key={'router'}>
                {DeviceType.getRouters().map((t) => (
                  <Option key={t} value={t}>
                    {Translation.get(DeviceType.toString(t))}
                  </Option>
                ))}
              </OptGroup>
            </>
          )}
          <OptGroup label={Translation.get('device.sensor')} key={'sensor'}>
            {renderSensors()}
          </OptGroup>
        </Select>
      );
    }
  };
  return render();
};

export default DeviceTypeSelect;
