import React from 'react';
import { useSearchParams, URLSearchParamsInit } from 'react-router-dom';
import { ReportType } from './constants';

const TypeContext = React.createContext<{
  type: ReportType;
  setSearchParams: (paras?: URLSearchParamsInit) => void;
}>({
  type: ReportType.Weekly,
  setSearchParams: () => {}
});

export const TypeProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams({ type: `${ReportType.Weekly}` });
  const typeParamValue = searchParams.get('type');
  const type = typeParamValue ? (Number(typeParamValue) as ReportType) : ReportType.Weekly;
  return <TypeContext.Provider value={{ type, setSearchParams }}>{children}</TypeContext.Provider>;
};

export const useTypeContext = () => React.useContext(TypeContext);
