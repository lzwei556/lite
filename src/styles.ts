import { theme } from 'antd';

export const useGlobalStyles = () => {
  const { token } = theme.useToken();
  const colorLayoutBgStyle = {
    backgroundColor: token.colorBgLayout
  };
  return {
    colorLayoutBgStyle,
    colorBgContainerStyle: { backgroundColor: token.colorBgContainer },
    propertyHistoryCardStyle: {
      style: colorLayoutBgStyle,
      styles: { header: { borderColor: token.colorFillSecondary } }
    },
    colorPrimaryStyle: { color: token.colorPrimary },
    colorPrimaryActiveStyle: { color: token.colorPrimaryActive },
    colorPrimaryHoverStyle: { color: token.colorPrimaryHover },
    colorSuccessStyle: { color: token.colorSuccess },
    colorSuccessActiveStyle: { color: token.colorSuccessActive },
    colorSuccessHoverStyle: { color: token.colorSuccessHover },
    colorWarningStyle: { color: token.colorWarning },
    colorWarningActiveStyle: { color: token.colorWarningActive },
    colorWarningHoverStyle: { color: token.colorWarningHover },
    colorErrorStyle: { color: token.colorError },
    colorErrorActiveStyle: { color: token.colorErrorActive },
    colorErrorHoverStyle: { color: token.colorErrorHover },
    colorErrorHighLightStyle: { color: '#f5222d' },
    colorTextStyle: { color: token.colorText },
    colorTextSecondaryStyle: { color: token.colorTextSecondary },
    colorTextDescriptionStyle: { color: token.colorTextDescription },
    colorFillTertiaryStyle: { color: token.colorFillTertiary },
    colorBorderStyle: { color: token.colorBorder },
    colorBorderSecondaryStyle: { color: token.colorBorderSecondary },
    colorInfoBorderStyle: { color: token.colorInfoBorder },
    colorWhiteStyle: { color: '#fff' }
  };
};
