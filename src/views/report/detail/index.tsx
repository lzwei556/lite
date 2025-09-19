import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import intl from 'react-intl-universal';
import { Dayjs } from '../../../utils';
import { useAppType } from '../../../config';
import { DownloadIconButton, IconButton } from '../../../components';
import { AlarmPage } from './alarm';
import { Status } from './status';
import CoverImage from './cover.jpg';
import { ISO } from './iso';
import { useStyles } from './styles';
import { Index as Corrosion } from '../corrosion';
import { Report } from '../types';
import { A4_SIZE, PREFACES, ReportType } from '../constants';
import { getReportType } from '../utils';
import { useTypeContext } from '../context';

export default function ReportDetail() {
  const appType = useAppType();
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state as Report;
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(false);
  const duration = `${Dayjs.format(report.start, 'YYYY/MM/DD')}-${Dayjs.format(
    report.end,
    'YYYY/MM/DD'
  )}`;
  const { cx, styles } = useStyles();

  const renderDownloadButton = () => {
    return (
      <Space
        style={{
          position: 'fixed',
          transform: `translate(${A4_SIZE.width - 23}mm, 16px)`,
          zIndex: 2,
          lineHeight: 1
        }}
        align='start'
      >
        <IconButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/reports')}
          tooltipProps={{ title: intl.get('RETURN') }}
        />
        <DownloadIconButton
          data-html2canvas-ignore='true'
          loading={loading}
          onClick={async () => {
            if (reportRef?.current) {
              const doc = new jsPDF('p', 'mm', 'a4', true);
              const pages = reportRef.current.querySelectorAll('.page');
              setLoading(true);
              try {
                for (let index = 0; index < pages.length; index++) {
                  const page = pages[index];
                  const canvas = await html2canvas(page as HTMLDivElement, { scale: 2 });
                  if (index > 0) {
                    doc.addPage();
                  }
                  doc.addImage(
                    canvas.toDataURL('image/jpeg'),
                    'JPEG',
                    0,
                    0,
                    A4_SIZE.width,
                    A4_SIZE.height
                  );
                }
                doc.save(report.reportName + duration);
              } catch (error) {
              } finally {
                setLoading(false);
              }
            }
          }}
          type='text'
        />
      </Space>
    );
  };

  const Cover = () => {
    const { type } = useTypeContext();
    return (
      <section className={cx('page', 'index')}>
        <img src={CoverImage} alt='cover' className='cover' />
        <h1 className='title'>{`状态监测${getReportType(type)}评估报告`}</h1>
        <h3 className='title'>Condition Monitoring and Evaluation Report</h3>
        <section className='container introduce'>
          <p>
            项目名称：{report.reportName}
            <br />
            报告周期：{duration}
            <br />
            报告日期：{Dayjs.format(report.reportDate, 'YYYY/MM/DD')}
          </p>
        </section>
      </section>
    );
  };

  const Preface = () => {
    const { type } = useTypeContext();
    return (
      <section className='page preface'>
        <h2 className='title'>{`腐蚀测厚${getReportType(type)}报`}</h2>
        <h3>一、前言</h3>
        <ul className='text-list'>
          {PREFACES.map((p, i) => (
            <li key={i} className='item'>
              <div className='index'>{i + 1}.</div>
              <p className='desc'>{p}</p>
            </li>
          ))}
        </ul>
        <h3>二、基本信息</h3>
        <ul className='text-list'>
          <li>项目名称：{report.reportName}</li>
          <li>报告周期：{duration}</li>
          <li>报告日期：{Dayjs.format(report.reportDate, 'YYYY/MM/DD')}</li>
          <li>监测方法：超声波测厚</li>
        </ul>
      </section>
    );
  };

  return (
    <Content>
      <div className={styles.report} ref={reportRef}>
        {renderDownloadButton()}
        {/* <Cover /> */}
        <Preface />
        {appType === 'vibration' && (
          <>
            <Status report={report} />
            <AlarmPage report={report} />
            <ISO />
          </>
        )}
        {appType === 'corrosion' && <></>}
        {report && <Corrosion report={report} />}
      </div>
    </Content>
  );
}
