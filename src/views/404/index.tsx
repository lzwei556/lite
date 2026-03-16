import { FC } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Translation } from 'locales/utils';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status='404'
      title='404'
      subTitle={Translation.get('feedback.404')}
      extra={
        <Button
          type='primary'
          onClick={() => {
            navigate('/');
          }}
        >
          {Translation.get('button.return-to-home')}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
