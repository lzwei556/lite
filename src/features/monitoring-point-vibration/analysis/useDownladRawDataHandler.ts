import React from 'react';
import { useLocaleContext } from '../../../localeProvider';
import { getFilename } from '../../../utils/format';
import { downloadRawHistory } from '../../../asset-common';
import { downloadFile } from 'utils';

export const useDownloadRawDataHandler = (id: number, timestamp?: number, field?: string) => {
  const { language } = useLocaleContext();
  return React.useCallback(() => {
    if (timestamp && field) {
      downloadRawHistory(id, timestamp, language === 'en-US' ? 'en' : 'zh', 'raw', {
        field,
        axis: 0
      }).then((res) => {
        downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
      });
    }
  }, [id, timestamp, field, language]);
};
