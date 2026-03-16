import { downloadRawHistory } from 'monitoring-point/services';
import { useI18n } from 'providers/i18n';
import React from 'react';
import { downloadFile, getFilename } from 'utils';

export const useDownloadRawDataHandler = (id: number, timestamp?: number, field?: string) => {
  const { language } = useI18n();
  return React.useCallback(() => {
    if (timestamp && field) {
      downloadRawHistory(id, timestamp, language, 'raw', {
        field,
        axis: 0
      }).then((res) => {
        downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
      });
    }
  }, [id, timestamp, field, language]);
};
