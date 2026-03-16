import { FC } from 'react';
import { Button, Result } from 'antd';
import { Translation } from 'locales/utils';

const ServerErrorPage: FC = () => {
  return (
    <Result
      status='500'
      title='500'
      subTitle={Translation.get('feedback.500')}
      extra={
        <Button
          type='primary'
          onClick={() => {
            window.location.hash = '/';
          }}
        >
          {Translation.get('button.return-to-home')}
        </Button>
      }
    />
  );
};

export default ServerErrorPage;
