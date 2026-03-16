import { Progress, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { DeviceUpgradeStatus } from '../types/device_upgrade_status';
import { Translation } from 'locales/utils';

export const DeviceUpgradeSpin = ({ status }: { status: any }) => {
  const style = { fontSize: 12, fontWeight: 400 };
  const render = () => {
    const DOWNLOAD_COMPLETE_TEXT = Translation.get('firmware.upgrade.downloaded');
    switch (status.code) {
      case DeviceUpgradeStatus.Pending:
        return (
          <>
            <Spin size={'small'} indicator={<LoadingOutlined />} spinning={true} />
            <Typography.Text style={style} type='secondary'>
              {Translation.get('firmware.upgrade.connecting')}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Loading:
        const progressValue = status.progress.toFixed(0);
        const progressText =
          Number(progressValue) === 100
            ? DOWNLOAD_COMPLETE_TEXT
            : Translation.get('firmware.upgrade.downloading', { progress: progressValue });
        return (
          <>
            <Progress
              type='circle'
              showInfo={false}
              percent={status.progress}
              strokeWidth={12}
              width={16}
            />
            <Typography.Text style={style} type='secondary'>
              {progressText}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Upgrading:
        return (
          <>
            <Progress
              type='circle'
              showInfo={false}
              percent={status.progress}
              strokeWidth={12}
              width={16}
            />
            <Typography.Text style={style} type='secondary'>
              {Translation.get('firmware.upgrade.in-progress', { progress: status.progress.toFixed(0) })}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Cancelled:
        return (
          <>
            <Progress
              type='circle'
              showInfo={false}
              percent={status.progress}
              strokeWidth={12}
              width={16}
            />
            <Typography.Text style={style} type='warning'>
              {Translation.get('firmware.upgrade.cancelled')}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Error:
        return (
          <>
            <Progress
              type='circle'
              showInfo={false}
              percent={status.progress}
              strokeWidth={12}
              width={16}
              status={'exception'}
            />
            <Typography.Text style={style} type='danger'>
              {Translation.failureDo('common.action.upgrade')}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Success:
        return (
          <>
            <Progress type='circle' percent={status.progress} strokeWidth={12} width={16} />
            <Typography.Text style={style} type='success'>
              {Translation.get('feedback.success.upgrade')}
            </Typography.Text>
          </>
        );
    }
    return <></>;
  };

  return <Space>{render()}</Space>;
};
