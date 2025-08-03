import { SettingsDetail as MotorSettingsDetail } from './motor/settingsDetail';
import { motor } from './constants';

export const SettingsDetail = ({ settings, type }: { settings: any; type: number }) => {
  let ele = null;
  switch (type) {
    case motor.type:
      ele = <MotorSettingsDetail settings={settings} />;
      break;
    default:
      break;
  }
  return ele;
};
