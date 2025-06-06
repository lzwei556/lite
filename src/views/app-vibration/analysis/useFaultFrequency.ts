import React from 'react';
import request from '../../../utils/request';
import { MotorAttrs } from '../../asset-variant';

export type FaultFrequency = { bpfo: number; bpfi: number; bsf: number; ftf: number };

export const useFaultFrequency = (attrs: MotorAttrs) => {
  const [loading, setLoading] = React.useState(false);
  const [faultFrequency, setFaultFrequency] = React.useState<FaultFrequency | undefined>();
  React.useEffect(() => {
    const fetchFaultFrequency = async (attrs: MotorAttrs) => {
      setLoading(true);
      try {
        const res = await request.put<FaultFrequency>('algo/bearingFaultFrequency', {
          n: attrs.rolling_elements_num,
          d: attrs.rolling_elements_diameter,
          d2: attrs.pitch_circle_diameter,
          angle: attrs.contact_angle,
          mode: attrs.rotation_mode,
          rpm: attrs.rotation_speed
        });
        setFaultFrequency(res.data.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    if (
      attrs &&
      attrs.rolling_elements_num &&
      attrs.rolling_elements_diameter &&
      attrs.pitch_circle_diameter &&
      attrs.contact_angle &&
      attrs.rotation_mode &&
      attrs.rotation_speed
    ) {
      fetchFaultFrequency(attrs);
    }
  }, [attrs]);

  return { faultFrequency, loading };
};
