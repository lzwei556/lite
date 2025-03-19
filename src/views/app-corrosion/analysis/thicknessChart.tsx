import React from 'react';
import intl from 'react-intl-universal';
import dayjs from '../../../utils/dayjsUtils';
import { DisplayProperty } from '../../../constants/properties';
import { roundValue } from '../../../utils/format';
import { ChartMark } from '../../../components';
import { getThicknessAnalysis, HistoryData, MonitoringPointRow } from '../../asset-common';
import { HistoryDataFea } from '../../../features';
import { getDefaultLines, transformAnalysis } from './useAnalysis';

export const ThicknessChart = (
  props: MonitoringPointRow & { history?: HistoryData; property: DisplayProperty }
) => {
  const { marks, visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { history, property, id, attributes } = props;
  const { series: initialSeries, min, max } = HistoryDataFea.transform(history, property);
  const defaultSeries = initialSeries.map((s) => ({
    ...s,
    raw: { animation: false, markLine: getMarkLine() }
  }));
  function getMarkLine() {
    const data = getDefaultLines(attributes)?.map((line) => ({
      ...line,
      label: { distance: [-60, 60], formatter: `${intl.get(line.name!)} {c}` }
    }));
    return { symbol: 'none', data };
  }

  return (
    <ChartMark.Chart
      cardProps={{
        title: intl.get('OBJECT_TREND_CHART', {
          object: intl.get(property.name)
        })
      }}
      config={{ opts: { yAxis: { name: property.unit } } }}
      series={ChartMark.mergeMarkDatas(defaultSeries, visibledMarks)}
      onEvents={{
        brushEnd: (areaCoords: [number, number][]) => {
          const areaValues = areaCoords.map(([start, end]) => {
            const timestamps = history!.map(({ timestamp }) => timestamp);
            return [timestamps[start], timestamps[end]];
          });
          if (areaValues.length > 0) {
            const fetchs = areaValues.map((range) => getThicknessAnalysis(id, range[0], range[1]));
            Promise.all(fetchs).then((datas) => {
              datas.forEach((data, i) => {
                const { line, rate } = transformAnalysis(data);
                dispatchMarks({
                  type: 'append_multiple',
                  mark: {
                    name: areaCoords[i].join(),
                    data: line,
                    value: rate,
                    dataProps: {
                      valueFormatter: (rate) => `${intl.get('FIELD_CORROSION_RATE')} ${rate} mm/a`,
                      lineStyle: { color: '#fa8c16', width: 3, type: 'solid' }
                    },
                    description: `${areaValues[i]
                      .map((t) => dayjs.unix(t).format('YYYY-MM-DD HH:mm:ss'))
                      .join()}`
                  }
                });
              });
            });
          }
        },
        click: ([x, y]: [x: string, y: number]) => {
          dispatchMarks({
            type: 'append_multiple',
            mark: { name: `${x}${y}`, data: [x, y], value: roundValue(y), description: x }
          });
        }
      }}
      style={{ height: 600 }}
      toolbar={{
        onEnableAreaSelection: (ins) => {
          ChartMark.brushAreas(marks, ins);
        }
      }}
      yAxisMeta={{ ...property, min, max }}
    />
  );
};
