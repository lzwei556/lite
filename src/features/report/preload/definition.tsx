import React from 'react';
import './table.css';

export const DefinitionSection = () => {
  return (
    <div className="section">
      <div className="section-title">3 状态定义</div>

      <table className="doc-table definition">
        <tbody>
          <tr>
            <td className="index">1</td>
            <td className="label">良好</td>
            <td>
              各部位螺栓预紧力在标准±30%以内波动，稳定性好。无需处理。
            </td>
          </tr>

          <tr>
            <td className="index">2</td>
            <td className="label">注意</td>
            <td>
              各部位螺栓预紧力在标准±35%以内波动。提升监测频次，关注发展趋势。
            </td>
          </tr>

          <tr>
            <td className="index">3</td>
            <td className="label">预警</td>
            <td>
              各部位螺栓预紧力在标准±40%以内波动。现场查验力矩值并检查状态。
            </td>
          </tr>

          <tr>
            <td className="index">4</td>
            <td className="label">报警</td>
            <td>
              超出±40%。需检修处理。
            </td>
          </tr>

          <tr>
            <td className="index">4</td>
            <td className="label">通讯异常</td>
            <td>
              传感器数据异常或无法通讯。需现场排查恢复。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
