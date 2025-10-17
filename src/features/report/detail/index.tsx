import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReportDTO } from '../types';
import { useAppType } from '../../../config';
import { transform } from '../utils';
import { Index } from '../corrosion';

export default function ReportDetail() {
  const appType = useAppType();
  const { state } = useLocation();
  const report = state as ReportDTO;

  if (appType === 'vibration') {
  } else if (appType === 'corrosion') {
    return <Index report={transform(report)} />;
  } else {
    return <Index report={transform(report)} />;
  }
}
