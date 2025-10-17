import React from 'react';
import { Space, Spin, Typography } from 'antd';
import { Card, Descriptions, DownloadIconButton, Flex, IconButton } from '../../../components';
import { Dayjs } from '../../../utils';
import { getReportType } from '../utils';
import { useTypeContext } from '../context';
import { Report } from '../types';
import { ReportType } from '../constants';
import html2pdf from 'html2pdf.js';
import { DevicesStatusSection } from './device/status-section';
import { MonitoringPointsOverviewSection } from './monitoring-point/overview-section';
import { MonitoringPointsStatusSection } from './monitoring-point/status-section';
import { MonitoringPointConclusion } from './monitoring-point/conclusion';
import { AlarmRecordsSection } from './alarm';
import { DevicesConclusion } from './device/conclusion';
import { ReportSection } from '../components/section';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import intl from 'react-intl-universal';

export const Index = ({ report }: { report: Report }) => {
  const duration = `${Dayjs.format(report.start, 'LL')} - ${Dayjs.format(report.end, 'LL')}`;
  const alarmRecords = getAlarmRecords(report);
  const cardRef = React.createRef<HTMLDivElement>();
  const { type } = useTypeContext();
  const title = getTitle(type);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  console.log('loading', loading);
  return (
    <Flex justify='center'>
      <Card
        style={{ position: 'relative', width: '210mm', height: 'auto' }}
        styles={{ body: { paddingBlock: 24, paddingInline: 32 } }}
      >
        <Space style={{ position: 'absolute', right: 16, zIndex: 2 }}>
          <IconButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            tooltipProps={{ title: intl.get('RETURN') }}
          />
          <DownloadIconButton
            onClick={() => {
              if (cardRef.current) {
                setLoading(true);
                try {
                  generatePDF(cardRef.current, `${report.reportName}-${getTitle(type)}`, () =>
                    setLoading(false)
                  );
                } catch (error) {
                  setLoading(false);
                }
              }
            }}
          />
        </Space>
        <Spin spinning={loading}>
          <div ref={cardRef}>
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <Typography.Title level={3}>{title}</Typography.Title>
              <Typography.Text type='secondary'>{duration}</Typography.Text>
            </div>
            <ReportSection title='基本信息'>
              <Descriptions
                contentStyle={{ justifyContent: 'flex-start', textIndent: '2em' }}
                items={[
                  { label: '项目名称', children: report.reportName },
                  { label: '监测方法', children: '超声波测厚' },
                  { label: '报告周期', children: duration },
                  { label: '生成日期', children: Dayjs.format(report.reportDate, 'LL') }
                ]}
              />
            </ReportSection>
            <DevicesStatusSection report={report} />
            <MonitoringPointsOverviewSection report={report} />
            <MonitoringPointsStatusSection report={report} type={type} />
            {alarmRecords && alarmRecords.length > 0 && (
              <AlarmRecordsSection alarmRecords={alarmRecords} />
            )}
            <ReportSection title='结论与建议'>
              <ul style={{ lineHeight: 2 }}>
                <MonitoringPointConclusion monitoringPoints={report.monitoringPoints} />
                <DevicesConclusion devices={report.devices} />
                {alarmRecords && alarmRecords.length > 0 && (
                  <li>
                    存在 <span className='value'>{alarmRecords.length}</span>{' '}
                    条未处理报警记录，请及时处理
                  </li>
                )}
              </ul>
            </ReportSection>
          </div>
        </Spin>
      </Card>
    </Flex>
  );
};

const getTitle = (type: ReportType) => {
  return `腐蚀测厚${getReportType(type)}报`;
};

const getAlarmRecords = (report: Report) => {
  return (report.alarmRecords ?? []).filter((r: any) => r.status === 0);
};

const generatePDF = (target: HTMLDivElement, filename: string, onSuccess: () => void) => {
  html2pdf()
    .from(target)
    .set({
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        dpi: 300,
        letterRendering: true,
        useCORS: true
        // ignoreElements: (element: HTMLDivElement) => {
        //   if (element.id === 'download-btn') {
        //     return true;
        //   }
        //   return false;
        // }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: {
        avoid: ['.chart', 'h4', 'tr', 'td', 'li']
        // before: '.page-break'
      },
      filename
    } as any)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      var totalPages = pdf.internal.getNumberOfPages();
      for (var i = 1; i <= totalPages; i++) {
        if (i > 1) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(
            i + ' / ' + totalPages,
            pdf.internal.pageSize.getWidth() / 2 - 1,
            pdf.internal.pageSize.getHeight() - 5
          );
        }
      }
    })
    //@ts-ignore
    .save()
    .then(onSuccess);
};
