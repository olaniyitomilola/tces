import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

// dummy data; swap out for real


const ShiftsBarChart = ({days}) => {
  const data = [
    { day: 'Sat', count: days.Saturday },
    { day: 'Sun', count: days.Sunday },
    { day: 'Mon', count: days.Monday },
    { day: 'Tue', count: days.Tuesday },
    { day: 'Wed', count: days.Wednesday },
    { day: 'Thu', count: days.Thursday },
    { day: 'Fri', count: days.Friday },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#F97316" /> {/* brand orange */}
    </BarChart>
  </ResponsiveContainer>

  )
  
};

export default ShiftsBarChart;
