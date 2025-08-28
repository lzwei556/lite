import { Space } from '../../common';

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };
type StageProps = { x: number; y: number; scale: number };

export const MARGIN = Space;
const PlaceTextCardStyle = {
  BorderWidth: 1,
  Padding: Space / 2,
  width: 220,
  height: 210
};

export const useStageProps = (size: Size, image: HTMLImageElement | undefined) => {
  const { x, y, scale } = scaleStage(size, image);
  return { ...size, x, y, scaleX: scale, scaleY: scale };
};

function scaleStage(size: Size, img?: HTMLImageElement) {
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

export function usePlaces(stage: StageProps, size: Size, lengthLimit: number) {
  if (lengthLimit === 0) return [];
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
  return [leftTop, rightTop, leftBottom, rightBottom].filter((_, i) => i < lengthLimit);
}

export const useProviderProps = (
  size: Size,
  stage: StageProps,
  startingPoints: Point[],
  initials: Point[]
) => {
  const { x, y, scale } = stage;
  const centralPoint = { x: (size.width / 2 - x) / scale, y: (size.height / 2 - y) / scale };
  return {
    _key: `${centralPoint.x}${centralPoint.y}`,
    editable: false,
    initials: getInitials(initials, centralPoint, startingPoints)
  };
};

const getInitials = (initials: Point[], centralPoint: Point, startingPoints: Point[]) => {
  const points = startingPoints.map(() => centralPoint);
  return initials.length === points.length ? initials : points;
};
