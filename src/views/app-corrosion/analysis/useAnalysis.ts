import React from 'react';
import { floor } from 'lodash';
import { Dayjs } from '../../../utils';
import { ColorHealth } from '../../../constants/color';
import {
  getThicknessAnalysis,
  HistoryData,
  MonitoringPointRow,
  ThicknessAnalysis
} from '../../asset-common';

export type Range = [number, number];
type Line = [start: [string, number], end: [string, number]];
export type AnalysisResult = {
  line: Line;
  rate: number;
  life: number;
};

export const isCriticalThicknessValid = (attributes: MonitoringPointRow['attributes']) =>
  attributes?.critical_thickness && attributes?.critical_thickness_enabled;

export const isInitialThicknessValid = (attributes: MonitoringPointRow['attributes']) =>
  attributes?.initial_thickness && attributes?.initial_thickness_enabled;

export const getDefaultLines = (attributes: MonitoringPointRow['attributes']) => {
  const lines = [];
  if (isInitialThicknessValid(attributes)) {
    lines.push({
      name: 'INITIAL_THICKNESS',
      yAxis: attributes?.initial_thickness,
      lineStyle: { color: ColorHealth }
    });
  }
  if (isCriticalThicknessValid(attributes)) {
    lines.push({
      name: 'CRITICAL_THICKNESS',
      yAxis: attributes?.critical_thickness,
      lineStyle: { color: ColorHealth }
    });
  }
  return lines;
};

export const useAnalysisData = (id: number, range: Range) => {
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryData>();
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult>();
  React.useEffect(() => {
    if (range && range[0] && range[1]) {
      setLoading(true);
      getThicknessAnalysis(id, range[0], range[1])
        .then((data) => {
          setHistory(data.data);
          setAnalysisResult(transformAnalysis(data));
        })
        .finally(() => setLoading(false));
    }
  }, [id, range]);
  return { loading, history, analysisResult };
};

export function transformAnalysis(origin: {
  data: HistoryData;
  analysisResult: ThicknessAnalysis;
}): AnalysisResult {
  if (!origin || !origin.data || origin.data.length === 0 || !origin.analysisResult)
    return {
      line: [
        ['', 0],
        ['', 0]
      ],
      rate: -1,
      life: -1
    };
  const { analysisResult } = origin;
  const { k_all, b_all, corrosion_rate_all, residual_life_all } = analysisResult;
  const times = origin.data.map(({ timestamp }) => timestamp);
  const end = times[times.length - 1];
  // algorithm: y = kx+b
  return {
    line: [times[0], end].map((x) => [
      Dayjs.format(x),
      corrosion_rate_all === 0 ? 'max' : k_all * x + b_all
    ]) as Line,
    rate: corrosion_rate_all,
    life: residual_life_all
  };
}

export function useAreas(id: number, ranges: string) {
  const [selecteds, setSelecteds] = React.useState<(AnalysisResult & { range: Range })[]>([]);
  React.useEffect(() => {
    const _ranges = JSON.parse(ranges) as Range[];
    if (_ranges.length > 0) {
      const fetchs = _ranges.map((range) => getThicknessAnalysis(id, range[0], range[1]));
      Promise.all(fetchs).then((datas) =>
        setSelecteds(datas.map((data, i) => ({ ...transformAnalysis(data), range: _ranges[i] })))
      );
    } else {
      setSelecteds([]);
    }
  }, [id, ranges]);
  return selecteds;
}

export function getDurationByDays(days: number): {
  duration: number;
  unit: 'UNIT_DAY' | 'UNIT_YEAR';
} {
  if (days < 365) {
    return { duration: days, unit: 'UNIT_DAY' };
  }
  return { duration: floor(days / 365, 1), unit: 'UNIT_YEAR' };
}
