import React from 'react';
import { Button, ModalProps } from 'antd';
import { Translation } from 'locales/utils';
import { getFilename } from '../utils/format';
import { Table } from '../components';
import { ModalWrapper } from '../components/modalWrapper';
import { isMobile } from '../utils/deviceDetection';
import { Dayjs, downloadFile } from '../utils';
import { batchDownload } from './services';

export const BatchDownlaodWaveDataModal = ({
  id,
  isVibration = false,
  type,
  timestamps,
  ...rest
}: {
  id: number;
  type: string;
  timestamps: { timestamp: number }[];
  isVibration?: boolean;
} & ModalProps) => {
  const [selectedBatchDownloadTimestamps, setSelectedBatchDownloadTimestamps] = React.useState<
    number[]
  >([]);

  const handleDownlaod = (timestamps: number[]) => {
    batchDownload(id, type, timestamps, isVibration).then((res) => {
      if (res.status === 200) {
        downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
      }
    });
  };

  return (
    <ModalWrapper
      title={Translation.get('common.action.download')}
      {...rest}
      okButtonProps={{ disabled: selectedBatchDownloadTimestamps.length === 0 }}
      footer={[
        <Button key='cancel' onClick={(e) => rest.onCancel && rest.onCancel(e as any)}>
          {Translation.get('common.action.cancel')}
        </Button>,
        <Button
          key='all'
          onClick={() => {
            handleDownlaod(timestamps.map((item) => item.timestamp));
          }}
          color='primary'
          variant='outlined'
        >
          {Translation.doSth('common.action.download', 'common.all')}
        </Button>,
        <Button
          key='ok'
          type='primary'
          onClick={() => {
            handleDownlaod(selectedBatchDownloadTimestamps);
          }}
          disabled={selectedBatchDownloadTimestamps.length === 0}
        >
          {Translation.get('common.ok')}
        </Button>
      ]}
    >
      <Table
        scroll={{ y: isMobile ? 200 : 500 }}
        showHeader={false}
        columns={[
          {
            title: Translation.get('common.timestamp'),
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '80%',
            render: (timestamp: number) => Dayjs.format(timestamp)
          }
        ]}
        pagination={false}
        dataSource={timestamps}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedBatchDownloadTimestamps(selectedRowKeys as number[]);
          }
        }}
        rowKey='timestamp'
      />
    </ModalWrapper>
  );
};
