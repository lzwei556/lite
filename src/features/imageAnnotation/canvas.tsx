import React from 'react';
import { Layer, Stage, Image, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { useGlobalStyles } from '../../styles';
import { Toolbar } from './toolbar';
import { CanvasProvider, useCanvasContext } from './context';
import { Point, Size, usePlaces, useProviderProps, useStageProps } from './common';
import { PalceCardItem, PlaceCard, PlaceCardProps } from './placeCard';

export const Canvas = ({
  size,
  background,
  selectedItem,
  placeCardProps,
  textSettingBtn,
  onSave,
  initials,
  toolbarExtras,
  onUpload
}: {
  size: Size;
  background: string;
  selectedItem?: Partial<Pick<PalceCardItem, 'index' | 'propertyKey' | 'axisKey'>>;
  placeCardProps: PlaceCardProps[];
  textSettingBtn: JSX.Element;
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  initials?: Point[];
  toolbarExtras?: React.ReactElement[];
  onUpload?: (image: string) => void;
}) => {
  const [uploadingImg, setUploadingImg] = React.useState<string>();
  const [img] = useImage(uploadingImg ?? background);
  const [cursor, setCursor] = React.useState('default');
  const stageProps = useStageProps(size, img);
  const scaleProps = { x: stageProps.x, y: stageProps.y, scale: stageProps.scaleX };
  const places = usePlaces(scaleProps, size, placeCardProps.length);
  const startingPoints = places.map((p) => ({ x: p.x, y: p.y }));
  const providerProps = useProviderProps(size, scaleProps, startingPoints, initials ?? []);

  return (
    <CanvasProvider {...providerProps} key={providerProps._key}>
      <div style={{ position: 'relative' }}>
        {img && (
          <Stage {...stageProps} style={{ cursor }}>
            <ImageLayer img={img} />
            <Marks startingPoints={startingPoints} setCursor={setCursor} />
          </Stage>
        )}
        <Toolbar
          textSettingBtn={textSettingBtn}
          onSave={onSave}
          extras={toolbarExtras}
          beforeUpload={setUploadingImg}
          onCancel={() => {
            setUploadingImg(undefined);
          }}
          onUpload={onUpload}
          uploadedImageStr={uploadingImg}
        />
        {placeCardProps.map((props, i) => (
          <PlaceCard {...props} style={places?.[i].style} key={i} selectedItem={selectedItem} />
        ))}
      </div>
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
  // const id = starting.id;
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
