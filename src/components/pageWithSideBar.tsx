import React from 'react';
import { Button, Drawer } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useResponsive } from 'ahooks';
import './sideBar.css';

export const PageWithSideBar = ({
  content,
  sideBar
}: {
  content: React.ReactNode;
  sideBar: SideBarProps;
}) => {
  return (
    <Content className='page-with-sidebar'>
      <SideBar {...sideBar} />
      <div className='content'>{content}</div>
    </Content>
  );
};

type SideBarProps = {
  body: (height: number, onClick?: () => void) => React.ReactNode;
  head?: React.ReactNode;
};
const SideBar = ({ body, head }: SideBarProps) => {
  const [expanded, setExpanded] = React.useState(true);
  const [sidebarBodyHeight, setSidebarBodyHeight] = React.useState(780);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const { xl } = useResponsive();
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

  return xl ? (
    <aside className={`sidebar-container ${expanded ? '' : 'collapsed'}`}>
      <div className='sidebar' ref={sidebarRef}>
        {expanded ? (
          <div className='sidebar-inner'>
            {head && <div className='sidebar-head'>{head}</div>}
            <div className='sidebar-body' style={{ height: sidebarBodyHeight }}>
              {body(sidebarBodyHeight - 24)}
            </div>
            <Button
              className='sidebar-switch'
              icon={<DoubleLeftOutlined />}
              onClick={() => setExpanded(!expanded)}
              type='text'
            />
          </div>
        ) : (
          <div className='sidebar-expand' onClick={() => setExpanded(!expanded)}>
            <DoubleRightOutlined />
          </div>
        )}
      </div>
    </aside>
  ) : (
    <>
      <aside className='sidebar-container small' onClick={() => setOpen(true)}>
        <div ref={sidebarRef}>
          <DoubleRightOutlined />
        </div>
      </aside>
      <Drawer
        className='sidebar-drawer'
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
