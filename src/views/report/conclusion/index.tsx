import { Report } from '../types';
import { DeviceConclusion } from './device';
import { MonitoringPointConclusion } from './monitoring-point';

export const Conclusion = ({
  report,
  header,
  headerSize
}: {
  report: Report;
  header: React.ReactNode;
  headerSize: number;
}) => {
  if (headerSize > 9) {
    return (
      <>
        <section className='page'>{header}</section>
        <section className='page'>
          <Content report={report} />
        </section>
      </>
    );
  } else {
    return (
      <section className='page'>
        {header}
        <Content report={report} />
      </section>
    );
  }
};

const Content = ({ report }: { report: Report }) => {
  const alarmRecords = (report.alarmRecords ?? []).filter((r: any) => r.status === 0);

  return (
    <>
      <div className='split'></div>
      <h3>{alarmRecords.length === 0 ? '六' : '七'}、结论与建议</h3>
      <ul>
        <MonitoringPointConclusion monitoringPoints={report.monitoringPoints} />
        <DeviceConclusion devices={report.devices} />
      </ul>
    </>
  );
};
