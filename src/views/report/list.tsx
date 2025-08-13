import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Table, transformPagedresult, RangeDatePicker, useRange } from '../../components';
import { Store, useStore } from '../../hooks/store';
import { PageResult } from '../../types/page';
import request from '../../utils/request';
import { GetResponse } from '../../utils/response';
import { Dayjs } from '../../utils';
import { Report } from './detail/report';

export default function ReportList() {
  const [dataSource, setDataSource] = useState<PageResult<Report[]>>();
  const { numberedRange, setRange } = useRange();
  const [store, setStore] = useStore('reportList');

  const fetchReports = (store: Store['reportList'], from: number, to: number) => {
    const {
      pagedOptions: { index, size }
    } = store;
    getReports(index, size, from, to).then(setDataSource);
  };

  useEffect(() => {
    if (numberedRange) {
      const [from, to] = numberedRange;
      fetchReports(store, from, to);
    }
  }, [store, numberedRange]);

  const columns = [
    {
      title: intl.get('NAME'),
      dataIndex: 'reportName',
      key: 'reportName',
      width: 400
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
      render: (text: any, record: any) => {
        return (
          <Link to={`/reports/${record.id}`} state={record}>
            查看报告
          </Link>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Table
      columns={columns}
      dataSource={ds}
      header={{
        title: intl.get('MENU_REPORTS'),
        toolbar: <RangeDatePicker onChange={setRange} />
      }}
      pagination={{
        ...paged,
        onChange: (index, size) => setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
      }}
      rowKey={(row) => row.id}
    />
  );
}

export function getReports(page: number, size: number, from: number, to: number) {
  return request.get<PageResult<Report[]>>('/reports', { page, size, from, to }).then(GetResponse);
}

export function downloadReport(filename: string) {
  return request.download<any>(`/reports/${filename}`);
}
