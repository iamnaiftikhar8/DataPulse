'use client';

import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

export default function Sparkline({
  data,
  dataKey = 'y',
}: {
  data: any[];
  dataKey?: string;
}) {
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} strokeOpacity={0.9} fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
