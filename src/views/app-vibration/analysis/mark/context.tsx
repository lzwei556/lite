import React from 'react';
import { ChartMark } from '../../../../components';
import CenterSide from '../centerSide';
import Harmon from '../harmonic';

export const markTypes = [
  'Peak',
  'Double',
  'Multiple',
  'Harmonic',
  'Sideband',
  'Faultfrequency',
  'Top10'
] as const;
export type MarkType = typeof markTypes[number];

const AnalysisContext = React.createContext<{
  markType: MarkType;
  setMarkType: React.Dispatch<React.SetStateAction<MarkType>>;
}>({ markType: 'Peak', setMarkType: () => {} });

export const MarkContext = ({ children }: { children: React.ReactNode }) => {
  const [markType, setMarkType] = React.useState<MarkType>('Peak');
  return (
    <ChartMark.Context>
      <AnalysisContext.Provider value={{ markType, setMarkType }}>
        <CenterSide.Context>
          <Harmon.Context>{children}</Harmon.Context>
        </CenterSide.Context>
      </AnalysisContext.Provider>
    </ChartMark.Context>
  );
};

export const useMarkContext = () => React.useContext(AnalysisContext);
