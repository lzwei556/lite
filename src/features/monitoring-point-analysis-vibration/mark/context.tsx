import React from 'react';
import { ChartMark } from 'components';
import Sideband from '../sideband';
import { MarkType } from './mark-types';
import { getAnalysisSettings } from './settings-form';

export type MarkSettings = {
  harmonic: { enabled: boolean; cursor: number; base?: number };
  sideband: { enabled: boolean; cursor: number; center?: number; distance?: number };
  faultFrequency: boolean;
  top10: boolean;
};

export const settingsDefaultValue = {
  harmonic: { enabled: true, cursor: 5 },
  sideband: { enabled: false, cursor: 5 },
  faultFrequency: false,
  top10: false
};

const AnalysisContext = React.createContext<{
  markType: MarkType;
  setMarkType: React.Dispatch<React.SetStateAction<MarkType>>;
  settings: MarkSettings;
  setSettings: React.Dispatch<React.SetStateAction<MarkSettings>>;
}>({
  markType: 'Peak',
  setMarkType: () => {},
  settings: settingsDefaultValue,
  setSettings: () => {}
});

export const MarkContext = ({ children }: { children: React.ReactNode }) => {
  const [markType, setMarkType] = React.useState<MarkType>('Peak');
  const [settings, setSettings] = React.useState<MarkSettings>(
    getAnalysisSettings() ?? settingsDefaultValue
  );

  return (
    <ChartMark.Context>
      <AnalysisContext.Provider
        value={{
          markType,
          setMarkType,
          settings,
          setSettings
        }}
      >
        <Sideband.Context>{children}</Sideband.Context>
      </AnalysisContext.Provider>
    </ChartMark.Context>
  );
};

export const useMarkContext = () => React.useContext(AnalysisContext);
