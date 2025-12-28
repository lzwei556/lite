import { useLocaleContext } from 'localeProvider/context';
import { getValue, roundValue } from 'utils';
import { ChartProps, getOptions } from 'components';
import intl from 'react-intl-universal';
import { MonitoringPointType } from 'common';
import { DIRECTION, TopInclination_DISPLACEMENT_COMBINED } from 'common/characteristic-data';
import { CharacteristicDataDTO } from '../../types';

const INCLINATION_OFFSET_PROPERTY = {
  displacement: {
    key: 'FIELD_DISPLACEMENT',
    label: 'FIELD_DISPLACEMENT',
    unit: TopInclination_DISPLACEMENT_COMBINED.unit!
  },
  direction: { key: DIRECTION.name, label: DIRECTION.name, unit: DIRECTION.unit! }
};

export type Props = { name: string; type: number; data: CharacteristicDataDTO };
type DataMeta = typeof INCLINATION_OFFSET_PROPERTY.displacement;
type InclinationOffsetDataMeta = [displacement: DataMeta, direction: DataMeta];
export type Data = {
  name: string;
  data: [displacement: number, direction: number][];
  height?: number;
  radius?: number;
  displacementKey: ReturnType<typeof MonitoringPointType.Key.getInclinationDisplacement>;
};

export const transform = (monitoringPoints: Props[]) => {
  return monitoringPoints.map(({ name, type, data }) => {
    const displacementKey = MonitoringPointType.Key.getInclinationDisplacement(type);
    return {
      name,
      data: pickData(data, displacementKey),
      displacementKey
    };
  });
};

const pickData = (history: CharacteristicDataDTO, displacementKey: string) => {
  const directions: number[] = [];
  const displacements: number[] = [];
  history.forEach(({ values }) => {
    values.forEach(({ data }) => {
      if (data[INCLINATION_OFFSET_PROPERTY.direction.key] != null) {
        directions.push(roundValue(data[INCLINATION_OFFSET_PROPERTY.direction.key], 2));
      }
      const key = `${INCLINATION_OFFSET_PROPERTY.displacement.key}_${displacementKey}`;
      if (data[key] !== undefined) {
        displacements.push(roundValue(data[key], 2));
      }
    });
  });
  if (displacements.length === 0 || directions.length === 0) {
    return [];
  } else {
    return displacements
      .map((data, index) => [data, directions[index]] as [number, number])
      .filter((d) => !Number.isNaN(d[0]));
  }
};

export const useCardTitleProps = (datas: Data[]) => {
  if (datas.length === 1) {
    const meta = getDataMeta(datas[0]);
    const { displacement, direction } = getMaxValue(datas[0].data);
    return [displacement, direction].map((value, i) => {
      const { label, unit } = meta[i];
      return {
        label,
        value,
        style: { display: 'flex', lineHeight: 1.35, fontSize: 14, fontWeight: 400 },
        displayValue: getValue({ value, unit })
      };
    });
  } else {
    return 'SCATTERGRAM';
  }
};

export const useChartProps = ({ datas, ...rest }: { datas: Data[] } & ChartProps) => {
  const options = usePolarScatterChartOptions(datas, datas.map(getDataMeta));
  return { ...rest, options };
};

const usePolarScatterChartOptions = (datas: Data[], dataMetas: InclinationOffsetDataMeta[]) => {
  const { language } = useLocaleContext();
  let max = undefined;
  const series: any = [];
  if (!datas || datas.length === 0) {
    return undefined;
  }
  datas.forEach(({ name, data, radius }) => {
    const displacements = data.map((item) => item[0]);
    series.push({
      type: 'scatter',
      coordinateSystem: 'polar',
      data,
      name,
      symbolSize: 6
    });
    max = getMaxRadius(displacements, radius ? 10 : undefined);
  });
  const onlyOneSeries = series.length === 1;

  return getOptions({
    legend: { show: false },
    tooltip: {
      formatter: ({
        seriesName,
        seriesIndex,
        data: [displacement, direction]
      }: {
        seriesName: string;
        seriesIndex: number;
        data: Data['data'][0];
      }) => {
        const [displacementMeta, directionMeta] = dataMetas[seriesIndex];
        const displacementStr = `${intl.get(displacementMeta.label)} ${displacement} ${
          displacementMeta.unit
        }`;
        const directionStr = `${intl.get(directionMeta.label)} ${direction} ${directionMeta.unit}`;
        const rest = `${displacementStr}<br/>${directionStr}`;
        return onlyOneSeries ? rest : `${seriesName}<br/>${rest}`;
      },
      confine: true
    },
    polar: { radius: 100, center: ['50%', '50%'] },
    angleAxis: {
      type: 'value',
      min: -180,
      max: 180,
      startAngle: 180,
      clockwise: false,
      boundaryGap: false,
      axisLine: { show: true, lineStyle: { type: 'dashed' } },
      axisTick: { show: true },
      axisLabel: {
        show: true,
        formatter: (value: number) => {
          switch (value) {
            case 0:
              return `${value} {direction|${language === 'zh-CN' ? '东' : 'East'}}`;
            case 90:
              return ` {direction|${language === 'zh-CN' ? '北' : 'North'}}\r\n${value}`;
            case -180:
              return `{direction|${language === 'zh-CN' ? '西' : 'West'}} ${value}`;
            case -90:
              return `${value}\r\n{direction|${language === 'zh-CN' ? '南' : 'South'}}`;
            default:
              return value;
          }
        },
        rich: {
          direction: {
            fontWeight: 'bold',
            lineHeight: 20
          }
        }
      },
      splitLine: { show: false }
    },
    radiusAxis: {
      type: 'value',
      splitNumber: 3,
      max,
      axisLabel: { hideOverlap: true }
    },
    series
  } as any);
};

const getMaxRadius = (displacements: number[], heightOrRadius: number = 0) => {
  const max = Math.max(...displacements);
  return max >= heightOrRadius && heightOrRadius >= 0 ? 1.5 * max : heightOrRadius;
};

const getDataMeta = ({ displacementKey }: Data) => {
  return mergeDispalcementLabel(displacementKey, [
    INCLINATION_OFFSET_PROPERTY.displacement,
    INCLINATION_OFFSET_PROPERTY.direction
  ]);
};

const mergeDispalcementLabel = (
  displacementKey: string,
  meta: InclinationOffsetDataMeta
): InclinationOffsetDataMeta => {
  const [displacement, direction] = meta;
  return [{ ...displacement, label: `${displacement.label}_${displacementKey}2` }, direction];
};

function getMaxValue(data: Data['data']) {
  let displacementMax = 0;
  let pairedDirection: number | undefined;
  data.forEach(([displacement, direction]) => {
    if (!Number.isNaN(displacement) && displacementMax < displacement) {
      displacementMax = displacement;
      if (!Number.isNaN(direction)) {
        pairedDirection = direction;
      }
    }
  });
  return { displacement: displacementMax, direction: pairedDirection };
}
