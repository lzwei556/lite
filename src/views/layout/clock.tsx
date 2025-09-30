import React from 'react';
import { Typography } from 'antd';
import { Dayjs } from '../../utils';

export const Clock = () => {
  const [now, setNow] = React.useState(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
  React.useEffect(() => {
    const id = setInterval(() => {
      setNow(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Typography.Text style={{ color: 'white', fontFamily: 'monospace' }} id='current-time'>
      {now}
    </Typography.Text>
  );
};
