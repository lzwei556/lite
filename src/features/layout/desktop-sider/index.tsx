import React from 'react';
import { Drawer, Grid } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { IconButton } from 'components';
import { SIDEBAR_WIDTH, useStyles } from './styles';
import { useSize } from 'ahooks';

const { useBreakpoint } = Grid;

type SideBarRenderProps = {
  height: number;
  close?: () => void;
};

type Props = {
  content: React.ReactNode;

  sideBar: {
    head?: React.ReactNode;
    body: (props: SideBarRenderProps) => React.ReactNode;
  };
};

export const PageWithSideBar = ({ content, sideBar }: Props) => {
  const { styles, cx } = useStyles();

  const screens = useBreakpoint();
  const desktop = screens.lg;
  const largeDesktop = screens.xl;

  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const size = useSize(bodyRef);

  const renderSidebarContent = (close?: () => void) => (
    <>
      {sideBar.head && <div className={styles.sidebarHead}>{sideBar.head}</div>}

      <div className={styles.sidebarBody}>
        <div ref={bodyRef} className={styles.sidebarBodyInner}>
          {size &&
            size?.height > 0 &&
            sideBar.body({
              height: size.height,
              close
            })}
        </div>
      </div>
    </>
  );

  return (
    <Content className={styles.page}>
      {largeDesktop ? (
        <aside className={cx(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
          {collapsed ? (
            <div className={styles.sidebarCollapsedTrigger} onClick={() => setCollapsed(false)}>
              <DoubleRightOutlined />
            </div>
          ) : (
            <>
              {renderSidebarContent()}

              <IconButton
                className={styles.sidebarCollapseButton}
                icon={<DoubleLeftOutlined />}
                onClick={() => setCollapsed(true)}
                type='text'
              />
            </>
          )}
        </aside>
      ) : desktop ? (
        <>
          <aside className={styles.mobileSidebarTrigger} onClick={() => setOpen(true)}>
            <DoubleRightOutlined />
          </aside>
          <Drawer
            className={styles.drawer}
            placement='left'
            width={SIDEBAR_WIDTH}
            open={open}
            onClose={() => setOpen(false)}
            title={null}
          >
            <div className={styles.drawerContent}>{renderSidebarContent(() => setOpen(false))}</div>
          </Drawer>
        </>
      ) : null}

      <main className={styles.content}>{content}</main>
    </Content>
  );
};
