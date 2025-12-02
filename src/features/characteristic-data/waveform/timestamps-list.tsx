import { Button, Checkbox, List, Space } from 'antd';
import { createStyles } from 'antd-style';
import { DownloadIconButton, MutedCard } from 'components';
import React from 'react';
import { Dayjs, downloadFile, getFilename } from 'utils';
import { DataType, useBatchWaveformDataDownload, useWaveformDataDownload } from '../use-services';
import { VibrationWaveformFilters } from '../types';
import { useLocaleContext } from 'localeProvider';
import intl from 'react-intl-universal';
import { useSelectAll } from 'hooks/select-all';

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
  dataType: DataType;
  vibrationFilters?: VibrationWaveformFilters;
  id: number;
  onClick: (timestamp: number) => void;
  timestamp: number;
  timestamps: number[];
};

export const TimestampsList = ({ onClick, timestamp, timestamps, ...rest }: Props) => {
  const { styles } = useStyles();
  const { selected, toggleOne } = useSelectAll(timestamps);
  const { runAsync: download, loading } = useBatchWaveformDataDownload();
  const { language } = useLocaleContext();
  const paginated = timestamps.length > 100;

  return (
    <MutedCard
      extra={
        paginated && (
          <Button
            disabled={selected.length === 0}
            onClick={() =>
              download(
                rest.id,
                rest.dataType,
                selected,
                language === 'en-US' ? 'en' : 'zh',
                rest.vibrationFilters
              ).then((res) => {
                downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
              })
            }
            loading={loading}
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
              <Checkbox
                checked={selected.includes(item)}
                onChange={(e) => toggleOne(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                value={item}
              />
              <span>{Dayjs.format(item)}</span>
            </Space>
            <DownloadIconButtonWrapper {...{ ...rest, timestamp }} />
          </List.Item>
        )}
        size='small'
      />
    </MutedCard>
  );
};

const DownloadIconButtonWrapper = ({
  id,
  timestamp,
  dataType,
  vibrationFilters
}: Pick<Props, 'id' | 'timestamp' | 'dataType' | 'vibrationFilters'>) => {
  const { runAsync: download, loading } = useWaveformDataDownload();
  const { language } = useLocaleContext();

  return (
    <DownloadIconButton
      variant='text'
      onClick={(e) => {
        e.stopPropagation();
        download(
          id,
          timestamp,
          dataType,
          language === 'en-US' ? 'en' : 'zh',
          vibrationFilters ? { calculate: vibrationFilters.calculate } : undefined
        ).then((res) => {
          downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
        });
      }}
      loading={loading}
    />
  );
};
