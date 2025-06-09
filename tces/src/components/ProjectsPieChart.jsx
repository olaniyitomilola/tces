import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// dummy data; swap out for real


const COLORS = [
  '#10B981', // green
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#6366F1', // indigo
  '#F43F5E', // rose
  '#22C55E'  // lime green
];

const ProjectsPieChart = ({clients}) => {
  

  return(
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={clients}
        dataKey="shifts"
        nameKey="client"
        outerRadius={100}
        label='client'
      >
        {clients.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
)};

export default ProjectsPieChart;
