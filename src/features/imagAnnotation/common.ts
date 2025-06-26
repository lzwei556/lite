import { Space } from '../../common';

export type Size = { width: number; height: number };
export type Point = { id: number; x: number; y: number };
type StageProps = { x: number; y: number; scale: number };
export type PlaceTextProps = {
  id: number;
  header: React.ReactNode;
  body: JSX.Element;
  footer?: string;
};

export const MARGIN = Space;
export const PlaceTextCardStyle = {
  BorderWidth: 1,
  Padding: Space / 2,
  width: 220,
  height: 210
};

export function scaleStage(size: Size, img?: HTMLImageElement) {
  let aspectRatio = 1,
    scaleX = 1,
    scaleY = 1,
    scale = 1,
    x = 1,
    y = 1;

  if (img) {
    if (img.width > size.width || img.height > size.height) {
      aspectRatio = img.width / img.height;
      scaleX = size.width / img.width;
      scaleY = size.height / img.height;
      scale = aspectRatio < 1 ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
    }
    x = (size.width - img.width * scale) / 2;
    y = (size.height - img.height * scale) / 2;
  }
  return { x, y, scale };
}

export function getPlaces(stage: StageProps, size: Size, placeTexts: PlaceTextProps[]) {
  const { x, y, scale } = stage;
  const popoverXLen = PlaceTextCardStyle.width / 2 + MARGIN;
  const popoverYLen = PlaceTextCardStyle.height + MARGIN;
  const leftTop = {
    x: (popoverXLen - x) / scale,
    y: (popoverYLen - y) / scale,
    style: { top: MARGIN, left: MARGIN }
  };
  const rightTop = {
    x: (size.width - popoverXLen - x - MARGIN * 3) / scale,
    y: (popoverYLen - y) / scale,
    style: { top: MARGIN, right: MARGIN * 4 }
  };
  const leftBottom = {
    x: (popoverXLen - x) / scale,
    y: (size.height - popoverYLen - y) / scale,
    style: { bottom: MARGIN, left: MARGIN }
  };
  const rightBottom = {
    x: (size.width - popoverXLen - x - MARGIN * 3) / scale,
    y: (size.height - popoverYLen - y) / scale,
    style: { bottom: MARGIN, right: MARGIN * 4 }
  };
  return [leftTop, rightTop, leftBottom, rightBottom]
    .map((point, i) => ({ ...point, id: placeTexts[i].id }))
    .filter((p, i) => i < placeTexts.length);
}
