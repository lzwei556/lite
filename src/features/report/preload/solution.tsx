import React from 'react';
import { useReportBaseStyles } from './style';
import { ReportTable } from '../components/table';
import './solution.css';

const data = [
  { key: 'header', label1: '数据采集器' },
  {
    key: 'row1',
    label1: '监测设备供应商',
    value1: '',
    label2: '传感器类型',
    value2: '无线、超声波'
  },
  { key: 'row2', label1: '通道数量', value1: '10x14', label2: '测点分布', value2: '整周均布' },
  { key: 'row3', label1: '传感器型号', value1: 'SAS100A', label2: '安装方式', value2: '粘接安装' }
];

const data2 = [
  { key: 'header', label1: '外圈-锚栓' },
  {
    key: 'row1',
    label1: '双头螺柱规格',
    value1: 'M42×4210 M42×4010',
    label2: '光杆直径',
    value2: '-'
  },
  {
    key: 'row2',
    label1: '力矩值标准',
    value1: '-',
    label2: '预紧力标准值',
    value2: '505KN'
  },
  { key: 'row3', label1: '扭矩系数', value1: '-' }
];

const TOTAL = 10;

const data3 = Array.from({ length: TOTAL }).map((_, i) => ({
  key: i,
  sensor: i + 1,
  bolt: (i + 1) * 11
}));

const data4 = [
  { key: 'header', label: '采样信息' },
  {
    key: 'row1',
    label: '采样频次',
    value: '3次/天'
  },
  {
    key: 'row2',
    label: '分析周期',
    value: ''
  }
];

export const MonitoringSolutionSection = () => {
  const { styles } = useReportBaseStyles();
  return (
    <div className={styles.section}>
      <div className={styles.title}>1 监测方案</div>
      <div className={styles.subTitle}>1）测量设备</div>

      <ReportTable
        dataSource={data}
        showHeader={false}
        bordered={true}
        columns={[
          {
            align: 'center',
            dataIndex: 'label1',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { children: text, props: { colSpan: 4 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'value1',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'label2',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'value2',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          }
        ]}
      />

      <div className={styles.subTitle}>2）螺栓参数</div>
      <ReportTable
        dataSource={data2}
        showHeader={false}
        bordered={true}
        columns={[
          {
            align: 'center',
            dataIndex: 'label1',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { children: text, props: { colSpan: 4 } };
              }
              if (row.key === 'row3') {
                return { children: text, props: { colSpan: 1 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'value1',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              if (row.key === 'row3') {
                return { children: text, props: { colSpan: 3 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'label2',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              if (row.key === 'row3') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          },
          {
            align: 'center',
            dataIndex: 'value2',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              if (row.key === 'row3') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          }
        ]}
      />
      <div className={styles.subTitle}>3）测点布置</div>
      <ReportTable
        className='report-table'
        dataSource={data3}
        showHeader={true}
        bordered={true}
        title={() => <div style={{ textAlign: 'center', fontWeight: 600 }}>测点布置方案</div>}
        columns={[
          {
            title: '传感器编号',
            dataIndex: 'sensor',
            align: 'center',
            width: 120,
            onCell: () => ({
              className: 'report-cell'
            })
          },
          {
            title: '螺栓编号',
            dataIndex: 'bolt',
            align: 'center',
            width: 120,
            onCell: () => ({
              className: 'report-cell'
            })
          },
          {
            title: null,
            onHeaderCell: () => ({
              style: {
                padding: 0,
                borderBottom: 'none' // 可选：去掉表头边框
              }
            }),
            dataIndex: 'chart',
            width: 420,
            render: (_: any, __: any, index: number) => {
              if (index === 0) {
                return {
                  children: 'jj',
                  props: {
                    rowSpan: TOTAL,
                    className: 'report-chart-cell'
                  }
                };
              }
              return {
                children: null,
                props: { rowSpan: 0 }
              };
            }
          }
        ]}
      />
      <div className={styles.subTitle}>4）采样标准</div>
      <ReportTable
        dataSource={data4}
        showHeader={false}
        bordered={true}
        columns={[
          {
            align: 'center',
            dataIndex: 'label',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { children: text, props: { colSpan: 2 } };
              }
              return text;
            },
            width: 150
          },
          {
            // align: 'center',
            dataIndex: 'value',
            render: (text: string, row: any) => {
              if (row.key === 'header') {
                return { props: { colSpan: 0 } };
              }
              return text;
            }
          }
        ]}
      />
    </div>
  );
};
