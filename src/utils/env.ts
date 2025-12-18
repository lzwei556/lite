export const ENV = {
  locale: process.env.REACT_APP_LOCALE?.trim() ?? 'zh-CN',
  authenticated: process.env.REACT_APP_AUTHENTICATED?.trim() ?? 'false',
  legacyEnabled: process.env.REACT_APP_LEGACY_ENABLED?.trim() ?? 'false'
};
