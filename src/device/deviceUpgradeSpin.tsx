import { Progress, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { DeviceUpgradeStatus } from '../types/device_upgrade_status';

export const DeviceUpgradeSpin = ({ status }: { status: any }) => {
  const style = { fontSize: 12, fontWeight: 400 };
  const render = () => {
    const DOWNLOAD_COMPLETE_TEXT = intl.get('FIRMWARE_DOWNLOADING_FINISHED_PROMPT');
    switch (status.code) {
      case DeviceUpgradeStatus.Pending:
        return (
          <>
            <Spin size={'small'} indicator={<LoadingOutlined />} spinning={true} />
            <Typography.Text style={style} type='secondary'>
              {intl.get('CONNECTING')}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Loading:
        const progressValue = status.progress.toFixed(0);
        const progressText =
          Number(progressValue) === 100
            ? DOWNLOAD_COMPLETE_TEXT
            : intl.get('FIRMWARE_DOWNLOADING_WITH_PROGRESS', { progress: progressValue });
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
              {intl.get('UPGRADING_WITH_PROGRESS', { progress: status.progress.toFixed(0) })}
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
              {intl.get('UPGRADING_IS_CANCELLED')}
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
              {intl.get('FAILED_TO_UPGRADE_FIRMWARE')}
            </Typography.Text>
          </>
        );
      case DeviceUpgradeStatus.Success:
        return (
          <>
            <Progress type='circle' percent={status.progress} strokeWidth={12} width={16} />
            <Typography.Text style={style} type='success'>
              {intl.get('UPGRADE_FIRMWARE_SUCCESSFUL')}
            </Typography.Text>
          </>
        );
    }
    return <></>;
  };

  return <Space>{render()}</Space>;
};
