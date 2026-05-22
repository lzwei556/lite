import { Grid, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { createStyles } from 'antd-style';
import AlertMessageNotification from '../components/notification/alert';
import { Header, MobileDrawer } from 'features/layout';
import { useActionController } from 'common/action';
import { Brand } from 'common/components/brand';

const useStyles = createStyles(({ css }) => ({
  content: css`
    > main.ant-layout-content {
      height: calc(100vh - 60px);
      max-height: calc(100vh - 60px);
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--space);
    }
  `
}));

export default function AppShell() {
  const { styles } = useStyles();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  const { open, modalNode } = useActionController({
    actions: {
      openMobileDrawer: {
        modal: (ctx) => <MobileDrawer {...ctx} />
      }
    }
  });

  return (
    <Layout>
      <Header
        brand={<Brand height={36} brandNameStyle={{ fontSize: 18 }} />}
        isMobile={isMobile}
        openMobileDrawer={() => open('openMobileDrawer')}
      />
      <Layout className={styles.content}>
        <Outlet />
      </Layout>
      {modalNode}
      <AlertMessageNotification />
    </Layout>
  );
}
