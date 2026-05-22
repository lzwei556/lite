import { createStyles } from 'antd-style';

const HEADER_HEIGHT = 60;
const SIDEBAR_COLLAPSED_WIDTH = 48;
export const SIDEBAR_WIDTH = 260;

export const useStyles = createStyles(({ css, token }) => {
  return {
    page: css`
      display: flex;
      align-items: flex-start;
      min-height: calc(100vh - ${HEADER_HEIGHT}px);
      padding: 0 !important;
    `,

    sidebar: css`
      position: sticky;
      top: ${0}px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: ${SIDEBAR_WIDTH}px;
      height: calc(100vh - ${HEADER_HEIGHT}px);
      background: ${token.colorBgContainer};
      border-radius: 8px;
      overflow: hidden;
      transition: width 0.2s ease;
    `,

    sidebarCollapsed: css`
      width: ${SIDEBAR_COLLAPSED_WIDTH}px;
    `,

    sidebarCollapsedTrigger: css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      &:hover {
        background: ${token.colorFillSecondary};
      }
    `,

    sidebarHead: css`
      flex-shrink: 0;
      padding: 16px 16px 0;
    `,

    sidebarBody: css`
      flex: 1;
      min-height: 0;
      padding: 16px 0 16px 0;
      overflow: hidden;
    `,

    sidebarBodyInner: css`
      height: 100%;
      padding-right: 8px;
    `,

    sidebarCollapseButton: css`
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 1;
    `,

    mobileSidebarTrigger: css`
      position: sticky;
      top: ${0}px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      width: ${SIDEBAR_COLLAPSED_WIDTH}px;
      height: 100%;
      border-radius: 8px;
      background: ${token.colorBgContainer};
      cursor: pointer;
      &:hover {
        background: ${token.colorFillSecondary};
      }
    `,

    drawer: css`
      .ant-drawer-header {
        display: none;
      }
      .ant-drawer-body {
        padding: 0;
      }
    `,

    drawerContent: css`
      display: flex;
      flex-direction: column;
      height: 100%;
    `,

    content: css`
      flex: 1;
      min-width: 0;
      padding: 20px 16px;
      overflow-x: hidden;
    `
  };
});
