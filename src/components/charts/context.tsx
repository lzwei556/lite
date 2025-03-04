import React from 'react';
import { ChartHandler } from './chart';

type Props = React.MutableRefObject<ChartHandler>;

const Context = React.createContext<Props>({} as Props);

export const ChartContext = ({ children }: { children: JSX.Element }) => {
  const ref = React.useRef<ChartHandler>({ getInstance: () => undefined });
  return <Context.Provider value={ref}>{children}</Context.Provider>;
};

export const useChartContext = () => React.useContext(Context);
