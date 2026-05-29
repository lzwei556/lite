import { Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { AlarmRecordsTable } from "features/alarm-record";
import intl from "react-intl-universal";

export default function AlarmRecord() {
  return (
    <Content>
      <Typography.Title level={4}>{intl.get('ALARM_RECORDS')}</Typography.Title>
      <AlarmRecordsTable />
    </Content>
  );
}
