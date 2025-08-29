import { Space } from '../../common';

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };
type StageProps = { x: number; y: number; scale: number };

const Margin = Space;
const PlaceTextCardStyle = {
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
  const popoverXLen = PlaceTextCardStyle.width / 2 + Margin;
  const popoverYLen = PlaceTextCardStyle.height + Margin;
  const leftTop = {
    x: (popoverXLen - x) / scale,
    y: (popoverYLen - y) / scale,
    style: { top: Margin, left: Margin }
  };
  const rightTop = {
    x: (size.width - popoverXLen - x - Margin * 3) / scale,
    y: (popoverYLen - y) / scale,
    style: { top: Margin, right: Margin }
  };
  const leftBottom = {
    x: (popoverXLen - x) / scale,
    y: (size.height - popoverYLen - y) / scale,
    style: { bottom: Margin, left: Margin }
  };
  const rightBottom = {
    x: (size.width - popoverXLen - x - Margin * 3) / scale,
    y: (size.height - popoverYLen - y) / scale,
    style: { bottom: Margin, right: Margin }
  };
  return [leftTop, rightTop, leftBottom, rightBottom].filter((_, i) => i < lengthLimit);
}

export const useProviderProps = (
  size: Size,
  stage: StageProps,
  startingPoints: Point[],
  initials: Point[],
  editable?: boolean
) => {
  const { x, y, scale } = stage;
  const centralPoint = { x: (size.width / 2 - x) / scale, y: (size.height / 2 - y) / scale };
  return {
    _key: `${centralPoint.x}${centralPoint.y}`,
    editable,
    initials: getInitials(initials, centralPoint, startingPoints)
  };
};

const getInitials = (initials: Point[], centralPoint: Point, startingPoints: Point[]) => {
  const points = startingPoints.map(() => centralPoint);
  return initials.length === points.length ? initials : points;
};
