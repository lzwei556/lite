import React from 'react';
import { Point } from './common';

const CanvasContext = React.createContext<{
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  points: [],
  setPoints: () => {},
  editable: false,
  setEditable: () => {}
});

export const CanvasProvider = ({
  initials = [],
  children,
  editable: editableFromProps
}: {
  initials?: Point[];
  children: React.ReactNode;
  editable?: boolean;
}) => {
  const [points, setPoints] = React.useState(initials);
  const [editable, setEditable] = React.useState(editableFromProps ?? false);

  return (
    <CanvasContext.Provider value={{ points, setPoints, editable, setEditable }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => React.useContext(CanvasContext);
