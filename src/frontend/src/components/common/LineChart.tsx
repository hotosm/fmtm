import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomLineChart = ({ data, xAxisDataKey, lineOneKey, lineTwoKey, xLabel, yLabel }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          right: 30,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          style={{ fontSize: '12px' }}
          dataKey={xAxisDataKey}
          label={{
            value: `${xLabel}`,
            position: 'insideBottom',
            fontSize: '14px',
            offset: '1',
          }}
        />
        <YAxis
          style={{ fontSize: '12px' }}
          label={{
            value: `${yLabel}`,
            angle: -90,
            fontSize: '14px',
            position: 'insideLeft',
            offset: '8',
            dy: 55,
          }}
        />
        <Tooltip />
        <Legend iconSize={10} iconType="circle" align="left" verticalAlign="top" height={45} />
        <Line type="linear" dataKey={lineOneKey} stroke="#31356E" activeDot={{ r: 6 }} strokeWidth={1.5} />
        <Line type="linear" dataKey={lineTwoKey} stroke="#32A886" activeDot={{ r: 6 }} strokeWidth={1.5} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
