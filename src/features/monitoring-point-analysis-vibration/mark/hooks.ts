import React from 'react';
import { ChartMark, useChartContext } from 'components';
import { HarmonicData } from 'asset-common';
import Sideband from '../sideband';
import { useMarkContext } from './context';
import * as Harmonic from './harmonic';
import { findClosest, formatNumericData, getValue, roundValue } from 'utils';
import { getMarkTypeColor, getMarkTypeLabel, MarkType } from './mark-types';
import { Property } from '../useTrend';
import { FaultFrequency } from '../useFaultFrequency';
import { Translation } from 'locales/utils';
import { FaultType } from 'common';

export type MarkParams = {
  x: number[];
  y: number[];
  xIndex?: number;
  property?: Property;
  xUnit?: string;
  harmonic?: HarmonicData;
  faultFrequencies?: FaultFrequency;
};

export const useMarkChartProps = () => {
  const { marks, dispatchMarks } = ChartMark.useContext();
  const { markType, settings } = useMarkContext();
  const { centeredIndex, triggerCenter, triggerSide, reset, cursor } = Sideband.useContext();
  const topY = useTopY();

  const handleClick = React.useCallback(
    ({ coord, x, y, xIndex, property, xUnit }: MarkParams & { coord: [string, number] }) => {
      if (!topY) {
        return;
      }
      const { harmonic } = settings;
      const [xValue, yValue] = coord.map(formatNumericData);
      if (markType === 'Peak' || markType === 'Double' || markType === 'Multiple') {
        dispatchMarks({
          type:
            markType === 'Peak'
              ? 'append_single'
              : markType === 'Double'
              ? 'append_double'
              : 'append_multiple',
          mark: {
            name: coord.join(),
            data: [coord, [coord[0], topY]],
            type: markType,
            value: `${xValue} ${yValue}`,
            chartProps: getLineStyles(
              markType,
              `${getMarkTypeLabel(markType)}\r\n${getValue({
                value: xValue as number,
                unit: xUnit
              })}\r\n${getValue({
                value: coord[1],
                unit: property?.unit
              })}`
            )
          }
        });
      } else if (markType === 'Harmonic') {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs({ baseFrequencyIndex: xIndex, cursor: harmonic.cursor }),
          dispatchMarks,
          topY,
          property
        });
      }
    },
    [markType, dispatchMarks, settings, topY]
  );

  const handleSidebandClick = React.useCallback(
    ({ xIndex, x, y, coord, property }: MarkParams & { coord: [string, number] }) => {
      if (!topY) {
        return;
      }
      if (markType === 'Sideband' && xIndex) {
        const { sideband } = settings;
        if (centeredIndex && cursor === 'side') {
          triggerSide(
            Sideband.getIndexs({ centeredIndex, sideIndex: xIndex, cursor: sideband.cursor }),
            x,
            y,
            topY
          );
        } else if (cursor === 'center') {
          triggerCenter(coord, topY, xIndex, property);
        }
      }
    },
    [centeredIndex, cursor, markType, settings, topY, triggerCenter, triggerSide]
  );

  const handleRefreshHarmonic = React.useCallback(
    ({ x, y, harmonic, property }: MarkParams) => {
      const {
        harmonic: { enabled, base, cursor }
      } = settings;
      const closest = base ? findClosest(x, base) : null;
      const baseFrequencyIndex = closest ? x.indexOf(closest) : -1;
      if (enabled && topY) {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs(
            baseFrequencyIndex !== -1 ? { cursor, baseFrequencyIndex } : { cursor, harmonic }
          ),
          dispatchMarks,
          topY,
          property
        });
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Harmonic'] });
      }
    },
    [dispatchMarks, settings, topY]
  );

  const handleRefreshSideband = React.useCallback(
    ({ x, y, property }: MarkParams) => {
      const {
        sideband: { enabled, cursor, center, distance }
      } = settings;

      if (enabled) {
        const closest = center ? findClosest(x, center) : null;
        if (closest) {
          const centeredIndex = x.indexOf(closest);
          if (distance) {
            const closestSide = findClosest(x, closest + distance);
            if (closestSide) {
              const sideIndex = x.indexOf(closestSide);
              if (centeredIndex !== -1 && sideIndex !== -1 && topY) {
                const coord = [`${x[centeredIndex]}`, y[centeredIndex]] as [string, number];
                triggerCenter(coord, topY, centeredIndex, property);
                triggerSide(Sideband.getIndexs({ centeredIndex, sideIndex, cursor }), x, y, topY);
              }
            }
          }
        }
      } else {
        reset();
      }
    },
    [settings, triggerCenter, triggerSide, topY, reset]
  );

  const handleToggleMarks = React.useCallback(
    ({ faultFrequencies, x, y, property }: MarkParams) => {
      dispatchMarks({ type: 'remove_by_type', removeTypes: ['Faultfrequency', 'Top10'] });
      const { faultFrequency, top10 } = settings;
      if (faultFrequency && topY) {
        getFaultFrequencyOptions(faultFrequencies).forEach(({ label, value }) => {
          const closest = getMaxAmplitudeInRange(x, y, value);
          const index = closest ? y.indexOf(closest) : -1;
          if (index !== -1) {
            const xValue = `${x[index]}`;
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${value}`,
                data: [
                  [xValue, y?.[index] ?? -1],
                  [xValue, topY]
                ],
                type: 'Faultfrequency',
                chartProps: getLineStyles(
                  'Faultfrequency',
                  `${label}\r\n${roundValue(value)} Hz\r\n${getValue({
                    value: y?.[index],
                    unit: property?.unit
                  })}`
                )
              }
            });
          }
        });
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Faultfrequency'] });
      }

      if (top10) {
        if (y.length >= 10) {
          const top10 = getTop10({ x, y });
          top10.forEach((n, index) => {
            const xValue = `${x[y.indexOf(n.value)]}`;
            const yValue = n.value;
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${yValue}${index}`,
                data: [xValue, yValue],
                type: 'Top10',
                chartProps: { default: true }
              }
            });
          });
        }
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Top10'] });
      }
    },
    [dispatchMarks, settings, topY]
  );

  const handleRestore = () => {
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Peak', 'Double', 'Multiple'] });
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Harmonic'] });
    reset();
  };

  return {
    handleClick,
    handleSidebandClick,
    handleRefreshHarmonic,
    handleRefreshSideband,
    handleToggleMarks,
    handleRestore,
    marks,
    isTypeSideband: markType === 'Sideband',
    markType,
    dispatchMarks
  };
};

const useTopY = () => {
  const [topY, setTopY] = React.useState<number>();
  const ref = useChartContext();

  React.useEffect(() => {
    const chart = ref.current?.getInstance() as any;
    if (!chart) return;

    const updateTopY = () => {
      const model = chart.getModel();
      const grid = model?.getComponent('grid');
      const rect = grid?.coordinateSystem?.getRect();
      if (!rect) return;

      const yValue = chart.convertFromPixel({ yAxisIndex: 0 }, rect.y);

      setTopY(roundValue(yValue, 5));
    };

    // Initial calculation
    updateTopY();

    // React to zoom / render / resize
    chart.on('dataZoom', updateTopY);
    chart.on('finished', updateTopY);
    chart.on('resize', updateTopY);

    return () => {
      chart.off('dataZoom', updateTopY);
      chart.off('finished', updateTopY);
      chart.off('resize', updateTopY);
    };
  }, [ref]);

  return topY;
};

export const useDatazoom = () => {
  const ref = useChartContext();
  const [dataZoom, setDataZoom] = React.useState<any>();

  React.useEffect(() => {
    const chart = ref.current?.getInstance() as any;
    if (!chart) return;

    const updateDataZoom = () => {
      const dataZoom = ref.current.getInstance()?.getOption()?.dataZoom;

      setDataZoom(dataZoom);
    };

    // Initial calculation
    updateDataZoom();

    // React to zoom
    chart.on('dataZoom', updateDataZoom);

    return () => {
      chart.off('dataZoom', updateDataZoom);
    };
  }, [ref]);
  return dataZoom;
};

export const getLineStyles = (markType: MarkType, formatter?: string) => {
  const color = getMarkTypeColor(markType);

  return {
    label: formatter
      ? {
          formatter,
          color: markType === 'Peak' ? '#333' : '#fff',
          borderWidth: 1,
          borderType: 'solid',
          borderRadius: 4,
          padding: [4, 3],
          backgroundColor: color,
          fontSize: 10,
          lineHeight: 13,
          opacity: 0.88,
          distance: markType === 'Faultfrequency' ? [0, -47] : 0
        }
      : { show: false },
    itemStyle: { color: getMarkTypeColor(markType) },
    lineStyle: { type: 'solid' },
    symbol: 'arrow'
  };
};

export const getTop10 = ({ x, y, harmonic }: MarkParams) => {
  const harmonic1 = harmonic?.harmonic1XIndex ? x[harmonic?.harmonic1XIndex] : null;
  return findPeakElementsWithIndex(y)
    .map(({ index, value }) => {
      const frequency = x[index];
      return {
        value,
        frequency: x[index],
        order: frequency / (harmonic1 == null || harmonic1 === 0 ? 1 : harmonic1)
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

function findPeakElementsWithIndex(nums: number[]): { index: number; value: number }[] {
  const peaks: { index: number; value: number }[] = [];
  const n = nums.length;

  if (n === 0) return peaks;
  if (n === 1) return [{ index: 0, value: nums[0] }];

  if (n > 1 && nums[0] > nums[1]) {
    peaks.push({ index: 0, value: nums[0] });
  }

  for (let i = 1; i < n - 1; i++) {
    if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
      peaks.push({ index: i, value: nums[i] });
    }
  }

  if (n > 1 && nums[n - 1] > nums[n - 2]) {
    peaks.push({ index: n - 1, value: nums[n - 1] });
  }

  return peaks;
}

export const getFaultFrequency = ({ faultFrequencies, x, y }: MarkParams) => {
  return getFaultFrequencyOptions(faultFrequencies).map(({ label, value }) => {
    const closest = getMaxAmplitudeInRange(x, y, value);
    const index = closest ? y.indexOf(closest) : -1;
    const closest2 = getMaxAmplitudeInRange(x, y, value * 2);
    const index2 = closest2 ? y.indexOf(closest2) : -1;
    const closest3 = getMaxAmplitudeInRange(x, y, value * 3);
    const index3 = closest3 ? y.indexOf(closest3) : -1;
    return {
      label,
      value,
      data: [y?.[index] ?? -1, y?.[index2] ?? -1, y?.[index3] ?? -1]
    };
  });
};

const getFaultFrequencyOptions = (faultFrequency?: FaultFrequency) => {
  return faultFrequency
    ? Object.entries(faultFrequency).map(([key, value]) => ({
        label: Translation.get(FaultType.getLabel(key)),
        value
      }))
    : [];
};

function getMaxAmplitudeInRange(
  frequencies: number[],
  accelerations: number[],
  targetFreq: number
): number | undefined {
  const lower = targetFreq * 0.98;
  const upper = targetFreq * 1.02;

  let maxAcc: number | undefined;

  for (let i = 0; i < frequencies.length; i++) {
    const freq = frequencies[i];

    if (freq >= lower && freq <= upper) {
      const acc = accelerations[i];
      if (maxAcc === undefined || acc > maxAcc) {
        maxAcc = acc;
      }
    }
  }

  return maxAcc;
}
