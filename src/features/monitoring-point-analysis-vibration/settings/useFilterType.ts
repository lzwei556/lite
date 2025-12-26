import React from 'react';

export type FilterTypeRelatedFields = {
  cutoff_range_low?: number;
  cutoff_range_high?: number;
  filter_type?: number;
  filter_order?: number;
};

const filter_order: Item = {
  label: 'chart.filter.order',
  name: 'filter_order'
};
const filter_type: Item = {
  label: 'chart.filter.type',
  name: 'filter_type',
  options: [
    { label: 'chart.filter.type.high', value: 0 },
    { label: 'chart.filter.type.low', value: 1 },
    { label: 'chart.filter.type.band', value: 2 }
  ]
};
const cutoff_range_low: Item = {
  label: 'cutoff.range.low',
  name: 'cutoff_range_low'
};
const cutoff_range_high: Item = {
  label: 'cutoff.range.high',
  name: 'cutoff_range_high'
};

export const filterTypeRelatedFieldsDefault: FilterTypeRelatedFields = {
  cutoff_range_low: 5,
  cutoff_range_high: 100,
  filter_type: 2,
  filter_order: 100
};

export type CutoffRange = [low: number, high: number];
type SetCutoffRange = ([low, high]: CutoffRange) => void;
type SetCutoffRangeHidden = ([low, high]: [low: boolean, high: boolean]) => void;

export type Item = {
  label?: string;
  name?: keyof FilterTypeRelatedFields;
  options?: { label: string; value: number | string }[];
  hidden?: boolean;
};
export type RangeItem = {
  label?: string;
  range: [Item, Item];
};

export const useFilterTypeRelatedItems = (setCutoffRange: SetCutoffRange, initial: CutoffRange) => {
  const items: (Item | RangeItem)[] = [];
  const [cutoffRangeHidden, SetCutoffRangeHidden] = React.useState(getHiddenOfRange(initial));
  const filterTypeRelatedFields = useFilterTypeRelatedFields(
    setCutoffRange,
    SetCutoffRangeHidden,
    initial
  );
  const [low, high] = cutoffRangeHidden;
  items.push(...filterTypeRelatedFields);
  if (low === false && high === false) {
    items.push({ range: [cutoff_range_low, cutoff_range_high] });
  } else {
    items.push({
      ...cutoff_range_low,
      hidden: low
    });
    items.push({
      ...cutoff_range_high,
      hidden: high
    });
  }
  items.push(filter_order);
  return items;
};

const useFilterTypeRelatedFields = (
  setCutoffRange: SetCutoffRange,
  SetCutoffRangeHidden: SetCutoffRangeHidden,
  initial: CutoffRange
) => {
  const [type, setType] = React.useState(2);
  const filterTypeField = {
    ...filter_type,
    onChange: (val: number) => {
      setType(val);
      setCutoffRange(initial);
      if (val === 0) {
        SetCutoffRangeHidden([false, true]);
      } else if (val === 1) {
        SetCutoffRangeHidden([true, false]);
      } else if (val === 2) {
        const [low, high] = initial;
        const hidden =
          (low === 5 && high === 100) ||
          (low === 50 && high === 1000) ||
          (low === 500 && high === 12820) ||
          (low === 1 && high === 12820);
        SetCutoffRangeHidden([hidden, hidden]);
      }
    }
  };
  const frequencyBand = useFrequencyBand(setCutoffRange, SetCutoffRangeHidden, initial);
  return type === 2 ? [filterTypeField, frequencyBand] : [filterTypeField];
};

const useFrequencyBand = (
  setCutoffRange: SetCutoffRange,
  SetCutoffRangeHidden: SetCutoffRangeHidden,
  initial: CutoffRange
) => {
  return {
    label: 'frequency.band',
    options: [
      { label: 'frequency.band.5-100Hz', value: 1 },
      { label: 'frequency.band.50-1000Hz', value: 2 },
      { label: 'frequency.band.500-12820Hz', value: 3 },
      { label: 'full.frequency.band', value: 4 },
      { label: 'custom.frequency.band', value: 5 }
    ],
    onChange: (val: number) => {
      SetCutoffRangeHidden([true, true]);
      if (val === 1) {
        setCutoffRange([5, 100]);
      } else if (val === 2) {
        setCutoffRange([50, 1000]);
      } else if (val === 3) {
        setCutoffRange([500, 12820]);
      } else if (val === 4) {
        setCutoffRange([1, 12820]);
      } else if (val === 5) {
        setCutoffRange(initial);
        SetCutoffRangeHidden([false, false]);
      }
    },
    defaultValue: mapRangeToOptionValue(initial)
  };
};

const mapRangeToOptionValue = (cutoffRange: CutoffRange) => {
  const [low, high] = cutoffRange;
  if (low === 5 && high === 100) {
    return 1;
  } else if (low === 50 && high === 1000) {
    return 2;
  } else if (low === 500 && high === 12820) {
    return 3;
  } else if (low === 1 && high === 12820) {
    return 4;
  } else {
    return 5;
  }
};

const getHiddenOfRange = (cutoffRange: CutoffRange) => {
  const value = mapRangeToOptionValue(cutoffRange);
  return value === 5 ? [false, false] : [true, true];
};
