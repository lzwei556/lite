import { Col } from 'antd';
import { Grid } from './grid';

export function TitleSection({ title, body }: { title: React.ReactNode; body: React.ReactNode }) {
  return (
    <Grid gutter={[8, 8]}>
      <Col span={24} style={{ fontWeight: 500 }}>
        {title}
      </Col>
      <Col span={24}>{body}</Col>
    </Grid>
  );
}
