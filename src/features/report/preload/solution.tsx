import React from 'react';
import './table.css';
import { A4Page } from '../components/A4Page';
import { useReportBaseStyles } from './style';

export const MonitoringSolutionSection = () => {
  const { styles } = useReportBaseStyles();
  return (
    <A4Page>
      <div className={styles.section}>
        <div className={styles.title}>1 监测方案</div>

        {/* 1）测量设备 + 螺栓参数 */}
        <table className='doc-table'>
          <tbody>
            <tr>
              <td className='label'>1）测量设备</td>
              <td>
                数据采集器（无线、超声波）
                <br />
                10×14整周均布
                <br />
                SAS100A粘接安装
              </td>
            </tr>

            <tr>
              <td className='label'>2）螺栓参数</td>
              <td>
                外圈-锚栓 M42×4210
                <br />
                M42×4010
                <br />
                标准值：505kN
              </td>
            </tr>
          </tbody>
        </table>

        {/* 2）测点布置 */}
        <div className='sub-title'>3）测点布置</div>

        <table className='doc-table small'>
          <thead>
            <tr>
              <th>传感器编号</th>
              <th>螺栓编号</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{(i + 1) * 11}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3）采样标准 */}
        <table className='doc-table'>
          <tbody>
            <tr>
              <td className='label'>4）采样标准</td>
              <td>
                3次/天
                <br />
                202X年XX月XX日 - 202X年XX月XX日
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};
