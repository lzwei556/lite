import { theme } from 'antd';

export const useGlobalStyles = () => {
  const { token } = theme.useToken();
  const colorLayoutBgStyle = {
    backgroundColor: token.colorBgLayout
  };
  return {
    colorLayoutBgStyle,
    propertyHistoryCardStyle: {
      style: colorLayoutBgStyle,
      styles: { header: { borderColor: token.colorFillSecondary } }
    },
    colorTextStyle: { color: token.colorText },
    colorTextDescriptionStyle: { color: token.colorTextDescription },
    colorFillTertiaryStyle: { color: token.colorFillTertiary },
    colorBorderStyle: { color: token.colorBorder },
    colorBgContainerStyle: { backgroundColor: token.colorBgContainer }
  };
};
