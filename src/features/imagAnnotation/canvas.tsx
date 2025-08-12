import React from 'react';
import { Typography } from 'antd';
import { Layer, Stage, Image, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { Card } from '../../components';
import { AssetRow } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import { Toolbar } from './toolbar';
import { CanvasProvider, useCanvas } from './context';
import { getPlaces, PlaceTextCardStyle, PlaceTextProps, Point, scaleStage, Size } from './common';

export const Canvas = ({
  asset,
  size,
  background,
  placeTexts,
  textSettingBtn,
  onSave,
  toolbarExtras,
  onUpload
}: {
  asset: AssetRow;
  size: Size;
  background: string;
  placeTexts: PlaceTextProps[];
  textSettingBtn: JSX.Element;
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  toolbarExtras?: React.ReactElement[];
  onUpload?: (image: string) => void;
}) => {
  const [uploadingImg, setUploadingImg] = React.useState<string | undefined>();
  const [img] = useImage(uploadingImg ?? background);
  const [cursor, setCursor] = React.useState('default');
  const stageProps = scaleStage(size, img);
  const { x, y, scale } = stageProps;
  const centralPoint = { x: (size.width / 2 - x) / scale, y: (size.height / 2 - y) / scale };
  const places = getPlaces(stageProps, size, placeTexts);
  const startingPoints = places.map((p) => ({ id: p.id, x: p.x, y: p.y }));
  const placeTextProps = places.map((p, i) => ({ ...placeTexts[i], style: p.style }));
  const { colorInfoBorderStyle } = useGlobalStyles();
  return (
    startingPoints.length > 0 && (
      <CanvasProvider
        asset={asset}
        ends={[...startingPoints].map((point) => ({ ...centralPoint, id: point.id }))}
        editable={!!uploadingImg}
        key={`${centralPoint.x}${centralPoint.y}`}
      >
        <div style={{ position: 'relative' }}>
          {img && (
            <Stage {...size} x={x} y={y} scaleX={scale} scaleY={scale} style={{ cursor }}>
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
          {placeTextProps.map(({ header, body, footer, style }, i) => {
            return (
              <Card
                key={i}
                style={{
                  ...style,
                  position: 'absolute',
                  border: `solid ${PlaceTextCardStyle.BorderWidth}px ${colorInfoBorderStyle.color}`,
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
                <div
                  style={{
                    borderBottom: `solid 1px ${colorInfoBorderStyle.color}`,
                    textAlign: 'center'
                  }}
                >
                  <Typography.Text ellipsis={true}>{header}</Typography.Text>
                </div>
                <div style={{ flex: 'auto', maxHeight: '100%', overflow: 'auto' }}>{body}</div>
                <Typography.Text
                  style={{
                    borderTop: `solid 1px ${colorInfoBorderStyle.color}`,
                    minHeight: '1em',
                    fontSize: 12
                  }}
                  type='secondary'
                >
                  {footer}
                </Typography.Text>
              </Card>
            );
          })}
        </div>
      </CanvasProvider>
    )
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
  const id = starting.id;
  const { editable } = useCanvas();
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
          onDragMove({ ...e.target.position(), id });
        }}
        onMouseOver={() => setCursor('move')}
        onMouseOut={() => setCursor('default')}
        listening={editable}
      />
    </>
  );
}
