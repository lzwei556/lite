import { useGlobalStyles } from '../../styles';
import { ECOptions } from './chart';

export const useBrushOptions = (): ECOptions => {
  const { colorFillTertiaryStyle, colorBorderStyle } = useGlobalStyles();
  return {
    brush: {
      brushType: 'lineX',
      brushMode: 'multiple',
      brushStyle: { ...colorFillTertiaryStyle, borderColor: colorBorderStyle.color },
      toolbox: ['clear'],
      xAxisIndex: 0,
      transformable: false,
      throttleType: 'debounce',
      throttleDelay: 300
    }
  };
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
