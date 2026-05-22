import { Header as AntHeader } from 'antd/es/layout/layout';
import { createStyles } from 'antd-style';
import headBg from './head-bg.jpg';
import { Desktop } from './desktop';
import { Mobile } from './mobile';

const useStyles = createStyles(({ css }) => ({
  header: css`
    background-image: url(${headBg});
    background-repeat: repeat-x;
    height: 60px;
    padding-left: 30px;
    padding-right: 16px;
    line-height: 60px;
    z-index: 2;
    .ant-menu-light > .ant-menu-item,
    .ant-menu-light .ant-menu-submenu-title {
      color: #fff;
    }
    @media (max-width: 576px) {
      padding: 0 20px;
    }
  `,
  pc: css`
    display: flex;
    @media (max-width: 576px) {
      display: none;
    }
  `,
  menu: css`
    flex: 1;
    min-width: 0;
    margin: 0 16px;
    background-color: transparent;
    color: #fff;
  `,
  mobile: css`
    display: none;
    @media (max-width: 576px) {
      display: flex;
      align-items: center;
    }
  `,
  mobileMenuIcon: css`
    color: #fff;
    font-size: 18px;
  `,
  mobileLogo: css`
    flex-grow: 1;
    text-align: center;
    justify-content: center;
  `
}));

export const Header = ({
  brand,
  isMobile,
  openMobileDrawer
}: {
  brand: React.ReactNode;
  isMobile: boolean;
  openMobileDrawer: () => void;
}) => {
  const { styles } = useStyles();

  return (
    <AntHeader className={styles.header}>
      {isMobile ? (
        <Mobile brand={brand} onMenuClick={openMobileDrawer} />
      ) : (
        <Desktop brand={brand} />
      )}
    </AntHeader>
  );
};
