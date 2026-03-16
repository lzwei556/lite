import { useEffect, useState } from 'react';
import { message, Typography, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { UploadOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import {
  PagingFirmwaresRequest,
  RemoveFirmwareRequest,
  UploadFirmwareRequest
} from '../../apis/firmware';
import { Dayjs } from '../../utils';
import { PageResult } from '../../types/page';
import { Firmware } from '../../types/firmware';
import { Store, useStore } from '../../hooks/store';
import { DeleteIconButton, IconButton, Table, transformPagedresult } from '../../components';
import { CanAccess, Permission } from '../../providers/access-control';

const FirmwarePage = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<PageResult<Firmware[]>>();
  const [store, setStore, gotoPage] = useStore('firmwareList');

  const fetchFirmwares = (store: Store['firmwareList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingFirmwaresRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchFirmwares(store);
  }, [store]);

  const onFileChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setIsUploading(true);
    }
  };

  const onUpload = (options: any) => {
    const formData = new FormData();
    formData.append('file', options.file);
    UploadFirmwareRequest(formData).then((res) => {
      setIsUploading(false);
      if (res.code === 200) {
        message.success(Translation.get('feedback.success.upload.firmware')).then(() => {
          if (dataSource) {
            const { size, page, total } = dataSource;
            gotoPage({ size, total, index: page }, 'next');
          }
        });
      } else {
        message
          .error(`${Translation.failureDo('common.action.upload')}${Translation.get(res.msg)}`)
          .then();
      }
    });
  };

  const onDelete = (id: number) => {
    RemoveFirmwareRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const columns = [
    {
      title: Translation.get('common.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: Translation.get('firmware.version.soft'),
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: Translation.get('firmware.version.hard'),
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: Translation.get('firmware.crc'),
      dataIndex: 'crc',
      key: 'crc'
    },
    {
      title: Translation.get('firmware.build.time'),
      dataIndex: 'buildTime',
      key: 'buildTime',
      render: (text: number) => Dayjs.format(text)
    },
    {
      title: Translation.get('common.operation'),
      key: 'action',
      render: (_: string, record: any) => {
        return (
          <DeleteIconButton
            confirmProps={{
              description: Translation.get('feedback.prompt.delete'),
              onConfirm: () => onDelete(record.id)
            }}
          />
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('MENU_FIRMWARE_LIST')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: (
            <CanAccess {...Permission.FirmwareAdd}>
              <Upload
                accept={'.bin'}
                name='file'
                customRequest={onUpload}
                showUploadList={false}
                onChange={onFileChange}
              >
                <IconButton
                  icon={<UploadOutlined />}
                  loading={isUploading}
                  tooltipProps={{
                    title: Translation.get('common.action.upload')
                  }}
                  type='primary'
                />
              </Upload>
            </CanAccess>
          )
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
    </Content>
  );
};

export default FirmwarePage;
