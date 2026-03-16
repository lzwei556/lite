import React from 'react';
import { Translation } from 'locales/utils';
import { Dayjs } from '../../utils';
import { roundValue } from '../../utils/format';
import { ChartBrush, ChartMark, useChartContext } from '../../components';
import { getThicknessAnalysis, HistoryData, MonitoringPointRow } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import { HistoryDataFea } from '..';
import { getDefaultLines, transformAnalysis } from './useAnalysis';
import { CharacteristicData, CorrosionAttributes } from 'common';
import { Toolbar } from './toolbar';
import { MarkType } from '.';

export const ThicknessChart = (
  props: MonitoringPointRow & {
    history?: HistoryData;
    property: CharacteristicData.DisplayProperty;
    markType: MarkType;
    setMarkType: React.Dispatch<React.SetStateAction<MarkType>>;
    onDispatchMark?: () => void;
  }
) => {
  const ref = useChartContext();
  const { marks, dispatchMarks } = ChartMark.useContext();
  const { history, property, id, attributes, markType, setMarkType, onDispatchMark } = props;
  const { series: initialSeries, min, max } = HistoryDataFea.transform(history, property);
  const { colorWarningStyle } = useGlobalStyles();
  const defaultSeries = initialSeries.map((s) => ({
    ...s,
    raw: { animation: false, markLine: getMarkLine() }
  }));
  const visibledMarks = marks.filter((mark) => mark.type === markType);

  function getMarkLine() {
    const data = getDefaultLines(attributes as CorrosionAttributes)?.map((line) => ({
      ...line,
      label: {
        position: 'insideEndBottom' as 'insideEndBottom',
        formatter: `${Translation.get(line.name!)} {c}`
      }
    }));
    return { symbol: 'none', data };
  }

  const reset = () => {
    setMarkType('point');
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.clear_areas);
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.disable);
  };

  const enableAreaMark = () => {
    setMarkType('area');
    ref.current.getInstance()?.dispatchAction(ChartBrush.ActionPayload.enable);
    ChartMark.brushAreas(marks, ref.current.getInstance());
  };

  const restoreHandle = () => {
    reset();
    dispatchMarks({ type: 'clear' });
  };

  return (
    <ChartMark.Chart
      cardProps={{
        title: Translation.get('label.title.trend.sth', {
          object: Translation.get(property.name)
        })
      }}
      config={{ opts: { yAxis: { name: property.unit } } }}
      features={{
        restore: { onClick: restoreHandle },
        saveAsImage: {}
      }}
      series={ChartMark.useMergeMarkDatas({ series: defaultSeries, marks: visibledMarks })}
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
                    value: rate === 0 ? `${rate}` : rate,
                    chartProps: {
                      label: {
                        lineHeight: 10,
                        position: 'middle',
                        formatterFn: (rate: number | string) => {
                          if (!rate || rate === '0') {
                            return `${Translation.get('corrosion.analysis.no')}`;
                          } else {
                            return `${Translation.get('FIELD_CORROSION_RATE')} ${rate} mm/a`;
                          }
                        }
                      },
                      lineStyle: { ...colorWarningStyle, width: 3, type: 'solid' }
                    },
                    description: `${areaValues[i].map((t) => Dayjs.format(t)).join()}`,
                    type: 'area'
                  }
                });
                onDispatchMark?.();
              });
            });
          }
        },
        click: ([x, y]: [x: string, y: number]) => {
          dispatchMarks({
            type: 'append_multiple',
            mark: {
              name: `${x}${y}`,
              data: [x, y],
              value: roundValue(y),
              description: x,
              type: 'point'
            }
          });
          onDispatchMark?.();
        }
      }}
      style={{ height: 600 }}
      toolbars={[
        <Toolbar
          point={{ onClick: reset }}
          area={{ onClick: enableAreaMark }}
          markType={markType}
        />
      ]}
      yAxisMeta={{ ...property, min, max }}
    />
  );
};
