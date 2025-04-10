import React from 'react';
import { Typography } from 'antd';
import { Layer, Stage, Image, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { Card } from '../../components';
import { Toolbar } from './toolbar';
import { CanvasProvider, useCanvas } from './context';
import { getPlaces, PlaceTextCardStyle, PlaceTextProps, Point, scaleStage, Size } from './common';

export const Canvas = ({
  size,
  background,
  placeTexts,
  textSettingBtn,
  rawImage
}: {
  size: Size;
  background: string;
  placeTexts: PlaceTextProps[];
  textSettingBtn: JSX.Element;
  rawImage: string;
}) => {
  const [img] = useImage(background);
  const [rawImg] = useImage(rawImage);
  const [cursor, setCursor] = React.useState('default');
  const stageProps = scaleStage(size, img);
  const { x, y, scale } = stageProps;
  const centralPoint = { x: (size.width / 2 - x) / scale, y: (size.height / 2 - y) / scale };
  const places = getPlaces(stageProps, size, placeTexts);
  const startingPoints = places.map((p) => ({ x: p.x, y: p.y }));
  const placeTextProps = places.map((p, i) => ({ ...placeTexts[i], style: p.style }));

  return (
    <CanvasProvider
      ends={[...startingPoints].fill(centralPoint)}
      key={`${centralPoint.x}${centralPoint.y}`}
    >
      <div style={{ position: 'relative' }}>
        {img && rawImg && (
          <Stage {...size} x={x} y={y} scaleX={scale} scaleY={scale} style={{ cursor }}>
            <ImageLayer img={img} rawImg={rawImg} />
            <Marks startingPoints={startingPoints} setCursor={setCursor} />
          </Stage>
        )}
        <Toolbar textSettingBtn={textSettingBtn} />
        {placeTextProps.map(({ header, body, footer, style }, i) => {
          return (
            <Card
              key={i}
              style={{
                ...style,
                position: 'absolute',
                border: `solid ${PlaceTextCardStyle.BorderWidth}px #91caff`,
                width: PlaceTextCardStyle.width,
                height: PlaceTextCardStyle.height,
                borderRadius: 4
              }}
              styles={{
                body: {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBlock: PlaceTextCardStyle.Padding / 2,
                  paddingInline: PlaceTextCardStyle.Padding,
                  height: '100%'
                }
              }}
            >
              <div style={{ borderBottom: 'solid 1px #91caff', textAlign: 'center' }}>
                <Typography.Text ellipsis={true}>{header}</Typography.Text>
              </div>
              <div style={{ flex: 'auto', maxHeight: '100%', overflow: 'auto' }}>{body}</div>
              <Typography.Text
                style={{ borderTop: 'solid 1px #91caff', fontSize: 12 }}
                type='secondary'
              >
                {footer}
              </Typography.Text>
            </Card>
          );
        })}
      </div>
    </CanvasProvider>
  );
};

function ImageLayer({ img, rawImg }: { img: HTMLImageElement; rawImg: HTMLImageElement }) {
  const { editable } = useCanvas();
  return (
    <Layer>
      {!editable && <Image image={img} width={img.width} height={img.height} />}
      {editable && <Image image={rawImg} width={rawImg.width} height={rawImg.height} />}
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
  const { ends, setEnds } = useCanvas();

  return (
    <Layer>
      {startingPoints.map((starting, index) => (
        <ConnectedLine
          key={index}
          starting={starting}
          end={ends[index] ?? ends[0]}
          setCursor={setCursor}
          onDragMove={(point) =>
            setEnds((prev) =>
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
  const { editable } = useCanvas();
  return (
    <>
      <Line
        points={[starting.x, starting.y, starting.x, end.y, end.x, end.y]}
        stroke={'#91caff'}
        strokeWidth={1}
      />
      <Circle
        radius={5}
        fill={'#1677ff'}
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
