import intl from "react-intl-universal";
import { Flex, MutedCard } from "../../components";
import { FaultDiagnosis } from "./common";
import { Progress, Space } from "antd";

export const FaultDiagnosisBarList = ({
  data
}: {
  data: ({ name: string } & FaultDiagnosis)[];
}) => {
  return (
    <MutedCard title={intl.get('component.health.status')}>
      <div style={{ overflow: 'auto', maxHeight: 300 }}>
        {data.map((item) => (
          <FaultDiagnosisBar {...item} key={item.name} />
        ))}
      </div>
    </MutedCard>
  );
};

const FaultDiagnosisBar = ({ name, status }: { name: string } & FaultDiagnosis) => {
  return (
    <>
      <Flex justify='space-between'>
        <Space>
          {name}
          <span>（{intl.get(status.label)}）</span>
        </Space>
        93%
      </Flex>
      <Progress percent={93} showInfo={false} strokeColor={`rgba(${status.color.join()}, 0.45)`} />
    </>
  );
};
