import { Button, Result } from "antd";
import intl from "react-intl-universal";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status='404'
      title='404'
      subTitle={intl.get('INVALID_PAGE_PROMPT')}
      extra={
        <Button
          type='primary'
          onClick={() => {
            navigate('/');
          }}
        >
          {intl.get('RETURN_TO_HOME')}
        </Button>
      }
    />
  );
};
