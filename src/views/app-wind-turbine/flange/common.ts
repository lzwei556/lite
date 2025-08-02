import { AssetRow } from '../../asset-common';

export function isFlangePreloadCalculation(flange?: AssetRow) {
  return flange?.attributes?.sub_type === 1;
}
export const categories = [
  { label: 'TOWER', value: 1 },
  { label: 'BLADE', value: 2 },
  { label: 'HUB_AND_NACELLE', value: 3 },
  { label: 'PITCH_BEARING', value: 4 }
];

export const mergeAttrsAboutFlangePreload = (
  values: AssetRow['attributes'],
  attrs: AssetRow['attributes']
) => {
  let res = values;
  if (!res?.monitoring_points_num && attrs?.monitoring_points_num) {
    //@ts-ignore
    res = { ...res, monitoring_points_num: attrs.monitoring_points_num };
  }
  if (!res?.sample_period && attrs?.sample_period) {
    //@ts-ignore
    res = { ...res, sample_period: attrs?.sample_period };
  }
  if (!res?.sample_time_offset && attrs?.sample_time_offset) {
    //@ts-ignore
    res = { ...res, sample_time_offset: attrs.sample_time_offset };
  }
  if (!res?.initial_preload && attrs?.initial_preload) {
    //@ts-ignore
    res = { ...res, initial_preload: attrs.initial_preload };
  }
  if (!res?.initial_pressure && attrs?.initial_pressure) {
    //@ts-ignore
    res = { ...res, initial_pressure: attrs.initial_pressure };
  }
  return res;
};
