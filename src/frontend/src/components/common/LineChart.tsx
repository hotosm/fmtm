import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    Actual: 4000,
    Planned: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    Actual: 3000,
    Planned: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    Actual: 2000,
    Planned: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    Actual: 2780,
    Planned: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    Actual: 1890,
    Planned: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    Actual: 2390,
    Planned: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    Actual: 3490,
    Planned: 4300,
    amt: 2100,
  },
];

const CustomLineChart = () => {
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend iconSize={10} iconType="circle" align="left" verticalAlign="top" height={45} />
        <Line type="linear" dataKey="Planned" stroke="#854C1F" activeDot={{ r: 5 }} />
        <Line type="linear" dataKey="Actual" stroke="#0A8A40" activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
