import React from 'react';
import { useLocaleContext } from '../../../localeProvider';
import { getFilename } from '../../../utils/format';
import { downloadRawHistory } from '../../../asset-common';

export const useDownloadRawDataHandler = (id: number, timestamp?: number, field?: string) => {
  const { language } = useLocaleContext();
  return React.useCallback(() => {
    if (timestamp && field) {
      downloadRawHistory(id, timestamp, language === 'en-US' ? 'en' : 'zh', 'raw', {
        field,
        axis: 0
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', getFilename(res));
        document.body.appendChild(link);
        link.click();
      });
    }
  }, [id, timestamp, field, language]);
};
