import { useLocaleContext } from 'localeProvider/context';
import { FaultType } from 'common';
import { Key, HealthStatus } from './health-status';
import intl from 'react-intl-universal';
import request from 'utils/request';
import { GetResponse } from 'utils/response';
import { useRequest } from 'ahooks';

enum Confidence {
  Slight = 1,
  Minor,
  Major,
  Critical
}

enum Axis {
  None,
  Axial,
  Horizontal,
  Vertical
}

const getAxisLabel = (axis: Axis) =>
  axis === Axis.None ? '' : intl.get(`axis.${Axis[axis].toLowerCase()}.abbr`);

export type Fault = { type: number; confidence: Confidence; axis: Axis };

type Zone = 'A' | 'B' | 'C' | 'D';

export type FaultDiagnosis = {
  assetId: number;
  conclusion: string;
  components: {
    componentId: number;
    healthIndex: number;
    status: HealthStatus;
    faults: Fault[];
    iso?: {
      zone: Zone;
      recommendation: string;
      zoneBoundaries: [number, number, number];
      data: [number, number, number];
    };
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
      items?: (Fault & { diagnosis: number })[];
    };
    score: number;
    status: number;
    vibrationISOResult?: {
      zone: Zone;
      zoneBoundaries: [number, number, number];
      recommendation: string;
      status: 0 | 1 | 2;
      data: [number, number, number];
    };
  }[];
  conclusion: string;
  score: number;
  status: number;
  timestamp: number;
};

export const useAssetDiagnosis = (id: number, enabled: boolean, living: boolean) => {
  const { loading, data } = useRequest(getAssetDiagnosis, {
    defaultParams: [id],
    ready: enabled,
    pollingInterval: living ? 10000 : 0
  });
  return { loading, data: data ? transform(data) : data };
};

const transform = (dto: FaultDiagnosisDTO): FaultDiagnosis => {
  const { assetId, timestamp, status, score, components } = dto;
  return {
    assetId,
    components: components.map((c) => {
      const { componentId, score, status, diagnosisResults, vibrationISOResult } = c;
      return {
        componentId,
        healthIndex: score,
        status: Key.get(status),
        faults: (diagnosisResults?.items ?? []).reduce(
          (prev, crt) => [
            ...prev,
            { type: crt.diagnosis, confidence: crt.confidence, axis: crt.axis }
          ],
          [] as Fault[]
        ),
        iso: vibrationISOResult
      };
    }),
    conclusion: dto.conclusion,
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
  faults = []
}: {
  status: HealthStatus;
  faults?: Fault[];
}) => {
  const { language } = useLocaleContext();
  const separator = language === 'en-US' ? '; ' : '；';
  const types = flattenFaultTypes(faults.map((f) => f.type));

  return {
    healthy: {
      status,
      label: intl.get('diagnosis.health')
    },
    description: {
      label: intl.get('diagnosis.description'),
      children:
        status.key === 0 && types.length === 0
          ? intl.get('NONE')
          : types.map((type) => intl.get(FaultType.Key.get(type.key).label)).join(separator)
    },
    descriptionWithConfidence: {
      label: intl.get('diagnosis.description'),
      children:
        status.key === 0 && types.length === 0
          ? intl.get('NONE')
          : faults.map(({ type, confidence, axis }) => {
              const typeLabel = intl.get(FaultType.Key.get(type).label);
              const axisLabel = getAxisLabel(axis);
              const confidenceLabel = intl.get(
                `fault.confidence.${Confidence[confidence].toLowerCase()}`
              );
              return (
                axisLabel.length > 0
                  ? [typeLabel, axisLabel, confidenceLabel]
                  : [typeLabel, confidenceLabel]
              ).join(' / ');
            })
    }
    // suggestion: {
    //   label: intl.get('diagnosis.suggestion'),
    //   children: status.key === 0 ? intl.get('NONE') : intl.get(conclusion)
    // }
  };
};

export const flattenFaultTypes = (types: number[]) => {
  return Array.from(new Set(types)).map(FaultType.Key.get);
};
