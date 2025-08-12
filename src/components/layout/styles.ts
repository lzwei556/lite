import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }) => {
  const sidebar = cx(css`
    position: fixed;
    top: 0;
    height: 100%;
    max-height: 100vh;
    background-color: ${token.colorBgContainer};
  `);
  const sidebarInnerHead = css`
    padding: var(--space) 4px var(--space) 0;
  `;
  return {
    pageContainer: css`
      display: flex;
      width: 100%;
      min-height: calc(100vh - 60px);
      padding: 0 !important;
    `,
    sidebarContainer: css`
      flex-shrink: 0;
      border: solid 1px transparent;
      border-radius: 8px;
      width: 300px;
      &.collapsed {
        width: 30px;
        .${sidebar} {
          width: 30px;
        }
      }
      &.small {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        background-color: ${token.colorBgContainer};
        cursor: pointer;
        &:hover {
          background-color: ${token.colorBorder};
        }
      }
    `,
    sidebar,
    sidebarInner: css`
      position: relative;
      display: flex;
      flex-direction: column;
      width: 300px;
      height: 100%;
      padding-top: 60px;
    `,
    sidebarInnerHead,
    sidebarInnerBody: css`
      ${sidebarInnerHead};
      flex: 1;
    `,
    sidebarSwitch: css`
      position: absolute;
      top: 68px;
      right: 20px;
    `,
    sidebarExpand: css`
      position: absolute;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: ${token.colorBorder};
      }
    `,
    sidebarDrawer: css`
      margin-top: 60px;
      .ant-drawer-header {
        display: none;
      }
    `,

    content: css`
      flex: 1;
      padding: 20px 16px;
      overflow-x: hidden;
    `
  };
});
