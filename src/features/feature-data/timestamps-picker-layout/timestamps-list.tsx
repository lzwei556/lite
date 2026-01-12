import { Button, Checkbox, List, Space } from 'antd';
import { createStyles } from 'antd-style';
import { DownloadIconButton, MutedCard } from 'components';
import React from 'react';
import { Dayjs, downloadFile, getFilename } from 'utils';
import intl from 'react-intl-universal';
import { useSelectAll } from 'hooks/select-all';
import { AxiosResponse } from 'axios';

const useStyles = createStyles(({ token, css }) => ({
  listItem: css`
    &:hover {
      background: ${token.colorBgTextHover};
      cursor: pointer;
    }
    &.selected {
      background: ${token.colorInfoBg};
    }
  `
}));

type Props = {
  download?: { loading: boolean; callback: (timestamp: number) => Promise<AxiosResponse<Blob>> };
  downloadBatch?: {
    loading: boolean;
    callback: (timestamps: number[]) => Promise<AxiosResponse<Blob>>;
  };
  onClick: (timestamp: number) => void;
  timestamp?: number;
  timestamps: number[];
};

export const TimestampsList = ({
  onClick,
  downloadBatch,
  download,
  timestamp,
  timestamps
}: Props) => {
  const { styles } = useStyles();
  const { selected, toggleOne } = useSelectAll(timestamps);
  const paginated = timestamps.length > 100;
  const [downloaded, setDownloaded] = React.useState<number>();

  return (
    <MutedCard
      extra={
        paginated &&
        downloadBatch && (
          <Button
            disabled={selected.length === 0}
            onClick={() =>
              downloadBatch.callback(selected).then((res) => {
                downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
              })
            }
            loading={downloadBatch.loading}
            variant='outlined'
          >
            {intl.get('BATCH_DOWNLOAD')}
          </Button>
        )
      }
      style={{ height: '100%' }}
      title={intl.get('TIMESTAMP')}
    >
      <List
        dataSource={timestamps}
        pagination={
          paginated
            ? {
                pageSize: 13,
                showQuickJumper: false,
                showSizeChanger: false,
                simple: { readOnly: true }
              }
            : undefined
        }
        renderItem={(item) => (
          <List.Item
            className={`${styles.listItem} ${item === timestamp ? 'selected' : ''}`}
            onClick={() => onClick(item)}
          >
            <Space>
              {downloadBatch && (
                <Checkbox
                  checked={selected.includes(item)}
                  onChange={(e) => toggleOne(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  value={item}
                />
              )}
              <span>{Dayjs.format(item)}</span>
            </Space>
            {download && (
              <DownloadIconButtonWrapper
                {...{
                  loading: download.loading && downloaded === item,
                  onClick: () => {
                    setDownloaded(item);
                    download.callback(item).then((res) => {
                      downloadFile(
                        window.URL.createObjectURL(new Blob([res.data])),
                        getFilename(res)
                      );
                    });
                  }
                }}
              />
            )}
          </List.Item>
        )}
        size='small'
      />
    </MutedCard>
  );
};

const DownloadIconButtonWrapper = ({
  loading,
  onClick
}: {
  loading: boolean;
  onClick: () => void;
}) => {
  return (
    <DownloadIconButton
      variant='text'
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      loading={loading}
    />
  );
};
