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
import { AlarmPage } from '../vibration/alarm';
import { Status } from '../vibration/status';
import CoverImage from './cover.jpg';
import { ISO } from '../vibration/iso';
import { useStyles } from './styles';
import { Index as Corrosion } from '../corrosion';
import { Report, ReportDTO } from '../types';
import { A4_SIZE, PREFACES, ReportType } from '../constants';
import { getReportType, transform } from '../utils';
import { useTypeContext } from '../context';
import { Index2 } from '../corrosion/index2';

export default function ReportDetail() {
  const appType = useAppType();
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state as ReportDTO;
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(false);
  const duration = `${Dayjs.format(report.start, 'YYYY/MM/DD')}-${Dayjs.format(
    report.end,
    'YYYY/MM/DD'
  )}`;
  const { cx, styles } = useStyles();

  if (appType === 'vibration') {
  } else if (appType === 'corrosion') {
    return <Index2 report={transform(report)} />;
  } else {
    return <Index2 report={transform(report)} />;
  }
}
