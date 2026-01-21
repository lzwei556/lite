import React from 'react';
import { ChartMark, useChartContext } from 'components';
import { HarmonicData } from 'asset-common';
import Sideband from '../sideband';
import { useMarkContext } from './context';
import * as Harmonic from './harmonic';
import { findClosest, formatNumericData, roundValue } from 'utils';
import { getMarkTypeColor, MarkType } from './mark-types';

export const useMarkChartProps = () => {
  const { marks, dispatchMarks } = ChartMark.useContext();
  const { markType, settings } = useMarkContext();
  const { centeredIndex, setCenteredIndex, triggerCenter, triggerSide, reset } =
    Sideband.useContext();

  const handleClick = React.useCallback(
    (coord: [string, number], x: number[], y: number[], xIndex?: number) => {
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
            data: coord,
            type: markType,
            value: `${xValue} ${yValue}`,
            chartProps: getLineStyles(markType, `${xValue} ${yValue}`)
          }
        });
      } else if (markType === 'Sideband' && xIndex) {
        if (centeredIndex) {
          triggerSide(Sideband.getIndexs({ centeredIndex, sideIndex: xIndex }), x, y);
        } else {
          triggerCenter(coord);
          setCenteredIndex(xIndex);
        }
      } else if (markType === 'Harmonic') {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs({ baseFrequencyIndex: xIndex, cursor: harmonic.cursor }),
          dispatchMarks
        });
      }
    },
    [markType, dispatchMarks, centeredIndex, setCenteredIndex, triggerCenter, triggerSide, settings]
  );

  const handleRefreshHarmonic = React.useCallback(
    (x: number[], y: number[], harmonic?: HarmonicData) => {
      const {
        harmonic: { enabled, base, cursor }
      } = settings;
      const closest = base ? findClosest(x, base) : null;
      const baseFrequencyIndex = closest ? x.indexOf(closest) : -1;

      if (enabled) {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs(
            baseFrequencyIndex !== -1 ? { cursor, baseFrequencyIndex } : { cursor, harmonic }
          ),
          dispatchMarks
        });
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Harmonic'] });
      }
    },
    [dispatchMarks, settings]
  );

  const handleRefreshSideband = React.useCallback(
    (x: number[], y: number[]) => {
      const markType = 'Sideband'
      const {
        sideband: { enabled, center, distance }
      } = settings;
      const closest = center ? findClosest(x, center) : null;
      const centeredIndex = closest ? x.indexOf(closest) : -1;
      const sideIndex = centeredIndex !== -1 && distance ? centeredIndex + distance : null;
      if (enabled && centeredIndex !== -1 && sideIndex) {
        const coord = [`${x[centeredIndex]}`, y[centeredIndex]] as [string, number];
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `${'center'}${coord.join()}`,
            label: 'sideband.center',
            data: coord,
            type: markType,
            chartProps: {
              itemStyle: { color: getMarkTypeColor(markType) }
            }
          }
        });
        Sideband.getIndexs({ centeredIndex, sideIndex }).forEach(({ index, label }, i) => {
          const xValue = x[index] ?? 'out.of.range';
          const yValue = y[index] ?? 'out.of.range';
          dispatchMarks({
            type: 'append_multiple',
            mark: {
              name: `${'side'}${[`${xValue}`, yValue].join()}${i}`,
              label,
              data: [`${xValue}`, yValue],
              type: markType,
              chartProps: {
                itemStyle: { color: getMarkTypeColor(markType) }
              }
            }
          });
        });
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Sideband'] });
      }
    },
    [dispatchMarks, settings]
  );

  const handleToggleMarks = React.useCallback(
    (x: number[], y: number[], faultFrequencies?: { label: string; value: number }[]) => {
      const { faultFrequency, top10 } = settings;
      if (faultFrequency) {
        (faultFrequencies ?? []).forEach(({ label, value }) => {
          const closest = findClosest(x, value);
          const index = x.indexOf(closest ?? value);
          if (index !== -1) {
            const xValue = `${x[index]}`;
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${value}`,
                data: [xValue, y?.[index] ?? -1],
                type: 'Faultfrequency',
                chartProps: {
                  label: { formatter: `${label} ${roundValue(value)}` },
                  itemStyle: { color: getMarkTypeColor('Faultfrequency') }
                }
              }
            });
          }
        });
      } else {
        dispatchMarks({ type: 'remove_by_type', removeTypes: ['Faultfrequency'] });
      }

      if (top10) {
        if (y.length >= 10) {
          const top10 = [...y].sort((a, b) => b - a).slice(0, 10);
          top10.forEach((n, index) => {
            const xValue = `${x[y.indexOf(n)]}`;
            const yValue = n;
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
    [dispatchMarks, settings]
  );

  const handleRestore = () => {
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Peak', 'Double', 'Multiple'] });
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Harmonic'] });
    reset();
  };

  return {
    handleClick,
    handleRefreshHarmonic,
    handleRefreshSideband,
    handleToggleMarks,
    handleRestore,
    marks,
    isTypeSideband: markType === 'Sideband',
    markType
  };
};

export const useDatazoom = () => {
  const ref = useChartContext();
  const datazoom = ref.current.getInstance()?.getOption()?.dataZoom;
  return datazoom;
};

export const getLineStyles = (markType: MarkType, formatter?: string) => {
  return {
    label: formatter ? { formatter } : { show: false },
    // symbol: ['arrow'],
    // symbolOffset: [0, 50],
    // symbolOffset: ref.current.getInstance()?.convertToPixel({ seriesIndex: 0 }, coord),
    itemStyle: { color: getMarkTypeColor(markType) }
  };
};
