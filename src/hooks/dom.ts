import { App, useAppType } from 'config';
import { useI18n } from 'providers/i18n';
import React from 'react';
import { Translation } from 'locales/utils';

export const useUpdateDocumentTitle = () => {
  const config = useAppType();
  const { language } = useI18n();
  React.useEffect(() => {
    document.title = Translation.get(App.getSiteName(config));
  }, [config, language]);
};
