import React from 'react';
import { Layer, Stage, Image, Line, Circle } from 'react-konva';
import { useSize } from 'ahooks';
import { PalceCardItem, PlaceCard, PlaceCardProps } from './placeCard';
import { Card, CardProps } from '../../components';
import { useGlobalStyles } from '../../styles';
import { CanvasProvider, useCanvasContext } from './context';
import { Point, useStageSize, usePlaces, useProviderProps, useStageProps } from './common';

export const Canvas = ({
  background,
  selectedItem,
  placeCardProps,
  initials = [],
  cardProps,
  editable,
  legacyToolbar
}: {
  background: HTMLImageElement;
  selectedItem?: Omit<PalceCardItem, 'title' | 'children'>;
  placeCardProps: PlaceCardProps[];
  initials?: Point[];
  cardProps?: CardProps;
  editable?: boolean;
  legacyToolbar?: React.ReactNode;
}) => {
  const ref = React.useRef(null);
  const size = useStageSize(useSize(ref));
  const [cursor, setCursor] = React.useState('default');
  const stageProps = useStageProps(size, background);
  const scaleProps = { x: stageProps.x, y: stageProps.y, scale: stageProps.scaleX };
  const places = usePlaces(scaleProps, size, placeCardProps.length);
  const startingPoints = places.map((p) => ({ x: p.x, y: p.y }));
  const providerProps = useProviderProps({
    size,
    stage: scaleProps,
    startingPoints,
    initials,
    editable
  });

  return (
    <CanvasProvider {...providerProps} key={providerProps?._key}>
      <Card
        {...cardProps}
        ref={ref}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        styles={{ body: { flex: 1, position: 'relative', padding: 0 } }}
      >
        {background && (
          <>
            <Stage {...stageProps} style={{ cursor }}>
              <ImageLayer img={background} />
              <Marks startingPoints={startingPoints} setCursor={setCursor} />
            </Stage>
            {legacyToolbar}
            {placeCardProps
              .filter((_, i) => i < places.length)
              .map((props, i) => (
                <PlaceCard
                  {...props}
                  selected={!editable}
                  style={places?.[i]?.style}
                  key={i}
                  selectedItem={selectedItem}
                />
              ))}
          </>
        )}
      </Card>
    </CanvasProvider>
  );
};

function ImageLayer({ img, rawImg }: { img: HTMLImageElement; rawImg?: HTMLImageElement }) {
  return (
    <Layer>
      <Image image={img} width={img.width} height={img.height} />
      {rawImg && <Image image={rawImg} width={rawImg.width} height={rawImg.height} />}
    </Layer>
  );
}

function Marks({
  startingPoints,
  setCursor
}: {
  startingPoints: Point[];
  setCursor: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { points, setPoints } = useCanvasContext();

  return (
    <Layer>
      {startingPoints.map((starting, index) => (
        <ConnectedLine
          key={index}
          starting={starting}
          end={points[index] ?? points[0]}
          setCursor={setCursor}
          onDragMove={(point) =>
            setPoints((prev) =>
              prev.map((end, i) => {
                if (index === i) {
                  return point;
                } else {
                  return end;
                }
              })
            )
          }
        />
      ))}
    </Layer>
  );
}

function ConnectedLine({
  starting,
  end,
  setCursor,
  onDragMove
}: {
  starting: Point;
  end: Point;
  setCursor: React.Dispatch<React.SetStateAction<string>>;
  onDragMove: (point: Point) => void;
}) {
  const { editable } = useCanvasContext();
  const { colorInfoBorderStyle, colorPrimaryStyle } = useGlobalStyles();
  return (
    <>
      <Line
        points={[starting.x, starting.y, starting.x, end.y, end.x, end.y]}
        stroke={colorInfoBorderStyle.color}
        strokeWidth={1}
      />
      <Circle
        radius={5}
        fill={colorPrimaryStyle.color}
        x={end.x}
        y={end.y}
        draggable
        onDragMove={(e) => {
          setCursor('move');
          onDragMove(e.target.position());
        }}
        onMouseOver={() => setCursor('move')}
        onMouseOut={() => setCursor('default')}
        listening={editable}
      />
    </>
  );
}
