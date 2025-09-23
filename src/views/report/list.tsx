import React from 'react';
import { Link } from 'react-router-dom';
import { Segmented, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Table, RangeDatePicker } from '../../components';
import request from '../../utils/request';
import { Dayjs, pickOptionsFromNumericEnum } from '../../utils';
import { Report } from './types';
import { useTypeContext } from './context';
import { ReportType } from './constants';
import { useReports } from './utils';

export default function ReportList() {
  return (
    <>
      <Typography.Title level={4}>{intl.get('MENU_REPORTS')}</Typography.Title>
      <ReportsTable />
    </>
  );
}

const ReportsTable = () => {
  const columns = [
    {
      title: intl.get('NAME'),
      dataIndex: 'reportName',
      key: 'reportName'
    },
    {
      title: intl.get('REPORT_DATE'),
      dataIndex: 'reportDate',
      key: 'reportDate',
      render: (text: number) => Dayjs.format(text)
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: string, report: Report) => {
        return (
          <Link to={`/reports/${report.id}?type=${type}`} state={report}>
            查看报告
          </Link>
        );
      }
    }
  ];
  const { type, setSearchParams } = useTypeContext();
  const { ds, paged, setStore, setRange } = useReports(type);
  return (
    <Table
      columns={columns}
      dataSource={ds}
      header={{
        toolbar: (
          <Space>
            <Segmented
              options={pickOptionsFromNumericEnum(ReportType, 'report.type').map((opt) => ({
                ...opt,
                label: intl.get(opt.label)
              }))}
              onChange={(value) => setSearchParams({ type: `${value}` })}
              value={type}
            />
            <RangeDatePicker onChange={setRange} />
          </Space>
        )
      }}
      pagination={{
        ...paged,
        onChange: (index, size) => setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
      }}
      rowKey={(row) => row.id}
    />
  );
};

export function downloadReport(filename: string) {
  return request.download<any>(`/reports/${filename}`);
}
