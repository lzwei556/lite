import { ECOptions } from './chart';

export const Options: ECOptions = {
  brush: {
    brushType: 'lineX',
    brushMode: 'multiple',
    brushStyle: { color: 'rgba(255,255,255,0.1)', borderColor: '#333' },
    toolbox: ['clear'],
    xAxisIndex: 0,
    transformable: false,
    throttleType: 'debounce',
    throttleDelay: 300
  }
};
export const ActionPayload = {
  clear_areas: {
    type: 'brush',
    areas: []
  },
  disable: {
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: false
  },
  enable: {
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: { brushType: 'lineX', brushMode: 'multiple' }
  }
};
export function getBrushAreas(coordRanges: [number, number][]) {
  return {
    type: 'brush',
    areas: coordRanges.map((coordRange) => ({
      brushType: 'lineX',
      xAxisIndex: 0,
      coordRange
    }))
  };
}
