import { useState, useEffect } from 'react';
import { Dayjs } from '../../utils';

export const useNow = () => {
  const [now, setNow] = useState(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Dayjs.dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};
