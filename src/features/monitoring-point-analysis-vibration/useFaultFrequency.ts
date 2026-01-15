import React from 'react';
import request from 'utils/request';

export type FaultFrequency = { bpfo: number; bpfi: number; bsf: number; ftf: number };

export const useFaultFrequency = (id: number, timestamp: number) => {
  const [loading, setLoading] = React.useState(false);
  const [faultFrequency, setFaultFrequency] = React.useState<FaultFrequency | undefined>();
  React.useEffect(() => {
    const fetchFaultFrequency = async () => {
      setLoading(true);
      try {
        const { data } = await request.get<{ features: FaultFrequency } | undefined>(
          `monitoringPoints/${id}/diagnosis/${timestamp}`
        );
        const frequency = data.data?.features;
        setFaultFrequency(
          frequency
            ? {
                bpfo: frequency.bpfo,
                bpfi: frequency.bpfi,
                bsf: frequency.bsf,
                ftf: frequency.ftf
              }
            : undefined
        );
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchFaultFrequency();
  }, [id, timestamp]);

  return { faultFrequency, loading };
};
