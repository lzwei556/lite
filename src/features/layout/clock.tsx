import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { useNow } from './use-now';

const useStyles = createStyles(({ css }) => ({
  clock: css`
    display: inherit;
    @media (max-width: 1200px) {
      display: none;
    }
  `
}));

export const Clock = () => {
  const now = useNow();
  const { styles } = useStyles();
  return (
    <Typography.Text style={{ color: 'white', fontFamily: 'monospace' }} className={styles.clock}>
      {now}
    </Typography.Text>
  );
};

