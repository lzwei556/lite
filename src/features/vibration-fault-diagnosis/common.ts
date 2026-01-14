import { useLocaleContext } from 'localeProvider/context';
import { FaultType } from 'common';
import { Key, HealthStatus } from './health-status';
import intl from 'react-intl-universal';
import request from 'utils/request';
import { GetResponse } from 'utils/response';
import { useRequest } from 'ahooks';

export type FaultDiagnosis = {
  assetId: number;
  conclusion: number;
  components: {
    componentId: number;
    healthIndex: number;
    status: HealthStatus;
    faultTypes: number[];
  }[];
  healthIndex: number;
  status: HealthStatus;
  timestamp: number;
};

type FaultDiagnosisDTO = {
  assetId: number;
  components: {
    componentId: number;
    monitoringPointId: number;
    diagnosisResults: {
      items?: { diagnosis: number; confidence: 1 | 2 | 3 | 4 }[];
    };
    score: number;
    status: number;
  }[];
  conclusion: string;
  score: number;
  status: number;
  timestamp: number;
};

export const useAssetDiagnosis = (id: number, enabled: boolean) => {
  const { loading, data } = useRequest(getAssetDiagnosis, { defaultParams: [id], ready: enabled });
  return { loading, data: data ? transform(data) : data };
};

const transform = (dto: FaultDiagnosisDTO): FaultDiagnosis => {
  const { assetId, timestamp, status, score, components } = dto;
  return {
    assetId,
    components: components.map((c) => {
      return {
        componentId: c.componentId,
        healthIndex: c.score,
        status: Key.get(c.status),
        faultTypes: (c.diagnosisResults?.items ?? []).reduce(
          (prev, crt) => [...prev, crt.diagnosis],
          [] as number[]
        )
      };
    }),
    conclusion: 1,
    healthIndex: score,
    status: Key.get(status),
    timestamp
  };
};

const getAssetDiagnosis = async (id: number) => {
  return await request
    .get<FaultDiagnosisDTO>(`/assets/${id}/latestDiagnosisReport`)
    .then(GetResponse);
};

export const useHealthStatus = ({
  status,
  faultTypes = []
}: {
  status: HealthStatus;
  faultTypes?: number[];
}) => {
  const { language } = useLocaleContext();
  const separator = language === 'en-US' ? '; ' : '；';
  const types = flattenFaultTypes(faultTypes);

  return {
    healthy: {
      status,
      label: intl.get('diagnosis.health')
    },
    description: {
      label: intl.get('diagnosis.description'),
      children:
        status.key === 0
          ? intl.get('NONE')
          : types.map((type) => intl.get(FaultType.Key.get(type.key).label)).join(separator)
    },
    suggestion: {
      label: intl.get('diagnosis.suggestion'),
      children:
        status.key === 0
          ? intl.get('NONE')
          : // : types.map((type) => intl.get(type.suggestion)).join(separator)
            ''
    }
  };
};

export const flattenFaultTypes = (types: number[]) => {
  return Array.from(new Set(types)).map(FaultType.Key.get);
};
