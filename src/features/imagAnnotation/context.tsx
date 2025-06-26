import React from 'react';
import { AssetRow } from '../../views/asset-common';
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
  asset,
  ends: endsFromProps,
  children
}: {
  asset: AssetRow;
  ends: Point[];
  children: React.ReactNode;
}) => {
  const endsFromLocal: Point[] = asset.attributes?.canvasSnapshot ?? [];
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
