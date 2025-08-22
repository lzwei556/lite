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
import { A4_SIZE, PREFACES } from './report';
import Cover from './cover.jpg';
import { ISO } from './iso';
import { useStyles } from './styles';

export default function Report() {
  const appType = useAppType();
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state;
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

  const renderCover = () => {
    return (
      <section className={cx('page', 'index')}>
        <img src={Cover} alt='cover' className='cover' />
        <h1 className='title'>状态监测周评估报告</h1>
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

  const renderPreface = () => {
    return (
      <section className='page preface'>
        <h2 className='title'>前言</h2>
        <ul className='text-list'>
          {PREFACES.map((p, i) => (
            <li key={i} className='item'>
              <div className='index'>{i + 1}.</div>
              <p className='desc'>{p}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <Content>
      <div className={styles.report} ref={reportRef}>
        {renderDownloadButton()}
        {renderCover()}
        {renderPreface()}
        <Status report={report} />
        <AlarmPage report={report} />
        {appType === 'vibration' && <ISO />}
      </div>
    </Content>
  );
}
