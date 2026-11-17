import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';

const riskColor = (value) =>
  value >= 75 ? 'hsl(var(--destructive))' : value >= 45 ? 'hsl(38 92% 58%)' : 'hsl(142 71% 45%)';

export default function IndustryRiskChart({ industries }) {
  const data = [...industries].sort((a, b) => b.avg_risk - a.avg_risk);

  return (
    <div className="w-full" style={{ height: Math.max(260, data.length * 36) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={128}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--secondary))' }}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 12,
              fontSize: 12,
              color: 'hsl(var(--foreground))',
            }}
            formatter={(value, _name, item) => [
              `${value}% average · ${item?.payload?.count ?? 0} verdicts`,
              'Obsolescence risk',
            ]}
          />
          <Bar dataKey="avg_risk" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={riskColor(entry.avg_risk)} />
            ))}
            <LabelList
              dataKey="avg_risk"
              position="right"
              formatter={(value) => `${value}%`}
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}