import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

// dummy data; swap out for real


const ShiftsBarChart = ({days}) => {
  const data = [
    { day: 'Sat', count: days.Saturday || 0 },
    { day: 'Sun', count: days.Sunday || 0 },
    { day: 'Mon', count: days.Monday || 0 },
    { day: 'Tue', count: days.Tuesday || 0 },
    { day: 'Wed', count: days.Wednesday || 0 },
    { day: 'Thu', count: days.Thursday || 0},
    { day: 'Fri', count: days.Friday || 0 },
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
