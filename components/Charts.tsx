
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, LabelList
} from 'recharts';

interface ComparisonData {
  month: string;
  Meta: number;
  Realizado: number;
}

interface QuarterData {
  name: string;
  Meta: number;
  Realizado: number;
  Atingimento: number;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

const formatBRLAbbr = (val: number) => {
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return val.toString();
};

export const MonthlyComparisonChart: React.FC<{ data: ComparisonData[] }> = ({ data }) => {
  return (
    <div className="h-[550px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 40, right: 30, left: 40, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={14} fontWeight="bold" tickLine={false} axisLine={false} dy={15} />
          <YAxis stroke="#94a3b8" fontSize={14} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '14px' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '40px', fontSize: '14px', fontWeight: 'bold' }} />
          <Bar name="Meta Mensal" dataKey="Meta" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={35}>
             <LabelList dataKey="Meta" position="top" formatter={formatBRLAbbr} style={{ fill: '#64748b', fontSize: '11px', fontWeight: '900' }} offset={10} />
          </Bar>
          <Bar name="Faturamento Real" dataKey="Realizado" fill="#10b981" radius={[6, 6, 0, 0]} barSize={35}>
             <LabelList dataKey="Realizado" position="top" formatter={formatBRLAbbr} style={{ fill: '#10b981', fontSize: '12px', fontWeight: '900' }} offset={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const QuarterlyAnalysisChart: React.FC<{ data: QuarterData[] }> = ({ data }) => {
  return (
    <div className="h-[600px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 40, right: 30, left: 40, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={16} fontWeight="black" tickLine={false} axisLine={false} dy={15} />
          <YAxis stroke="#94a3b8" fontSize={14} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number, name: string) => name === 'Atingimento' ? `${value.toFixed(2)}%` : formatCurrency(value)}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '40px', fontSize: '14px', fontWeight: 'bold' }} />
          <Bar name="Realizado Trimestral" dataKey="Realizado" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={80}>
             <LabelList dataKey="Realizado" position="top" formatter={formatBRLAbbr} style={{ fill: '#a78bfa', fontSize: '14px', fontWeight: '900' }} offset={15} />
          </Bar>
          <Line name="Meta de Referência" type="monotone" dataKey="Meta" stroke="#f43f5e" strokeWidth={5} dot={{ fill: '#f43f5e', r: 8, strokeWidth: 2, stroke: '#fff' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GoalIndicator: React.FC<{ label: string, current: number, target: number }> = ({ label, current, target }) => {
  const valCurrent = Number(current) || 0;
  const valTarget = Number(target) || 0;
  const percent = valTarget > 0 ? (valCurrent / valTarget) * 100 : (valCurrent > 0 ? 100 : 0);
  
  let colorClass = "bg-yellow-500";
  let textClass = "text-yellow-500";
  if (percent >= 100) {
    colorClass = "bg-emerald-500";
    textClass = "text-emerald-500";
  } else if (percent < 80) {
    colorClass = "bg-rose-500";
    textClass = "text-rose-500";
  }

  const displayPercent = percent.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-700/50 flex flex-col justify-between h-full min-h-[180px] shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <span className="text-white font-black text-sm uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-black ${textClass}`}>{displayPercent}%</span>
      </div>
      <div className="space-y-4">
        <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-white/5">
          <div 
            className={`h-4 rounded-full ${colorClass} shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-out`} 
            style={{ width: `${Math.min(percent, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Realizado</span>
            <span className="text-lg text-white font-black">{formatCurrency(valCurrent)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Meta</span>
            <span className="text-sm text-slate-400 font-bold">{formatCurrency(valTarget)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
            itemStyle={{ color: '#f8fafc', fontSize: '14px', fontWeight: 'bold' }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '30px', fontSize: '14px', fontWeight: 'bold' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
