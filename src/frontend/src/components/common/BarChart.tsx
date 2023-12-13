import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomBarChart = ({ data, xLabel, yLabel, dataKey }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          style={{ fontSize: '12px' }}
          label={{
            value: `${xLabel}`,
            position: 'insideBottom',
            fontSize: '14px',
            offset: '-2',
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
        <Tooltip cursor={{ fill: '#fff3ed' }} />
        <Bar dataKey={dataKey} fill="#FA6E40" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
