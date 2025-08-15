import React from 'react';
import { Drawer } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useResponsive } from 'ahooks';
import { useStyles } from './styles';
import { IconButton } from '../icon-button';

export const PageWithSideBar = ({
  content,
  sideBar
}: {
  content: React.ReactNode;
  sideBar: SideBarProps;
}) => {
  const { styles } = useStyles();

  return (
    <Content className={styles.pageContainer}>
      <SideBar {...sideBar} />
      <div className={styles.content}>{content}</div>
    </Content>
  );
};

type SideBarProps = {
  body: (height: number, onClick?: () => void) => React.ReactNode;
  head?: React.ReactNode;
};
const SideBar = ({ body, head }: SideBarProps) => {
  const { cx, styles } = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const [sidebarBodyHeight, setSidebarBodyHeight] = React.useState(780);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const { xxl } = useResponsive();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const setHeight = () => {
      if (sidebarRef && sidebarRef.current) {
        const height = Number(getComputedStyle(document.body).height.replace('px', ''));
        const headHeight = head ? 44 : 0;
        const topPadding = 60;
        if (height) {
          setSidebarBodyHeight(height - headHeight - topPadding);
        }
      }
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, [head]);

  return xxl ? (
    <aside className={cx(styles.sidebarContainer, expanded ? '' : 'collapsed')}>
      <div className={styles.sidebar} ref={sidebarRef}>
        {expanded ? (
          <div className={styles.sidebarInner}>
            {head && <div className={styles.sidebarInnerHead}>{head}</div>}
            <div className={styles.sidebarInnerBody} style={{ height: sidebarBodyHeight }}>
              {body(sidebarBodyHeight - 24)}
            </div>
            <IconButton
              className={styles.sidebarSwitch}
              icon={<DoubleLeftOutlined />}
              onClick={() => setExpanded(!expanded)}
              type='text'
            />
          </div>
        ) : (
          <div className={styles.sidebarExpand} onClick={() => setExpanded(!expanded)}>
            <DoubleRightOutlined />
          </div>
        )}
      </div>
    </aside>
  ) : (
    <>
      <aside className={cx(styles.sidebarContainer, 'small')} onClick={() => setOpen(true)}>
        <div ref={sidebarRef}>
          <DoubleRightOutlined />
        </div>
      </aside>
      <Drawer
        className={styles.sidebarDrawer}
        open={open}
        onClose={() => setOpen(false)}
        placement='left'
        title={null}
      >
        {body(sidebarBodyHeight - 24, () => setOpen(false))}
      </Drawer>
    </>
  );
};
