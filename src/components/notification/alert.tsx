import { useEffect, useState } from 'react';
import { notification, Space } from 'antd';
import useSocket, { SocketTopic } from '../../socket';
import { translateMetricName } from '../../features/alarm/alarm-group';
import { useSelectedProject } from '../../providers/user-profile';
import { Translation } from 'locales/utils';
import { getLabelByValue } from 'features/alarm';

const AlertMessageNotification = () => {
  const { PubSub } = useSocket();
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState();
  const selectedProject = useSelectedProject();

  useEffect(() => {
    PubSub.subscribe(SocketTopic.monitoringPointAlert, (msg: string, data: any) => {
      console.log(data);
      if (
        data &&
        data.monitoringPoint &&
        data.monitoringPoint.project &&
        data.monitoringPoint.project === selectedProject?.id
      ) {
        setData(data);
      }
    });
    return () => {
      PubSub.unsubscribe(SocketTopic.monitoringPointAlert);
    };
  }, [PubSub, selectedProject?.id]);

  useEffect(() => {
    const renderNotification = (record: any) => {
      const message = Translation.leveledAlarm(getLabelByValue(record.level));
      switch (record.level) {
        case 1:
          api.info({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        case 2:
          api.warning({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        case 3:
          api.error({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message,
            description: <div>{renderDescription(record)}</div>
          });
          break;
        default:
          api.success({
            key: `${record.monitoringPoint.id}-${record.level}`,
            message: Translation.get('alarm.return-to-normal'),
            description: <div>{renderDescription(record)}</div>
          });
          break;
      }
    };

    const renderDescription = (record: any) => {
      return (
        <>
          <p>{`${Translation.get('monitoring.point')}: ${record.monitoringPoint.name}`}</p>
          <p>{`${Translation.get('alarm.properties')}: ${translateMetricName(
            record.metric.name
          )}`}</p>
          <p>{`${Translation.get('alarm.value')}: ${record.value}${
            record.metric.unit ? Translation.get(record.metric.unit) : record.metric.unit
          }`}</p>
        </>
      );
    };
    if (data) {
      renderNotification(data);
    }
  }, [data, api]);

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, padding: '8px' }}>
      <Space direction={'vertical'}>{contextHolder}</Space>
    </div>
  );
};

export default AlertMessageNotification;
