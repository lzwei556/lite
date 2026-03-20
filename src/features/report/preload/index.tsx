import React from 'react';
import { MonitoringSolutionSection } from './solution';
import { StandardSection } from './standard';
import { DefinitionSection } from './definition';
import { ConclusionSection } from './conclusion';
import { DisclaimerSection } from './disclaimer';
import { CoverPage } from './CoverPage';
import { ContentPage } from './ContentPage';
import { ReportContainer } from '../components/report-container';
import { A4Page } from '../components/A4Page';

const Report = () => {
  return (
    <ReportContainer filename=''>
      <CoverPage />
      <MonitoringSolutionSection />
    </ReportContainer>
  );
};

export default Report;
