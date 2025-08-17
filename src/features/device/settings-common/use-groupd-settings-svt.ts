import React from 'react';
import { DeviceType } from '../../../types/device_type';
import { DeviceSetting, GROUPS } from './common';

export const useGroupedSettings = (settings: DeviceSetting[], deviceType?: DeviceType) => {
  const mounting_type = settings?.find((s) => s.key === 'mounting_type');
  const disp_mode = settings?.find((s) => s.key === 'disp_mode');
  const base_frequency = settings?.find((s) => s.key === 'base_frequency');
  const communication_period = settings?.find((s) => s.key === 'communication_period');
  const communication_offset = settings?.find((s) => s.key === 'communication_offset');
  const sample_period = settings?.find((s) => s.key === 'sample_period');
  const sample_offset = settings?.find((s) => s.key === 'sample_offset');
  const { mode, action, fields } = useAcquisitionModeRelatedFields(settings);
  const settingsFields: DeviceSetting[] = [...fields];
  if (mounting_type) {
    settingsFields.push({ ...mounting_type, group: GROUPS.basic });
  }
  if (disp_mode) {
    settingsFields.push({ ...disp_mode, group: GROUPS.basic });
  }
  if (base_frequency) {
    settingsFields.push({ ...base_frequency, group: GROUPS.basic });
  }
  if (communication_period) {
    settingsFields.push({ ...communication_period, group: GROUPS.basic });
  }
  if (communication_offset) {
    settingsFields.push({ ...communication_offset, group: GROUPS.basic });
  }
  const commonSampleRelatedFields: DeviceSetting[] = [];
  if (sample_period) {
    commonSampleRelatedFields.push({ ...sample_period, group: GROUPS.dat });
  }
  if (sample_offset) {
    commonSampleRelatedFields.push({ ...sample_offset, group: GROUPS.dat });
  }
  const sampleRelatedFields = useSampleRelatedFields(deviceType, settings);
  const waveRelatedFields = useWaveRealtedFields(mode, action, settings);
  if (mode !== 1) {
    settingsFields.push(...commonSampleRelatedFields, ...sampleRelatedFields, ...waveRelatedFields);
  } else if (action === 2) {
    settingsFields.push(...sampleRelatedFields);
  } else if (action === 4) {
    settingsFields.push(...waveRelatedFields);
  }
  if (!settings || settings.length === 0) return [];

  return Array.from(new Set(settingsFields.map((s) => s?.group!)))
    .sort((g1, g2) => {
      return Object.values(GROUPS).indexOf(g1!) - Object.values(GROUPS).indexOf(g2!);
    })
    .map((group) => {
      return { group, settings: settingsFields.filter((s) => s?.group === group) };
    });
};

function useAcquisitionModeRelatedFields(settings?: DeviceSetting[]) {
  const acquisition_mode = settings?.find((s) => s.key === 'acquisition_mode');
  const trigger_action = settings?.find((s) => s.key === 'trigger_action');
  const on_threshold = settings?.find((s) => s.key === 'on_threshold');
  const off_threshold = settings?.find((s) => s.key === 'off_threshold');
  const trigger_period = settings?.find((s) => s.key === 'trigger_period');
  const trigger_delay = settings?.find((s) => s.key === 'trigger_delay');
  const trigger_silent_period = settings?.find((s) => s.key === 'trigger_silent_period');
  const trigger_acquisition_count = settings?.find((s) => s.key === 'trigger_acquisition_count');
  const [mode, setMode] = React.useState<number>(acquisition_mode ? acquisition_mode.value : 0);
  const [action, setAction] = React.useState<number>(trigger_action ? trigger_action.value : 2);

  const fields: DeviceSetting[] = [];
  if (!settings || settings.length === 0 || !acquisition_mode) return { mode, action, fields };
  fields.push({ ...acquisition_mode, onChange: setMode });
  if (mode !== 0) {
    if (trigger_action) {
      fields.push({ ...trigger_action, onChange: setAction });
    }
    if (on_threshold) {
      fields.push(on_threshold);
    }
    if (off_threshold) {
      fields.push(off_threshold);
    }
    if (trigger_period) {
      fields.push(trigger_period);
    }
    if (trigger_delay) {
      fields.push(trigger_delay);
    }
    if (trigger_silent_period) {
      fields.push(trigger_silent_period);
    }
    if (trigger_acquisition_count) {
      fields.push(trigger_acquisition_count);
    }
  }

  return {
    mode,
    action,
    fields: fields.map((f) => ({ ...f, group: GROUPS.dat }))
  };
}

function useSampleRelatedFields(type?: DeviceType, settings?: DeviceSetting[]) {
  const acc3_range = settings?.find((s) => s.key === 'acc3_range');
  const acc3_odr = settings?.find((s) => s.key === 'acc3_odr');
  const acc3_samples = settings?.find((s) => s.key === 'acc3_samples');
  const acc1_odr = settings?.find((s) => s.key === 'acc1_odr');
  const acc1_samples = settings?.find((s) => s.key === 'acc1_samples');
  const fields: DeviceSetting[] = [];
  if (acc3_range) {
    fields.push(acc3_range);
  }
  if (acc3_odr) {
    fields.push(acc3_odr);
  }
  if (acc3_samples) {
    fields.push(acc3_samples);
  }
  if (type === DeviceType.SVT220520P || type === DeviceType.SVT520C) {
    if (acc1_odr) {
      fields.push(acc1_odr);
    }
    if (acc1_samples) {
      fields.push(acc1_samples);
    }
  }
  if (!settings || settings.length === 0) return [];
  return fields.map((f) => ({ ...f, group: GROUPS.dap } as DeviceSetting));
}

function useWaveRealtedFields(mode: number, triggerAction: number, settings?: DeviceSetting[]) {
  const is_enabled_2 = settings?.find((s) => s.key === 'is_enabled_2');
  const isWaveformOnce = mode === 1 && triggerAction === 4;
  const [enabled, setEnabled] = React.useState(is_enabled_2 ? is_enabled_2.value : false);
  let enabledField: DeviceSetting | undefined;
  const waveFields: DeviceSetting[] = [];
  const waveFields2 = useWaveRealtedFields2(enabled, 3, settings) ?? [];
  const waveFields3 = useWaveRealtedFields2(enabled, 4, settings) ?? [];
  if (is_enabled_2 && is_enabled_2.children && is_enabled_2.children.length > 0) {
    enabledField = { ...is_enabled_2, onChange: setEnabled, group: GROUPS.dat };
    const sample_period_2 = is_enabled_2.children.find((s) => s.key === 'sample_period_2');
    const sample_offset_2 = is_enabled_2.children.find((s) => s.key === 'sample_offset_2');
    const acc3_range_2 = is_enabled_2.children.find((s) => s.key === 'acc3_range_2');
    const acc3_odr_2 = is_enabled_2.children.find((s) => s.key === 'acc3_odr_2');
    const acc3_samples_2 = is_enabled_2.children.find((s) => s.key === 'acc3_samples_2');
    const acc1_odr_2 = is_enabled_2.children.find((s) => s.key === 'acc1_odr_2');
    const acc1_samples_2 = is_enabled_2.children.find((s) => s.key === 'acc1_samples_2');
    const triaxial_sample_points_2 = is_enabled_2.children.find(
      (s) => s.key === 'triaxial_sample_points_2'
    );
    const uniaxial_sample_points_2 = is_enabled_2.children.find(
      (s) => s.key === 'uniaxial_sample_points_2'
    );
    const data_axis = is_enabled_2.children.find((s) => s.key === 'data_axis');
    if (sample_period_2) {
      waveFields.push({ ...sample_period_2, group: GROUPS.dat });
    }
    if (sample_offset_2) {
      waveFields.push({ ...sample_offset_2, group: GROUPS.dat });
    }
    if (acc3_range_2) {
      waveFields.push({ ...acc3_range_2, group: GROUPS.dap });
    }
    if (acc3_odr_2) {
      waveFields.push({ ...acc3_odr_2, group: GROUPS.dap });
    }
    if (acc3_samples_2) {
      waveFields.push({ ...acc3_samples_2, group: GROUPS.dap });
    }
    if (triaxial_sample_points_2) {
      waveFields.push({ ...triaxial_sample_points_2, group: GROUPS.dap });
    }
    if (acc1_odr_2) {
      waveFields.push({ ...acc1_odr_2, group: GROUPS.dap });
    }
    if (acc1_samples_2) {
      waveFields.push({ ...acc1_samples_2, group: GROUPS.dap });
    }
    if (uniaxial_sample_points_2) {
      waveFields.push({ ...uniaxial_sample_points_2, group: GROUPS.dap });
    }
    if (data_axis) {
      waveFields.push({ ...data_axis, group: GROUPS.dap });
    }
  }
  if (!settings || settings.length === 0) return [];
  if (isWaveformOnce) {
    return waveFields
      .filter((s) => s.key !== 'sample_period_2' && s.key !== 'sample_offset_2')
      .concat([...waveFields2, ...waveFields3]);
  } else if (enabledField) {
    return enabled ? [enabledField, ...waveFields, ...waveFields2, ...waveFields3] : [enabledField];
  } else {
    return [];
  }
}

function useWaveRealtedFields2(enabled1: boolean, suffix: number, settings?: DeviceSetting[]) {
  const is_enabled = settings?.find((s) => s.key === `is_enabled_${suffix}`);
  let enabledField: DeviceSetting | undefined;
  const [enabled, setEnabled] = React.useState(is_enabled ? enabled1 && is_enabled.value : false);
  const waveFields: DeviceSetting[] = [];
  if (is_enabled && is_enabled.children && is_enabled.children.length > 0) {
    enabledField = { ...is_enabled, onChange: setEnabled, group: GROUPS.dat };
    const acc3_range = is_enabled.children.find((s) => s.key === `acc3_range_${suffix}`);
    const acc3_odr = is_enabled.children.find((s) => s.key === `acc3_odr_${suffix}`);
    const acc3_samples = is_enabled.children.find((s) => s.key === `acc3_samples_${suffix}`);
    const triaxial_sample_points = is_enabled.children.find(
      (s) => s.key === `triaxial_sample_points_${suffix}`
    );
    const acc1_odr = is_enabled.children.find((s) => s.key === `acc1_odr_${suffix}`);
    const acc1_samples = is_enabled.children.find((s) => s.key === `acc1_samples_${suffix}`);
    const uniaxial_sample_points = is_enabled.children.find(
      (s) => s.key === `uniaxial_sample_points_${suffix}`
    );
    if (acc3_range) {
      waveFields.push({ ...acc3_range, group: GROUPS.dap });
    }
    if (acc3_odr) {
      waveFields.push({ ...acc3_odr, group: GROUPS.dap });
    }
    if (acc3_samples) {
      waveFields.push({ ...acc3_samples, group: GROUPS.dap });
    }
    if (triaxial_sample_points) {
      waveFields.push({ ...triaxial_sample_points, group: GROUPS.dap });
    }
    if (acc1_odr) {
      waveFields.push({ ...acc1_odr, group: GROUPS.dap });
    }
    if (acc1_samples) {
      waveFields.push({ ...acc1_samples, group: GROUPS.dap });
    }
    if (uniaxial_sample_points) {
      waveFields.push({ ...uniaxial_sample_points, group: GROUPS.dap });
    }
    return enabled ? [enabledField, ...waveFields] : [enabledField];
  }
}
