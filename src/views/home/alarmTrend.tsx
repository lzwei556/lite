import * as React from 'react';
import { Spin } from 'antd';
import intl from 'react-intl-universal';
import { Dayjs } from '../../utils';
import { GetAlertStatisticsRequest } from '../../apis/statistic';
import { Chart, getOptions, MutedCard, useBarPieOption } from '../../components';
import { AlarmLevel, getColorByValue, getLabelByValue } from '../../features/alarm';

type Statistics = { timestamp: number; info: number; warn: number; critical: number };
export const AlarmTrend = ({
  title,
  id,
  chartStyle
}: {
  id?: number;
  title: string;
  chartStyle?: React.CSSProperties;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [countAlarm, setCountAlarm] = React.useState<Statistics[]>([]);

  const hasValidData = (data: Statistics[]) => {
    if (data.length === 0) return false;
    if (
      data.map(({ info }) => info).every((n) => n === 0) &&
      data.map(({ warn }) => warn).every((n) => n === 0) &&
      data.map(({ critical }) => critical).every((n) => n === 0)
    )
      return false;
    return true;
  };
  const barPieOpts = useBarPieOption();
  const options = hasValidData(countAlarm)
    ? getOptions(barPieOpts, {
        title: {
          text: '',
          left: 'center',
          top: 'center'
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: getData(countAlarm).xAxisData
        },
        yAxis: { type: 'value', minInterval: 1 },
        series: [
          {
            type: 'bar',
            name: intl.get(getLabelByValue(AlarmLevel.Minor)),
            data: getData(countAlarm).info,
            color: getColorByValue(AlarmLevel.Minor)
          },
          {
            type: 'bar',
            name: intl.get(getLabelByValue(AlarmLevel.Major)),
            data: getData(countAlarm).warn,
            color: getColorByValue(AlarmLevel.Major)
          },
          {
            type: 'bar',
            name: intl.get(getLabelByValue(AlarmLevel.Critical)),
            data: getData(countAlarm).danger,
            color: getColorByValue(AlarmLevel.Critical)
          }
        ]
      })
    : undefined;
  React.useEffect(() => {
    GetAlertStatisticsRequest(id !== undefined ? { asset_id: id } : undefined).then((data) => {
      setLoading(false);
      setCountAlarm(data);
    });
  }, [id]);

  function getData(data: Statistics[]) {
    const xAxisData: string[] = [],
      info: number[] = [],
      warn: number[] = [],
      danger: number[] = [];
    if (data.length > 0) {
      xAxisData.push(...data.map(({ timestamp }) => Dayjs.format(timestamp, 'MM/DD')));
      info.push(...data.map(({ info }) => info));
      warn.push(...data.map(({ warn }) => warn));
      danger.push(...data.map(({ critical }) => critical));
    }

    return {
      xAxisData,
      info,
      warn,
      danger
    };
  }

  if (loading) return <Spin />;
  return (
    <MutedCard title={title} titleCenter={true}>
      <Chart options={options} style={chartStyle} />
    </MutedCard>
  );
};
