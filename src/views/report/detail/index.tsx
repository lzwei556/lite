import React from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dayjs } from '../../../utils';
import { useAppType } from '../../../config';
import { DownloadIconButton } from '../../../components';
import { AlarmPage } from './alarm';
import { Status } from './status';
import { A4_SIZE, PREFACES } from './report';
import Cover from './cover.jpg';
import './style.css';
import { ISO } from './iso';

export default function Report() {
  const appType = useAppType();
  const { state } = useLocation();
  const report = state;
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(false);
  const duration = `${Dayjs.format(report.start, 'YYYY/MM/DD')}-${Dayjs.format(
    report.end,
    'YYYY/MM/DD'
  )}`;

  const renderCover = () => {
    return (
      <section className='page index'>
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
    <div>
      <div className='report' ref={reportRef}>
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
          style={{ position: 'fixed', zIndex: 2 }}
          type='text'
        />
        {renderCover()}
        {renderPreface()}
        <Status report={report} />
        <AlarmPage report={report} />
        {appType === 'vibration' && <ISO />}
      </div>
    </div>
  );
}
