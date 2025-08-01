import { useRange } from '../../components';
import { useStore } from '../../hooks/store';
import { Device } from '../../types/device';
import { Dayjs } from '../../utils';

export type SelectedDeviceRangeProps = {
  range: Dayjs.RangeValue;
  numberedRange: Dayjs.Range;
  onChange: (range: Dayjs.RangeValue) => void;
};

export const useSelectedDeviceRange = (device?: Device, initialRange?: Dayjs.RangeValue) => {
  const [store, setStore] = useStore('selectedDevice');
  const selected = device?.macAddress === store.mac && store.range ? store.range : undefined;
  const { range, numberedRange, setRange } = useRange(initialRange);

  return {
    store,
    setStore,
    selectedDeviceRange: {
      range: selected ? Dayjs.toRangeValue(selected) : range,
      numberedRange: selected ?? numberedRange,
      onChange: (range: Dayjs.RangeValue) => {
        setRange(range);
        setStore((prev) => ({ ...prev, range: Dayjs.toRange(range) }));
      }
    }
  };
};
