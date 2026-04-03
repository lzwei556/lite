import React from 'react';
import { useLocation } from 'react-router-dom';
import { ReportDTO } from '../types';
import { transform } from '../utils';
import { Index } from '../corrosion';
import { useAppConfig } from 'providers/app';

export default function ReportDetail() {
  const appType = useAppConfig().type;
  const { state } = useLocation();
  const report = state as ReportDTO;

  if (appType === 'vibration') {
  } else if (appType === 'corrosion') {
    return <Index report={transform(report)} />;
  } else {
    return <Index report={transform(report)} />;
  }
}
