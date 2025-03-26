import React from 'react';
import { Point } from './common';

const CanvasContext = React.createContext<{
  ends: Point[];
  setEnds: React.Dispatch<React.SetStateAction<Point[]>>;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  ends: [],
  setEnds: () => {},
  editable: false,
  setEditable: () => {}
});

export const CanvasProvider = ({
  ends: endsFromProps,
  children
}: {
  ends: Point[];
  children: React.ReactNode;
}) => {
  const ls = localStorage.getItem('canvas-snapshot');
  const endsFromLocal: Point[] = ls ? JSON.parse(ls) : [];
  const [ends, setEnds] = React.useState(
    endsFromProps.length === endsFromLocal.length ? endsFromLocal : endsFromProps
  );
  const [editable, setEditable] = React.useState(false);
  return (
    <CanvasContext.Provider value={{ ends, setEnds, editable, setEditable }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => React.useContext(CanvasContext);
